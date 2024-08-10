import { MessageMethodsEnum } from '@/core/enums/methodsEnum';
import { BaseMessage } from './baseMessage';
import type { Ref } from 'vue';
import type { IGameState } from '@/core/interfaces/gameStateInterface';

export class UpdateTurnMessage extends BaseMessage<MessageMethodsEnum.UPDATE_TURN> {
	constructor() {
		super(MessageMethodsEnum.UPDATE_TURN);
	}

	handle(gameState: Ref<IGameState>): void {
		gameState.value.turns.currentPlayerIndex =
			(gameState.value.turns.currentPlayerIndex + 1) %
			gameState.value.turns.playersOrder.length;
	}
}
