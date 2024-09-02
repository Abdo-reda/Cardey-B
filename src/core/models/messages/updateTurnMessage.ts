import { MessageMethodsEnum } from '@/core/enums/methodsEnum';
import { BaseMessage } from './baseMessage';

export class UpdateTurnMessage extends BaseMessage<MessageMethodsEnum.UPDATE_TURN> {
	constructor() {
		super(MessageMethodsEnum.UPDATE_TURN);
	}

	handle(): void {
		if (this.data.newTurn) {
			this.useGameState.nextTurn();
			this.useGameState.resetWords();
		} else {
			this.useGameState.isNewTurn.value = false;
		}
	}
}
