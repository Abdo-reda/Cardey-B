import type { IGameState } from '@/core/interfaces/gameStateInterface';
import type { Ref } from 'vue';
import { BaseMessage } from './baseMessage';

export class SyncMessage extends BaseMessage<IGameState> {
	handle = (gameState: Ref<IGameState>): void => {
		gameState.value = this.data;
	};
}
