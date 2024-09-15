import type { Reactive } from 'vue';
import type { IMessage } from './messageInterfaces/messageInterface';
import type { MessageMethodsEnum } from '../enums/methodsEnum';

export interface IHostService {
	roomId: string;
	peerConnections: Reactive<Map<string, RTCPeerConnection>>;
	dataChannels: Reactive<Map<string, RTCDataChannel>>;

	onPlayerJoinedDataChannel?: (playerId: string) => void;
	onPlayerClosedDataChannel?: (playerId: string) => void;
	onRecievedMessage?: (playerId: string, message: IMessage<any>) => void;
	sendMessageToPlayers: <E extends MessageMethodsEnum>(
		message: IMessage<E>,
		playerIds: string[]
	) => void;
	sendMessageToAllExcept: <E extends MessageMethodsEnum>(
		message: IMessage<E>,
		exlucdedPlayerIds: string[]
	) => void;
	createNewRoomAsync: () => Promise<string>;
}
