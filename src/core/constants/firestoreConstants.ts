export class FirestoreConstants {
	static readonly roomExpirationTime = 60 * 1000; // 1 hour
	static readonly roomsCollection = 'rooms';
	static readonly joinRequestsCollection = 'joinRequests';
	static readonly offerCandidatesCollection = 'offerCandidates';
	static readonly answerCandidatesCollection = 'answerCandidates';
	static readonly serversConfiguration = {
		iceServers: [
			{
				urls: 'stun:stun.relay.metered.ca:80'
			},
			{
				urls: 'stun:stun1.l.google.com:19302'
			},
			// {
			//   urls: "turn:global.relay.metered.ca:80",
			//   username: "f2624566234528953a35b6a0",
			//   credential: "/9gBwIRCO+aldaXy",
			// },
			// {
			//   urls: "turn:global.relay.metered.ca:80?transport=tcp",
			//   username: "f2624566234528953a35b6a0",
			//   credential: "/9gBwIRCO+aldaXy",
			// },
			{
				urls: 'turn:global.relay.metered.ca:443',
				username: 'f2624566234528953a35b6a0',
				credential: '/9gBwIRCO+aldaXy'
			},
			{
				urls: 'turns:global.relay.metered.ca:443?transport=tcp',
				username: 'f2624566234528953a35b6a0',
				credential: '/9gBwIRCO+aldaXy'
			}
		],
		iceCandidatePoolSize: 10
	};
}

// [
// 	{
// 		urls: [
// 			'stun:stun1.l.google.com:19302',
// 			'stun:stun2.l.google.com:19302'
// 			// 'stun:stun.services.mozilla.com:3478'
// 			// 'stun:stun.l.google.com:19302',
// 			// 'stun:stun3.l.google.com:19302',
// 			// 'stun:stun4.l.google.com:19302'
// 		]
// 	}
// ],
