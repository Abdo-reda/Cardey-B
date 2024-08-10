import { MessageMethodsEnum } from '@/core/enums/methodsEnum';
import { BaseMessage } from './baseMessage';
import type { Ref } from 'vue';
import type { IGameState } from '@/core/interfaces/gameStateInterface';

export class PlayWordMessage extends BaseMessage<MessageMethodsEnum.PLAY_WORD> {
	constructor() {
		super(MessageMethodsEnum.PLAY_WORD);
	}

	handle(gameState: Ref<IGameState>): void {
		const type = this.data.type;
		const curWord = gameState.value.words.remaining.shift()!;
		if (type === 'score') {
			gameState.value.words.scored.push(curWord);
			const team = gameState.value.teams.find((team) => team.id === this.data.teamId)!;
			team.score++;
		} else {
			gameState.value.words.skipped.push(curWord);
		}
	}
}
