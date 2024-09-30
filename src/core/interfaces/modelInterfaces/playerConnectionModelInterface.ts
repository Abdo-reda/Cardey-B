export interface IPlayerConnectionModel {
  id?: string;
  name?: string;
  RTCPeerConnectionState?: RTCPeerConnectionState | undefined;
  DataChannelState?: RTCDataChannelState | undefined;
}