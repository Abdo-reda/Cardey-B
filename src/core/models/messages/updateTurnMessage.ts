import { MessageMethodsEnum } from '@/core/enums/methodsEnum';
import { BaseMessage } from './baseMessage';
import type { Ref } from 'vue';
import type { IGameState } from '@/core/interfaces/gameStateInterface';

export class UpdateTurnMessage extends BaseMessage<MessageMethodsEnum.UPDATE_TURN> {
	constructor() {
		super(MessageMethodsEnum.UPDATE_TURN);
	}

	handle(gameState: Ref<IGameState>): void {
		const remainingWords = [
			...gameState.value.words.remaining,
			...gameState.value.words.skipped
		];
		const shuffledWords = [];
		while (remainingWords.length !== 0) {
			const randomIndex = Math.floor(Math.random() * remainingWords.length);
			const removedWord = remainingWords.splice(randomIndex, 1)[0];
			shuffledWords.push(removedWord);
		}
		gameState.value.words.remaining = shuffledWords;
		gameState.value.words.skipped = [];
		gameState.value.turns.currentPlayerIndex =
			(gameState.value.turns.currentPlayerIndex + 1) %
			gameState.value.turns.playersOrder.length;
	}
}
