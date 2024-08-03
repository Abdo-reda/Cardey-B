import type { IGameState } from '@/core/interfaces/gameStateInterface';
import type { IPlayer } from '@/core/interfaces/playerInterface';
import type { Ref } from 'vue';
import type { IMessage } from '@/core/interfaces/messageInterfaces/messageInterface';
import type { IReciever } from '@/core/interfaces/recieverInterface';

export class JoinGameReciever implements IReciever<IPlayer> {
	handle(gameState: Ref<IGameState>, message: IMessage<IPlayer>): void {
		gameState.value.players.push(message.data);
	}
}
