import type { IGameState } from '@/core/interfaces/gameStateInterface';
import type { IPlayer } from '@/core/interfaces/playerInterface';
import type { Ref } from 'vue';
import { BaseMessage } from './baseMessage';

export class JoinGameMessage extends BaseMessage<IPlayer> {
	handle = (gameState: Ref<IGameState>): void => {
		gameState.value.players.push(this.data);
	};
}
