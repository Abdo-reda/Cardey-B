import { MessageMethodsEnum } from '@/core/enums/methodsEnum';
import { BaseMessage } from './baseMessage';
import type { IGameState } from '@/core/interfaces/gameStateInterface';
import type { Ref } from 'vue';
import type { IPlayer } from '@/core/interfaces/playerInterface';

export class JoinTeamMessage extends BaseMessage<MessageMethodsEnum.JOIN_TEAM> {
	constructor() {
		super(MessageMethodsEnum.JOIN_TEAM);
	}

	handle(gameState: Ref<IGameState>): void {
		this.pushPlayerToTeam(
			gameState,
			gameState.value.players.find((player) => player.id === this.data.playerId)!,
			this.data.teamId
		);
	}

	private pushPlayerToTeam(gameState: Ref<IGameState>, player: IPlayer, teamId: string): void {
		const currentTeam = player.teamId;

		if (currentTeam) {
			const oldTeam = gameState.value.teams.find((t) => t.id === currentTeam)!;
			oldTeam.players = oldTeam.players.filter((playerId) => playerId !== player.id);
		}

		const team = gameState.value.teams.find((t) => t.id === teamId);
		team?.players.push(player.id);
		player.teamId = teamId;
	}
}
