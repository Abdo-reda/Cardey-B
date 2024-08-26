import { MessageMethodsEnum } from '@/core/enums/methodsEnum';
import { BaseMessage } from './baseMessage';

export class PlayerWordsMessage extends BaseMessage<MessageMethodsEnum.UPDATE_WORDS> {
	constructor() {
		super(MessageMethodsEnum.UPDATE_WORDS);
	}

	handle(): void {
		const words = this.data.reset ? [] : this.data.words;
		this.useGameState.setPlayerWords(this.senderId, words);
	}
}
