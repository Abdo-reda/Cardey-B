import type { MessageMethodsEnum } from '../../enums/methodsEnum';
import type { MessageMethodPayloadMap } from '@/core/constants/messagesMap';

export interface IMessage<E extends MessageMethodsEnum> {
	senderId: string;
	method: E;
	data: MessageMethodPayloadMap[E];
	init: (senderId: string, data: MessageMethodPayloadMap[E]) => void;
	handle: () => void;
}
