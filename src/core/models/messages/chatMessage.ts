import { MessageMethodsEnum } from '@/core/enums/methodsEnum';
import { BaseMessage } from './baseMessage';

export class ChatMessage extends BaseMessage<MessageMethodsEnum.CHAT> {
	constructor() {
		super(MessageMethodsEnum.CHAT);
	}

	handle(): void {
	
	}
}
