export enum AvatarsEnum {
	BIRD = 'bird',
	BUTTERFLY = 'butterfly',
	CANARY = 'canary',
	DOG = 'dog',
	ELEPHANT = 'elephant',
	FISH = 'fish',
	FLOWER = 'flower',
	KANGAROO = 'kangaroo',
	OSTRICH = 'ostrich',
	PAPER_PLANE = 'paper-plane',
	PIG = 'pig',
	STAR = 'star',
	TORTOISE = 'tortoise',
	TURTLE = 'turtle',
	WHALE = 'whale'
	//   CAT = 'cat'
	//   RABBIT = 'rabbit'
	//   BEAR = 'bear',
	//   FOX = 'fox',
	//   OWL = 'owl'
}

export const AvatarsList = Object.values(AvatarsEnum);

// I hate this, we need a way to dynamically import svgs using the avatar enum name, there is lazy loading in vite, we need to check it out
// export const AvatarSVGMapper: Map<AvatarsEnum, FunctionalComponent> = new Map([
// 	[AvatarsEnum.BIRD, BirdSVG],
// 	[AvatarsEnum.BUTTERFLY, BirdSVG],
// 	[AvatarsEnum.CANARY, BirdSVG],
// 	[AvatarsEnum.DOG, BirdSVG],
// 	[AvatarsEnum.ELEPHANT, BirdSVG],
// 	[AvatarsEnum.FISH, BirdSVG],
// 	[AvatarsEnum.FLOWER, BirdSVG],
// 	[AvatarsEnum.KANGAROO, BirdSVG],
// 	[AvatarsEnum.OSTRICH, BirdSVG],
// 	[AvatarsEnum.PAPER_PLANE, BirdSVG],
// 	[AvatarsEnum.PIG, BirdSVG],
// 	[AvatarsEnum.STAR, BirdSVG],
// 	[AvatarsEnum.TORTOISE, BirdSVG],
// 	[AvatarsEnum.TURTLE, BirdSVG],
// 	[AvatarsEnum.WHALE, BirdSVG]
// ]);
