import type { Reactive } from 'vue';
import type { IPlayer } from './playerInterface';
import type { IMessage } from './messageInterface';

export interface IPlayerService {
	player: Reactive<IPlayer>;
	sendMessage: <T>(message: IMessage<T>) => void;
	joinGameAsync: () => void;
}
