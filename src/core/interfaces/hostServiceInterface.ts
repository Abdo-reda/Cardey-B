import type { Reactive, Ref } from 'vue';

export interface IHostService {
	roomId: Ref<string>;
	peerConnections: Reactive<Map<string, RTCPeerConnection>>;
	dataChannels: Reactive<Map<string, RTCDataChannel>>;

	onPlayerJoinedDataChannel?: (playerId: string) => void;
	onPlayerJoinedRecievedMessage?: (playerId: string, message: string) => void;
	sendMessageToPlayers: (message: string, playerIds: string[]) => void;
	sendMessageToAllExcept: (message: string, exlucdedPlayerIds: string[]) => void;
	createNewRoomAsync: () => Promise<string>;
}
