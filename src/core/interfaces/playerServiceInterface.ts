import type { IGameState } from './gameStateInterface';
import type { MessageMethodsEnum } from '../enums/methodsEnum';
import type { MessageMethodPayloadMap } from '../constants/messagesMap';

export interface IPlayerService {
	joinGameAsync: () => Promise<void>;
	syncGameState: (gameState: IGameState) => void;
	setupListeners: () => void;
	executeAndSendMessage: <E extends MessageMethodsEnum>(
		method: E,
		data: MessageMethodPayloadMap[E]
	) => void;

	disconnect(): void
}
