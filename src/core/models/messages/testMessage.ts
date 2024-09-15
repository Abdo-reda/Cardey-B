import { MessageMethodsEnum } from '@/core/enums/methodsEnum';
import { BaseMessage } from './baseMessage';
import { message } from 'ant-design-vue';

export class TestMessage extends BaseMessage<MessageMethodsEnum.TEST> {
	constructor() {
		super(MessageMethodsEnum.TEST);
	}

	handle(): void {
		message.info(this.data);
	}
}
