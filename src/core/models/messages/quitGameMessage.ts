import { MessageMethodsEnum } from '@/core/enums/methodsEnum';
import { BaseMessage } from './baseMessage';

export class QuitGameMessage extends BaseMessage<MessageMethodsEnum.QUIT_GAME> {
	constructor() {
		super(MessageMethodsEnum.QUIT_GAME);
	}

	handle(): void {
		this.useGameState.terminateGame();
	}
}
