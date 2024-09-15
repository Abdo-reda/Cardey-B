import { MessageMethodsEnum } from '@/core/enums/methodsEnum';
import { BaseMessage } from './baseMessage';
import { message } from 'ant-design-vue';

export class PlayerDisconnectedMessage extends BaseMessage<MessageMethodsEnum.PLAYER_DISCONNECTED> {
	constructor() {
		super(MessageMethodsEnum.PLAYER_DISCONNECTED);
	}

	handle(): void {
		const player = this.useGameState.getPlayer(this.data);
		message.error(`${player.name} has disconnected!`);
	}
}
