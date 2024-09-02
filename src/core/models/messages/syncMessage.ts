import { MessageMethodsEnum } from '@/core/enums/methodsEnum';
import { BaseMessage } from './baseMessage';
import router from '@/plugins/router';

export class SyncMessage extends BaseMessage<MessageMethodsEnum.SYNC> {
	constructor() {
		super(MessageMethodsEnum.SYNC);
	}

	handle(): void {
		this.useGameState.syncGameState(this.data);
		if (router.currentRoute.value.name !== this.useGameState.currentRoute.value) {
			router.push({ name: this.useGameState.currentRoute.value });
		}
	}
}
