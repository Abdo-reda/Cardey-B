import { MessageMethodsEnum } from '@/core/enums/methodsEnum';
import { BaseMessage } from './baseMessage';

export class PlayWordMessage extends BaseMessage<MessageMethodsEnum.PLAY_WORD> {
	constructor() {
		super(MessageMethodsEnum.PLAY_WORD);
	}

	handle(): void {
		const type = this.data.type;
		if (type === 'score') {
			this.useGameState.scoreWord(this.data.teamId);
		} else {
			this.useGameState.skipWord();
		}
	}
}
