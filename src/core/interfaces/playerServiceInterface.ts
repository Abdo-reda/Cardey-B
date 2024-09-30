import type { IGameState } from './gameStateInterface';
import type { MessageMethodsEnum } from '../enums/methodsEnum';
import type { MessageMethodPayloadMap } from '../constants/messagesMap';
import type { IMessage } from '@/core/interfaces/messageInterfaces/messageInterface';
import type { IPlayerConnectionModel } from '@/core/interfaces/modelInterfaces/playerConnectionModelInterface';

export interface IPlayerService {
	joinGameAsync: () => Promise<void>;
	syncGameState: (gameState: IGameState) => void;
	setupListeners: () => void;
	executeAndSendMessage: <E extends MessageMethodsEnum>(
		method: E,
		data: MessageMethodPayloadMap[E]
	) => void;
	sendGameMessage: <E extends MessageMethodsEnum>(message: IMessage<E>) => void;
	sendChatMessage: (message: string) => void;
	getPlayerRTCConnectionState: () => RTCPeerConnectionState | undefined;
	getDataChannelState: () => RTCDataChannelState | undefined;
	getPlayersConnections: () => IPlayerConnectionModel[];
	disconnect(): void;
}
