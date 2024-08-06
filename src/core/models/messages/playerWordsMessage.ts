import { MethodsEnum } from '@/core/enums/methodsEnum';
import { BaseMessage } from './baseMessage';
import type { IGameState } from '@/core/interfaces/gameStateInterface';
import type { Ref } from 'vue';

export class PlayerWordsMessage extends BaseMessage<MethodsEnum.UPDATE_WORDS> {
	constructor() {
		super(MethodsEnum.UPDATE_WORDS);
	}

	handle(gameState: Ref<IGameState>): void {
		const curPlayer = gameState.value.players.find(p => p.id === this.senderId)!;
		if (this.data.reset) {
			curPlayer.words = [];
		} else {
			curPlayer.words = this.data.words;
		}
	}
}
