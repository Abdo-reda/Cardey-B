export enum GamePhasesEnum {
	NONE = 'None',
	PHASE_ONE = 'One',
	PHASE_TWO = 'Two',
	PHASE_THREE = 'Three',
	DONE = 'DONE'
}

export const GAME_PHASES = Object.values(GamePhasesEnum);

export const GAME_PHASES_DESCRIPTIONS = new Map<GamePhasesEnum, string>([
	[
		GamePhasesEnum.PHASE_ONE,
		"<p class='font-medium'> Don't move! </br> In this phase you can only speak to describe the word on the card. If you say the word on the card or use any gestures, you lose the point. </p>"
	],
	[
		GamePhasesEnum.PHASE_TWO,
		"<p class='font-medium'> Don't make a sound! </br> In this phase you can only act and use gestures to describe the word on the card. If you make a sound, you lose the point. </p>"
	],
	[
		GamePhasesEnum.PHASE_THREE,
		"<p class='font-medium'> Becareful! </br> In this phase you can only say one word to describe the word on the card. Take your time. Good luck! </p>"
	]
]);
