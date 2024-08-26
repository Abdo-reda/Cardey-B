import { MessageMethodsEnum } from '@/core/enums/methodsEnum';
import { BaseMessage } from './baseMessage';

export class JoinTeamMessage extends BaseMessage<MessageMethodsEnum.JOIN_TEAM> {
	constructor() {
		super(MessageMethodsEnum.JOIN_TEAM);
	}

	handle(): void {
		this.useGameState.addPlayerToTeam(this.data.playerId, this.data.teamId);
	}
}
