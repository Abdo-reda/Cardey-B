import type { Ref } from 'vue';
import type { MethodsEnum } from '../../enums/methodsEnum';
import type { IGameState } from '../gameStateInterface';
import type { MethodsEnumTypeMap } from '@/core/constants/recieversMap';

export interface IMessage<E extends MethodsEnum> {
	senderId: string;
	method: E;
	data: MethodsEnumTypeMap[E];
	init: (senderId: string, data: MethodsEnumTypeMap[E]) => void;
	handle: (gameState: Ref<IGameState>) => void;
}
