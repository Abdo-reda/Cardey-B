import { ref, type Ref } from 'vue';
import type { IClientService } from '../interfaces/clientServiceInterface';
import {
	addDoc,
	collection,
	doc,
	DocumentReference,
	getDoc,
	onSnapshot,
	updateDoc,
	type DocumentData
} from 'firebase/firestore';
import { cardeyBFireStore } from './firebaseService';
import { FirestoreConstants } from '../constants/firestoreConstants';
import { ChannelsEnum } from '../enums/channelsEnum';
import type { IMessage } from '../interfaces/messageInterface';

export class ClientService implements IClientService {
	roomId: Ref<string>;
	peerConnection: RTCPeerConnection | undefined;
	dataChannel: RTCDataChannel | undefined;
	onRecievedMessage?: (message: IMessage<any>) => void;
	onDataChannelOpen?: () => void;

	constructor() {
		this.roomId = ref('');
	}

	async createJoinRequestAsync(roomId: string): Promise<string> {
		const joinRequestRef = await this.addJoinRequestAsync(roomId);
		this.listenForJoinRequestChanges(joinRequestRef);
		return joinRequestRef.id;
	}

	private async addJoinRequestAsync(
		roomId: string
	): Promise<DocumentReference<DocumentData, DocumentData>> {
		console.log('Player is creating a join request to room: ', roomId);

		const roomsCollection = collection(cardeyBFireStore, FirestoreConstants.roomsCollection);
		const roomRef = doc(roomsCollection, roomId);
		const roomSnapshot = await getDoc(roomRef);
		if (roomSnapshot.exists()) {
			console.log('Room exists:', roomSnapshot.data());
		} else {
			console.log('Room does not exist');
			throw new Error('Room does not exist');
		}

		const joinRequestsCollection = collection(
			roomRef,
			FirestoreConstants.joinRequestsCollection
		);

		//Creating a new join request object, so that the host is notified that a player wants to join, and can create offer and so on ..
		const joinRequestRef = await addDoc(joinRequestsCollection, {});
		return joinRequestRef;
	}

	listenForJoinRequestChanges(joinRequestRef: DocumentReference<DocumentData, DocumentData>) {
		onSnapshot(joinRequestRef, async (doc) => {
			const joinRequestDoc = doc.data();

			console.log('---- peer connection', this.peerConnection);
			if (!this.peerConnection && joinRequestDoc?.offer) {
				console.log('Offer has been set:', joinRequestDoc.offer);

				const pc = new RTCPeerConnection(FirestoreConstants.serversConfiguration);
				this.peerConnection = pc;

				this.registerAnswerCandidates(pc, joinRequestRef);
				this.registerDataChannels(pc);
				this.listenToOfferCandidates(pc, joinRequestRef);

				// setting the remote data with offerDescription
				const offerDescription = joinRequestDoc.offer;
				await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

				// setting the local data as the answer
				const answerDescription = await pc.createAnswer();
				await pc.setLocalDescription(new RTCSessionDescription(answerDescription));
				// answer config
				const answer = {
					type: answerDescription.type,
					sdp: answerDescription.sdp
				};

				await updateDoc(joinRequestRef, { answer });
			}
		});
	}

	private registerDataChannels(pc: RTCPeerConnection) {
		pc.ondatachannel = (event) => {
			const dataChannel = event.channel;
			if (dataChannel.label === ChannelsEnum.GAME_DATA) {
				this.dataChannel = dataChannel;
			}

			dataChannel.onopen = () => {
				console.log('Data channel open');
				if (this.onDataChannelOpen) this.onDataChannelOpen();
			};

			dataChannel.onmessage = (event: MessageEvent<string>) => {
				console.log('Client Service - Received data:', event.data);
				const message = JSON.parse(event.data) as IMessage<any>;
				if (this.onRecievedMessage) this.onRecievedMessage(message);
			};
		};
	}

	private registerAnswerCandidates(
		pc: RTCPeerConnection,
		joinRequestRef: DocumentReference<DocumentData>
	) {
		const answerCandidates = collection(
			joinRequestRef,
			FirestoreConstants.answerCandidatesCollection
		);

		pc.onicecandidate = async (event) => {
			if (event.candidate) {
				await addDoc(answerCandidates, event.candidate.toJSON());
			}
		};
	}

	private listenToOfferCandidates(
		pc: RTCPeerConnection,
		joinRequestRef: DocumentReference<DocumentData>
	) {
		const offerCandidates = collection(
			joinRequestRef,
			FirestoreConstants.offerCandidatesCollection
		);

		onSnapshot(offerCandidates, (snapshot) => {
			snapshot.docChanges().forEach((change) => {
				if (change.type === 'added') {
					const candidate = new RTCIceCandidate(change.doc.data());
					pc.addIceCandidate(candidate);
				}
			});
		});
	}

	sendMessageToHost<T>(message: IMessage<T>): void {
		this.dataChannel?.send(JSON.stringify(message));
	}
}
