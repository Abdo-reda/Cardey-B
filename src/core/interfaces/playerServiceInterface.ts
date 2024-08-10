import type { Reactive } from 'vue';
import type { IPlayer } from './playerInterface';
import type { IMessage } from './messageInterfaces/messageInterface';
import type { IGameState } from './gameStateInterface';
import type { MessageMethodsEnum } from '../enums/methodsEnum';

export interface IPlayerService {
	player: Reactive<IPlayer>;
	sendMessage: <E extends MessageMethodsEnum>(message: IMessage<E>) => void;
	joinGameAsync: () => Promise<void>;
	syncGameState: (gameState: IGameState) => void;
	setupListeners: (callback: (message: IMessage<any>) => void) => void;
}
