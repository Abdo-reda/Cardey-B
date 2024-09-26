import type { IMessage } from './messageInterfaces/messageInterface';
import type { MessageMethodsEnum } from '../enums/methodsEnum';
import type { IBaseWebRTCService } from './baseWebRTCServiceInterface';
import type { ChannelsEnum } from '../enums/channelsEnum';

export interface IClientService extends IBaseWebRTCService {
	peerConnection: RTCPeerConnection | undefined;
	gameDataChannel: RTCDataChannel | undefined;
	onRecievedMessage?: (channel: ChannelsEnum, message: IMessage<any>) => void;
	onDataChannelOpen?: (channel: ChannelsEnum) => void;
	onDataChannelClosed?: (channel: ChannelsEnum) => void;
	createJoinRequestAsync: (roomId: string) => Promise<string>;
	sendMessageToHost: <E extends MessageMethodsEnum>(channel: ChannelsEnum, message: IMessage<E>) => void;
}
