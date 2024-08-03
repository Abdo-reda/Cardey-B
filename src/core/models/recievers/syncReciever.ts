import type { IGameState } from '@/core/interfaces/gameStateInterface';
import type { Ref } from 'vue';
import type { IMessage } from '@/core/interfaces/messageInterfaces/messageInterface';
import type { IReciever } from '@/core/interfaces/recieverInterface';

export class SyncReciever implements IReciever<IGameState> {
	handle(gameState: Ref<IGameState>, message: IMessage<IGameState>): void {
		gameState.value = message.data;
	}
}
