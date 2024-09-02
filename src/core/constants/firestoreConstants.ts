// const response = await fetch(
// 	'https://nopoint.metered.live/api/v1/turn/credentials?apiKey=e62753d56437cdc95f9a8438b08e31f0824a'
// );

// const iceServers = await response.json();

export class FirestoreConstants {
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
				urls: 'turn:global.relay.metered.ca:80',
				username: '5ccc1de30a12eff95ed85ab9',
				credential: 'ri6WxJNyd6kpwDVU'
			},
			{
				urls: 'turn:global.relay.metered.ca:80?transport=tcp',
				username: '5ccc1de30a12eff95ed85ab9',
				credential: 'ri6WxJNyd6kpwDVU'
			}
			// {
			// 	urls: 'turn:global.relay.metered.ca:443',
			// 	username: '5ccc1de30a12eff95ed85ab9',
			// 	credential: 'ri6WxJNyd6kpwDVU'
			// }
			// {
			// 	urls: 'turns:global.relay.metered.ca:443?transport=tcp',
			// 	username: '5ccc1de30a12eff95ed85ab9',
			// 	credential: 'ri6WxJNyd6kpwDVU'
			// }
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
