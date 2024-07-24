import type { Reactive } from 'vue';
import type { IPlayer } from '../entities/playerInterface';
import type { IMessage } from '../../common/messageInterface';

export interface IPlayerService {
	player: Reactive<IPlayer>;
	sendMessage: <T>(message: IMessage<T>) => void;
	joinGameAsync: () => void;
}
