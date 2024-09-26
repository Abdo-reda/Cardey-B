import type { MessageMethodsEnum } from '../enums/methodsEnum';
import type { IMessage } from './messageInterfaces/messageInterface';

export interface IBaseWebRTCService {
	senderId: string;
	roomId: string;
	disconnect: () => void;
	sendChatMessage: (message: IMessage<MessageMethodsEnum.CHAT>, except?: string[]) => void;
}
