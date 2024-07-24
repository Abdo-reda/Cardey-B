export class FirestoreConstants {
	static readonly roomsCollection = 'rooms';
	static readonly joinRequestsCollection = 'joinRequests';
	static readonly offerCandidatesCollection = 'offerCandidates';
	static readonly answerCandidatesCollection = 'answerCandidates';
	static readonly serversConfiguration = {
		iceServers: [
			{
				urls: [
					'stun:stun1.l.google.com:19302',
					'stun:stun2.l.google.com:19302'
					// 'stun:stun.services.mozilla.com:3478'
					// 'stun:stun.l.google.com:19302',
					// 'stun:stun3.l.google.com:19302',
					// 'stun:stun4.l.google.com:19302'
				]
			}
		],
		iceCandidatePoolSize: 10
	};
}
