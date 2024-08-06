import { MESSAGES_MAP, type MethodsEnumTypeMap } from '@/core/constants/recieversMap';
import { MethodsEnum } from '@/core/enums/methodsEnum';
import type { IGameState } from '@/core/interfaces/gameStateInterface';
import type { IMessage } from '@/core/interfaces/messageInterfaces/messageInterface';
import type { Ref } from 'vue';

export class BaseMessage<E extends MethodsEnum> implements IMessage<E> {
	method: E;
	senderId!: string;
	data!: MethodsEnumTypeMap[E];

	constructor(method: E) {
		this.method = method;
		MESSAGES_MAP.set(this.method, this) //TODO: will this work?
	}

	init(senderId: string, data: MethodsEnumTypeMap[E]) {
		this.senderId = senderId;
		this.data = data;
	}

	handle(gameState: Ref<IGameState>): void {}
}
