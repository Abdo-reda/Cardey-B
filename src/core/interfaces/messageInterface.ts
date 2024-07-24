import type { MethodsEnum } from '../enums/methodsEnum';

export interface IMessage<T> {
	senderId: string;
	method: MethodsEnum;
	data?: T;
}
