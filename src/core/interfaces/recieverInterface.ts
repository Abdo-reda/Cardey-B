import type { Ref } from 'vue';
import type { IGameState } from './gameStateInterface';
import type { IMessage } from './messageInterfaces/messageInterface';

export interface IReciever<T> {
	handle: (gameState: Ref<IGameState>, message: IMessage<T>) => void;
}
