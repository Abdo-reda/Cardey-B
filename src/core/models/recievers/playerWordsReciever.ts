import type { IGameState } from '@/core/interfaces/gameStateInterface';
import type { Ref } from 'vue';
import type { IMessage } from '@/core/interfaces/messageInterfaces/messageInterface';
import type { IReciever } from '@/core/interfaces/recieverInterface';
import type { IPlayerWords } from '@/core/interfaces/messageInterfaces/playerWordsInterface';

export class PlayerWordsReciever implements IReciever<IPlayerWords> {
	handle(gameState: Ref<IGameState>, message: IMessage<IPlayerWords>): void {
		const curPlayer = gameState.value.players.find(p => p.id === message.senderId)!;
		if (message.data.reset) {
			curPlayer.words = [];
		} else {
			curPlayer.words = message.data.words;
		}
	}
}
