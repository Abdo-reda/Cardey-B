import { MessageMethodsEnum } from '@/core/enums/methodsEnum';
import { BaseMessage } from './baseMessage';
import { message } from 'ant-design-vue';

export class TestMessage extends BaseMessage<MessageMethodsEnum.TEST_MESSAGE> {
	constructor() {
		super(MessageMethodsEnum.TEST_MESSAGE);
	}

	handle(): void {
		message.info(this.data);
	}
}
