import type { IClientService } from '../interfaces/clientServiceInterface';
import {
	addDoc,
	collection,
	deleteField,
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
import type { IMessage } from '../interfaces/messageInterfaces/messageInterface';
import type { MessageMethodsEnum } from '../enums/methodsEnum';
import type { IPlayerConnectionModel } from '@/core/interfaces/modelInterfaces/playerConnectionModelInterface';

export class ClientService implements IClientService {
	senderId: string = '';
	roomId: string = '';
	peerConnection: RTCPeerConnection | undefined;
	private isDisconnectedFlag = false;
	chatDataChannel: RTCDataChannel | undefined;
	gameDataChannel: RTCDataChannel | undefined;
	onRecievedMessage?: (channel: ChannelsEnum, message: IMessage<any>) => void;
	onDataChannelOpen?: (channel: ChannelsEnum) => void;
	onDataChannelClosed?: (channel: ChannelsEnum) => void;

	async createJoinRequestAsync(roomId: string): Promise<string> {
		const joinRequestRef = await this.addJoinRequestAsync(roomId);
		this.listenForJoinRequestChanges(joinRequestRef);
		this.senderId = joinRequestRef.id;
		return this.senderId;
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
			if ((!this.peerConnection && joinRequestDoc?.offer) || joinRequestDoc?.restartIce) {
				console.log('Offer has been set:', joinRequestDoc.offer);
				
				if(!joinRequestDoc?.restartIce){		
					const pc = new RTCPeerConnection(FirestoreConstants.serversConfiguration);
					this.peerConnection = pc;
				}

				this.registerAnswerCandidates(this.peerConnection!, joinRequestRef);
				
				if(!joinRequestDoc?.restartIce){
					this.registerDataChannels(this.peerConnection!);
				}else{
					const data = {
						restartIce: deleteField()
					};
					await updateDoc(joinRequestRef, data)
				}
				this.listenToOfferCandidates(this.peerConnection!, joinRequestRef);

				// setting the remote data with offerDescription
				const offerDescription = joinRequestDoc.offer;
				await this.peerConnection!.setRemoteDescription(new RTCSessionDescription(offerDescription));

				// setting the local data as the answer
				const answerDescription = await this.peerConnection!.createAnswer();
				await this.peerConnection!.setLocalDescription(new RTCSessionDescription(answerDescription));
				// answer config
				const answer = {
					type: answerDescription.type,
					sdp: answerDescription.sdp
				};

				await updateDoc(joinRequestRef, { answer });
				this.isDisconnectedFlag = false;
			}
		});
	}

	private registerDataChannels(pc: RTCPeerConnection) {
		pc.ondatachannel = (event) => {
			const dataChannel = event.channel;
			this.handleDataChannel(dataChannel.label as ChannelsEnum, dataChannel);
			if (dataChannel.label === ChannelsEnum.GAME_DATA) {
				this.gameDataChannel = dataChannel;
			} else if (dataChannel.label === ChannelsEnum.CHAT) {
				this.chatDataChannel = dataChannel;
			}
		};
	}

	private handleDataChannel(channel: ChannelsEnum, dataChannel: RTCDataChannel) {
		dataChannel.onopen = () => {
			console.log('Client webRTC Data channel open', this.onDataChannelOpen);
			if (this.onDataChannelOpen) this.onDataChannelOpen(channel);
		};

		dataChannel.onmessage = (event: MessageEvent<string>) => {
			// console.log('Client webRTC Service - Received message/data:', event.data);
			const message = JSON.parse(event.data) as IMessage<any>;
			if (this.onRecievedMessage) this.onRecievedMessage(channel, message);
		};

		dataChannel.onclose = () => {
			console.log(`Data Channel ${channel} with Host is closed!`);
			if (this.onDataChannelClosed && !this.isDisconnectedFlag)
				this.onDataChannelClosed(channel);
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

	sendMessageToHost<E extends MessageMethodsEnum>(
		channel: ChannelsEnum,
		message: IMessage<E>
	): void {
		const parsedMessage = JSON.stringify(message, this.jsonParser);
		// If there are too many channels, we should create a map.
		if (channel === ChannelsEnum.GAME_DATA) {
			this.gameDataChannel?.send(parsedMessage);
		} else if (channel === ChannelsEnum.CHAT) {
			this.chatDataChannel?.send(parsedMessage);
		}
	}

	sendChatMessage(message: IMessage<MessageMethodsEnum.CHAT>) {
		this.sendMessageToHost(ChannelsEnum.CHAT, message);
	}

	//TODO: I fucking hate this, but testing to see if this is the problem
	private jsonParser(key: string, value: any) {
		if (key === 'useGameState' || key === 'useRoomChat' || key === 'usePlayer')
			return undefined;
		return value;
	}

	disconnect(): void {
		this.isDisconnectedFlag = true;
		this.gameDataChannel?.close();
		this.peerConnection?.close(); // close? 🤔
		this.peerConnection = undefined;
		this.senderId = '';
		this.roomId = '';
	}

	getPlayerRTCConnectionState(): RTCPeerConnectionState | undefined {
		return this.peerConnection?.connectionState;
	}

	getDataChannelConnectionState(): RTCDataChannelState | undefined {
		return this.gameDataChannel?.readyState;
	}

	getPlayerConnections(): IPlayerConnectionModel[] {
		const playerConnections: IPlayerConnectionModel[] = [];
		playerConnections.push({
			DataChannelState: this.getDataChannelConnectionState(),
			RTCPeerConnectionState: this.getPlayerRTCConnectionState()
		});
		return playerConnections;
	}

	//deprecated
	private registerPeerConnectionListener(pc: RTCPeerConnection) {
		pc.onconnectionstatechange = () => {
			if (pc.connectionState === 'failed') this.disconnect();
		}
	}
}
