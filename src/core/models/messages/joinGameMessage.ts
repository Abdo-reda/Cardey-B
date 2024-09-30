import { MessageMethodsEnum } from '@/core/enums/methodsEnum'
import { BaseMessage } from './baseMessage'
import { RoutesEnum } from '@/core/enums/routesEnum'

export class JoinGameMessage extends BaseMessage<MessageMethodsEnum.JOIN_GAME> {
	constructor() {
		super(MessageMethodsEnum.JOIN_GAME);
	}

	handle(): void {
		this.useGameState.addPlayer(this.data);
		
		// If the game is in progress, add the player to a random team and
		if (this.useGameState.currentRoute.value !== RoutesEnum.LOBBY && this.useGameState.currentRoute.value !== RoutesEnum.CREATE_GAME){
			this.useGameState.addPlayerToTeam(this.data.id, this.useGameState.getRandomTeamId());
			this.useGameState.addPlayerTurn(this.data.id)
		}
	}
}
