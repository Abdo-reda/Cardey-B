import { MethodsEnum } from '@/core/enums/methodsEnum';
import type { IMessage } from '@/core/interfaces/messageInterfaces/messageInterface';

export class BaseMessage<T> implements IMessage<T> {
	method: MethodsEnum;
	senderId: string;
	data: T;

	constructor(method: MethodsEnum, senderId: string, data: T) {
		this.method = method;
		this.senderId = senderId;
		this.data = data;
	}
}
