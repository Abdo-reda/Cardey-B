import type { IGameState } from '@/core/interfaces/gameStateInterface';
import type { IMessage } from '@/core/interfaces/messageInterface';
import type { Ref } from 'vue';

export class BaseMessage<T> implements IMessage<T> {
	senderId: string;
	data: T;

	constructor(senderId: string, data: T) {
		this.senderId = senderId;
		this.data = data;
	}

	handle = (gameState: Ref<IGameState>): void => {};
}
