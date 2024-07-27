import type { Reactive } from 'vue';
import type { IPlayer } from './playerInterface';
import type { IMessage } from './messageInterface';
import type { IJoinTeam } from './dataMessagesInterfaces/joinTeamInterface';
import type { IGameState } from './gameStateInterface';

export interface IPlayerService {
	player: Reactive<IPlayer>;
	sendMessage: <T>(message: IMessage<T>) => void;
	joinGameAsync: () => void;
	joinTeam: (gameState: IGameState, data: IJoinTeam) => void;
	setupListeners: (callback: (message: IMessage<any>) => void) => void;
}
