import type { IMessage } from './messageInterfaces/messageInterface';
import type { MessageMethodsEnum } from '../enums/methodsEnum';

export interface IClientService {
	roomId: string;
	peerConnection: RTCPeerConnection | undefined;
	dataChannel: RTCDataChannel | undefined;
	onRecievedMessage?: (message: IMessage<any>) => void;
	onDataChannelOpen?: () => void;
	onDataChannelClosed?: () => void;
	createJoinRequestAsync: (roomId: string) => Promise<string>;
	sendMessageToHost: <E extends MessageMethodsEnum>(message: IMessage<E>) => void;
	disconnect: () => void;
}
