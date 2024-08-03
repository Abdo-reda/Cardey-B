import type { IJoinTeam } from '@/core/interfaces/messageInterfaces/joinTeamInterface';
import type { IGameState } from '@/core/interfaces/gameStateInterface';
import type { IPlayer } from '@/core/interfaces/playerInterface';
import type { Ref } from 'vue';
import type { IMessage } from '@/core/interfaces/messageInterfaces/messageInterface';
import type { IReciever } from '@/core/interfaces/recieverInterface';

export class JoinTeamReciever implements IReciever<IJoinTeam> {
	handle(gameState: Ref<IGameState>, message: IMessage<IJoinTeam>): void {
		this.pushPlayerToTeam(
			gameState,
			gameState.value.players.find((player) => player.id === message.data.playerId)!,
			message.data.teamId
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
