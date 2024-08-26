import { MessageMethodsEnum } from '@/core/enums/methodsEnum';
import { BaseMessage } from './baseMessage';

export class UpdateTurnMessage extends BaseMessage<MessageMethodsEnum.UPDATE_TURN> {
	constructor() {
		super(MessageMethodsEnum.UPDATE_TURN);
	}

	handle(): void {
		this.useGameState.resetWords();
		this.useGameState.updateTurn();
	}
}
