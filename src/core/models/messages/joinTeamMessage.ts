import { MethodsEnum } from '@/core/enums/methodsEnum';
import type { IJoinTeam } from '@/core/interfaces/messageInterfaces/joinTeamInterface';
import { BaseMessage } from './baseMessage';

export class JoinTeamMessage extends BaseMessage<IJoinTeam> {
	constructor(senderId: string, data: IJoinTeam) {
		super(MethodsEnum.JOIN_TEAM, senderId, data);
	}
}
