export type PlayWordType = 'skip' | 'score';

export interface IPlayWord {
	type: PlayWordType;
	teamId: string;
	playerId: string;
}
