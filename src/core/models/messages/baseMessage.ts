import { MESSAGES_MAP, type MessageMethodPayloadMap } from '@/core/constants/messagesMap';
import { MessageMethodsEnum } from '@/core/enums/methodsEnum';
import type { IGameState } from '@/core/interfaces/gameStateInterface';
import type { IMessage } from '@/core/interfaces/messageInterfaces/messageInterface';
import type { Ref } from 'vue';

export class BaseMessage<E extends MessageMethodsEnum> implements IMessage<E> {
	method: E;
	senderId!: string;
	data!: MessageMethodPayloadMap[E];

	constructor(method: E) {
		this.method = method;
		MESSAGES_MAP.set(this.method, this);
	}

	init(senderId: string, data: MessageMethodPayloadMap[E]) {
		this.senderId = senderId;
		this.data = data;
	}

	handle(gameState: Ref<IGameState>): void {}
}
