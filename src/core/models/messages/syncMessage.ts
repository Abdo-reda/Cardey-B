import { MessageMethodsEnum } from '@/core/enums/methodsEnum';
import { BaseMessage } from './baseMessage';
import type { Ref } from 'vue';
import type { IGameState } from '@/core/interfaces/gameStateInterface';
import router from '@/plugins/router';

export class SyncMessage extends BaseMessage<MessageMethodsEnum.SYNC> {
	constructor() {
		super(MessageMethodsEnum.SYNC);
	}

	handle(gameState: Ref<IGameState>): void {
		gameState.value = this.data;
		if (router.currentRoute.value.name !== gameState.value.currentRoute) {
			router.push({ name: gameState.value.currentRoute });
		}
	}
}
