import { MessageMethodsEnum } from '@/core/enums/methodsEnum';
import { BaseMessage } from './baseMessage';
import { RoutesEnum } from '@/core/enums/routesEnum';
import router from '@/plugins/router';

export class UpdatePhaseMessage extends BaseMessage<MessageMethodsEnum.UPDATE_PHASE> {
	constructor() {
		super(MessageMethodsEnum.UPDATE_PHASE);
	}

	handle(): void {
		const route = RoutesEnum.GAME_PHASE;
		this.useGameState.nextPhase();
		this.useGameState.currentRoute.value = route;
		router.push({ name: route });
	}
}
