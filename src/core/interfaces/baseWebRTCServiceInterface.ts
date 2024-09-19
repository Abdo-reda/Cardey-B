import type { IPlayerConnectionModel } from '@/core/interfaces/modelInterfaces/playerConnectionModelInterface'

export interface IBaseWebRTCService {
	roomId: string;
	disconnect: () => void;
	getPlayerRTCConnectionState(): RTCPeerConnectionState | undefined;
	getDataChannelConnectionState(): RTCDataChannelState | undefined;
	getPlayerConnections(): IPlayerConnectionModel[];
}
