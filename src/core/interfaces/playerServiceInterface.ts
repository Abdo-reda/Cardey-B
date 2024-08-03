import type { Reactive } from 'vue';
import type { IPlayer } from './playerInterface';
import type { IMessage } from './messageInterfaces/messageInterface';
import type { IJoinTeam } from './messageInterfaces/joinTeamInterface';
import type { IGameState } from './gameStateInterface';

export interface IPlayerService {
	player: Reactive<IPlayer>;
	sendMessage: <T>(message: IMessage<T>) => void;
	joinGameAsync: () => Promise<void>;
	joinTeam: (gameState: IGameState, data: IJoinTeam) => void;
	syncGameState: (gameState: IGameState) => void;
	setupListeners: (callback: (message: IMessage<any>) => void) => void;
}
