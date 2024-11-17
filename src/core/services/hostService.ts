import type { IHostService } from '../interfaces/hostServiceInterface';
import {
	addDoc,
	collection,
	doc,
	DocumentReference,
	getDoc,
	onSnapshot,
	setDoc,
	updateDoc,
	type DocumentData
} from 'firebase/firestore';
import { cardeyBFireStore } from '@/core/services/firebaseService';
import { FirestoreConstants } from '../constants/firestoreConstants';
import { ChannelsEnum } from '../enums/channelsEnum';
import type { IMessage } from '../interfaces/messageInterfaces/messageInterface';
import type { MessageMethodsEnum } from '../enums/methodsEnum';
import type { IPlayerConnectionModel } from '@/core/interfaces/modelInterfaces/playerConnectionModelInterface';

//maybe create a wrapper for peer connection? extension methods and so on ... I am not sure

export class HostService implements IHostService {
	senderId: string = '';
	roomId: string;
	peerConnections: Map<string, RTCPeerConnection>;
	gameDataChannels: Map<string, RTCDataChannel>;
	chatDataChannels: Map<string, RTCDataChannel>;
	restartIce: boolean = false;

	onPlayerJoinedDataChannel?: (playerId: string) => void;
	onPlayerDisconnected?: (playerId: string) => void;
	onRecievedMessage?: (channel: ChannelsEnum, playerId: string, message: IMessage<any>) => void;

	constructor() {
		this.roomId = '';
		this.peerConnections = new Map();
		this.gameDataChannels = new Map();
		this.chatDataChannels = new Map();
	}

	sendMessageToPlayers<E extends MessageMethodsEnum>(
		channel: ChannelsEnum,
		message: IMessage<E>,
		playerIds: string[] = []
	): void {
		playerIds.forEach((playerId) => {
			let dataChannel;
			if (channel === ChannelsEnum.GAME_DATA) {
				dataChannel = this.gameDataChannels.get(playerId);
			} else if (channel === ChannelsEnum.CHAT) {
				dataChannel = this.chatDataChannels.get(playerId);
			}
			if (dataChannel && dataChannel.readyState === 'open')
				dataChannel.send(JSON.stringify(message, this.jsonParser));
		});
	}

	sendMessageToAllExcept<E extends MessageMethodsEnum>(
		channel: ChannelsEnum,
		message: IMessage<E>,
		exlucdedPlayerIds: string[] = []
	): void {
		let dataChannels;
		if (channel === ChannelsEnum.GAME_DATA) {
			dataChannels = this.gameDataChannels;
		} else if (channel === ChannelsEnum.CHAT) {
			dataChannels = this.chatDataChannels;
		}
		dataChannels?.forEach((dataChannel, playerId) => {
			if (!exlucdedPlayerIds.includes(playerId) && dataChannel.readyState === 'open') {
				dataChannel.send(JSON.stringify(message, this.jsonParser));
			}
		});
	}

	async createNewRoomAsync(): Promise<string> {
		const roomsCollection = collection(cardeyBFireStore, FirestoreConstants.roomsCollection);
		const newRoomId = await this.getUniqueRoomIdAsync();
		const roomDocRef = doc(roomsCollection, newRoomId);
		await setDoc(roomDocRef, {});

		console.log('--- Creating New room id: ', roomDocRef.id);
		this.listenToRoomJoinRequests(roomDocRef);
		this.roomId = roomDocRef.id;
		this.senderId = this.roomId;
		return roomDocRef.id;
	}

	private async getUniqueRoomIdAsync(): Promise<string> {
		const roomsCollection = collection(cardeyBFireStore, FirestoreConstants.roomsCollection);
		let newRoomId;
		let roomRef;
		let roomSnapshot;
		do {
			newRoomId = this.generateRoomId();
			roomRef = doc(roomsCollection, newRoomId);
			roomSnapshot = await getDoc(roomRef);
		} while (roomSnapshot.exists());

		return newRoomId;
	}

	private generateRoomId(): string {
		const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
		let roomId = '';
		for (let i = 0; i < 4; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length);
			roomId += characters[randomIndex];
		}
		return roomId;
	}

	private listenToRoomJoinRequests(roomDoc: DocumentReference<DocumentData, DocumentData>): void {
		console.log('--- Listening to Room Join Requests');

		const roomJoinRequestsCollection = collection(
			roomDoc,
			FirestoreConstants.joinRequestsCollection
		);

		onSnapshot(roomJoinRequestsCollection, (snapshot) => {
			console.log('JoinRequests Collection changes: ', snapshot.docChanges());

			snapshot.docChanges().forEach(async (change) => {
				if (change.type === 'added') {
					const joinRequestDoc = change.doc.ref;
					console.log('A new join request has been added: ', joinRequestDoc);
					if (joinRequestDoc) {
						await this.createPeerConnectionAsync(joinRequestDoc);
					}
				}
			});
		});
	}

	/**
	 * Creates a peer connection for a given joinRequest (a new player), this sets the offer candidate and listens for answer candidates
	 * @param joinRequestDoc
	 */
	private async createPeerConnectionAsync(
		joinRequestDoc: DocumentReference<DocumentData>
	): Promise<void> {
		console.log('--- Creating Peer Connection, joinRequestDoc', joinRequestDoc);
		const offerCandidates = collection(
			joinRequestDoc,
			FirestoreConstants.offerCandidatesCollection
		);

		const pc = new RTCPeerConnection(FirestoreConstants.serversConfiguration);

		this.createGameDataChannel(joinRequestDoc.id, pc);
		this.createChatDataChannel(joinRequestDoc.id, pc);

		pc.onicecandidate = async (event) => {
			if (event.candidate) await addDoc(offerCandidates, event.candidate.toJSON());
		};

		pc.onconnectionstatechange = async () => {
			const state = pc.connectionState;
			console.log('connection state changed, state: ', state)
			if (state === "disconnected" || state === "failed") {
				console.log(`ICE connection is in state: ${state}. Starting ICE restart...`);
				await this.performRestart(pc, joinRequestDoc);
			  }
		}
		// create offer
		const offerDescription = await pc.createOffer();
		await pc.setLocalDescription(new RTCSessionDescription(offerDescription));

		// config for offer
		const offer = {
			sdp: offerDescription.sdp,
			type: offerDescription.type
		};

		await updateDoc(joinRequestDoc, { offer });

		this.listenToAnswerCandidates(pc, joinRequestDoc);

		// Register peer connection listeners
		//this.registerPeerConnectionListeners(pc, joinRequestDoc.id);
		this.peerConnections.set(joinRequestDoc.id, pc);	
	}

	private async performRestart(pc: RTCPeerConnection, joinRequestDoc: DocumentReference<DocumentData>){
			// create offer
			this.restartIce = true;
			const offerDescription = await pc.createOffer({iceRestart: true});
			await pc.setLocalDescription(new RTCSessionDescription(offerDescription));
			// config for offer
			const offer = {
				sdp: offerDescription.sdp,
				type: offerDescription.type
			};
			const restartIce = {
				restart: true
			};
	
			await updateDoc(joinRequestDoc, { offer, restartIce });
	}

	private createGameDataChannel(playerId: string, pc: RTCPeerConnection) {
		console.log('--- Creating Data Channel');
		const dataChannel = pc.createDataChannel(ChannelsEnum.GAME_DATA);

		dataChannel.onopen = () => {
			console.log(`Data channel open with player ${playerId}`);
			// this.sendMessageToAllExcept(`New Player Joined, say hi! ${playerId}`);
			if (this.onPlayerJoinedDataChannel) this.onPlayerJoinedDataChannel(playerId);
		};

		dataChannel.onmessage = (event: MessageEvent<string>) => {
			// console.log(`Received data from player ${playerId}:`, event.data);
			const message = JSON.parse(event.data) as IMessage<any>;
			if (this.onRecievedMessage)
				this.onRecievedMessage(ChannelsEnum.GAME_DATA, playerId, message);
		};

		dataChannel.onclose = () => {
			console.log(`Data channel closed with player ${playerId}`);
			this.disconnectPlayer(playerId);
		};

		this.gameDataChannels.set(playerId, dataChannel);
	}

	//TODO: imrpove this bls, mix it with the above function
	private createChatDataChannel(playerId: string, pc: RTCPeerConnection) {
		console.log('--- Creatingchat Data Channel');
		const dataChannel = pc.createDataChannel(ChannelsEnum.CHAT);

		dataChannel.onopen = () => {
			console.log(`Chat Data channel open with player ${playerId}`);
		};

		dataChannel.onmessage = (event: MessageEvent<string>) => {
			// console.log(`Received data from player ${playerId}:`, event.data);
			const message = JSON.parse(event.data) as IMessage<any>;
			if (this.onRecievedMessage)
				this.onRecievedMessage(ChannelsEnum.CHAT, playerId, message);
		};

		dataChannel.onclose = () => {
			console.log(`Chat Data channel closed with player ${playerId}`);
		};

		this.chatDataChannels.set(playerId, dataChannel);
	}

	/**
	 * Listens to answer candidates and sets the remote description of the peer connection
	 * @param pc
	 * @param joinRequestDoc
	 */
	private listenToAnswerCandidates(
		pc: RTCPeerConnection,
		joinRequestDoc: DocumentReference<DocumentData>
	) {
		console.log('---- listen to answer candidates');
		const answerCandidates = collection(
			joinRequestDoc,
			FirestoreConstants.answerCandidatesCollection
		);

		onSnapshot(joinRequestDoc, (snapshot) => {
			console.log('-- join request changed');
			const data = snapshot.data();

			if ((!pc.currentRemoteDescription || this.restartIce) && data?.answer) {
				console.log('--- setting remote Description, answer: ', data.answer)
				const answerDescription = new RTCSessionDescription(data.answer);
				pc.setRemoteDescription(answerDescription);
				this.restartIce = false;
			}
		});

		// if answered add candidates to peer connection
		onSnapshot(answerCandidates, (snapshot) => {
			console.log('--- answer Candidates Added or modified')
			snapshot.docChanges().forEach((change) => {
				if (change.type === 'added') {
					const candidate = new RTCIceCandidate(change.doc.data());
					pc.addIceCandidate(candidate);
				}
			});
		});
	}

	sendChatMessage(message: IMessage<MessageMethodsEnum.CHAT>, except: string[] = []) {
		this.sendMessageToAllExcept(ChannelsEnum.CHAT, message, except);
	}

	disconnect(): void {
		this.gameDataChannels?.forEach((dataChannel) => {
			dataChannel.close();
		});
		this.peerConnections?.forEach((peerConnection) => {
			peerConnection.close();
		});
		this.roomId = '';
		this.peerConnections.clear();
		this.gameDataChannels.clear();
		this.chatDataChannels.clear();
	}

	private jsonParser(key: string, value: any) {
		if (key === 'useGameState' || key === 'useRoomChat' || key === 'usePlayer')
			return undefined;
		return value;
	}

	getPlayerRTCConnectionState(): RTCPeerConnectionState | undefined {
		if (this.peerConnections.size === 0) return undefined;
		const playerConnection = this.peerConnections.values().next().value;
		return playerConnection!.connectionState;
	}

	getDataChannelConnectionState(): RTCDataChannelState | undefined {
		if (this.gameDataChannels.size === 0) return undefined;
		const dataChannel = this.gameDataChannels.values().next().value;
		return dataChannel!.readyState;
	}

	getPlayerConnections(): IPlayerConnectionModel[] {
		const playerConnections: IPlayerConnectionModel[] = [];
		this.gameDataChannels.forEach((dataChannel, playerId) => {
			playerConnections.push({
				id: playerId,
				name: playerId,
				DataChannelState: dataChannel.readyState,
				RTCPeerConnectionState: this.peerConnections.get(playerId)?.connectionState
			});
		});
		return playerConnections;
	}
	//deprecated
	private registerPeerConnectionListeners(peerConnection: RTCPeerConnection, playerId: string) {
		peerConnection.onconnectionstatechange = () => {
			console.log('--- player connection state changed', peerConnection.connectionState);
			if ((peerConnection.connectionState === 'failed')) {
				this.disconnectPlayer(playerId)
			}
		};
	}
	
	private disconnectPlayer(playerId: string) {
		console.log('--- disconnecting player', playerId);
		if (this.onPlayerDisconnected) this.onPlayerDisconnected(playerId);
		
		console.log('--- closing channels and connections');
		this.gameDataChannels.get(playerId)?.close();
		this.gameDataChannels.delete(playerId);
		this.chatDataChannels.get(playerId)?.close();
		this.chatDataChannels.delete(playerId);
		this.peerConnections.get(playerId)?.close();
		this.peerConnections.delete(playerId);
		
		console.log('--- player disconnected');
	}
}
