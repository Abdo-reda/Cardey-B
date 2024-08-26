import { MessageMethodsEnum } from '@/core/enums/methodsEnum';
import { BaseMessage } from './baseMessage';

export class JoinGameMessage extends BaseMessage<MessageMethodsEnum.JOIN_GAME> {
	constructor() {
		super(MessageMethodsEnum.JOIN_GAME);
	}

	handle(): void {
		this.useGameState.addPlayer(this.data);
	}
}
