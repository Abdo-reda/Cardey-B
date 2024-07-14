import type { Ref } from 'vue';

export interface IClientService {
	peerConnection: RTCPeerConnection | undefined;
	dataChannel: RTCDataChannel | undefined;
	roomId: Ref<string>;
	joinRoomAsync: (roomId: string) => Promise<void>;
}
