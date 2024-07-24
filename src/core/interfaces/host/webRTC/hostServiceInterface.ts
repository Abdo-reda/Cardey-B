import type { Reactive, Ref } from 'vue';
import type { IMessage } from '../../common/messageInterface';

export interface IHostService {
	roomId: Ref<string>;
	peerConnections: Reactive<Map<string, RTCPeerConnection>>;
	dataChannels: Reactive<Map<string, RTCDataChannel>>;

	onPlayerJoinedDataChannel?: (playerId: string) => void;
	onRecievedMessage?: (playerId: string, message: IMessage<any>) => void;
	sendMessageToPlayers: <T>(message: IMessage<T>, playerIds: string[]) => void;
	sendMessageToAllExcept: <T>(message: IMessage<T>, exlucdedPlayerIds: string[]) => void;
	createNewRoomAsync: () => Promise<string>;
}
