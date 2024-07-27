import type { Ref } from 'vue';
import type { IGameState } from './gameStateInterface';

export interface IMessage<T> {
	senderId: string;
	data?: T;
	handle: (gameState: Ref<IGameState>) => void; //maybe return a new game state?
}
