import type { MessageMethodsEnum } from '../enums/methodsEnum';
import type { IMessage } from './messageInterfaces/messageInterface';

import type { IPlayerConnectionModel } from '@/core/interfaces/modelInterfaces/playerConnectionModelInterface';

export interface IBaseWebRTCService {
	senderId: string;
	roomId: string;
	disconnect: () => void;
	sendChatMessage: (message: IMessage<MessageMethodsEnum.CHAT>, except?: string[]) => void;
	getPlayerRTCConnectionState(): RTCPeerConnectionState | undefined;
	getDataChannelConnectionState(): RTCDataChannelState | undefined;
	getPlayerConnections(): IPlayerConnectionModel[];
}
