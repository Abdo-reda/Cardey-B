import type { IMessage } from './messageInterfaces/messageInterface';
import type { MessageMethodsEnum } from '../enums/methodsEnum';
import type { IBaseWebRTCService } from './baseWebRTCServiceInterface';
import type { ChannelsEnum } from '../enums/channelsEnum';

export interface IHostService extends IBaseWebRTCService {
	peerConnections: Map<string, RTCPeerConnection>;
	gameDataChannels: Map<string, RTCDataChannel>;

	onPlayerJoinedDataChannel?: (playerId: string) => void;
	onPlayerDisconnected?: (playerId: string) => void;
	onRecievedMessage?: (channel: ChannelsEnum, playerId: string, message: IMessage<any>) => void;
	sendMessageToPlayers: <E extends MessageMethodsEnum>(
		channel: ChannelsEnum,
		message: IMessage<E>,
		playerIds: string[]
	) => void;
	sendMessageToAllExcept: <E extends MessageMethodsEnum>(
		channel: ChannelsEnum,
		message: IMessage<E>,
		exlucdedPlayerIds?: string[]
	) => void;
	createNewRoomAsync: () => Promise<string>;
}
