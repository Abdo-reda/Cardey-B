import type { IPlayerConnectionModel } from '@/core/interfaces/modelInterfaces/playerConnectionModelInterface'

export class PlayerConnectionModel implements IPlayerConnectionModel{
  id: string;
  name: string;
  RTCPeerConnectionState: RTCPeerConnectionState | undefined;
  DataChannelState: RTCDataChannelState | undefined;

  constructor(id: string, name: string, RTCPeerConnectionState: RTCPeerConnectionState | undefined, DataChannelState: RTCDataChannelState | undefined) {
    this.id = id;
    this.name = name;
    this.RTCPeerConnectionState = RTCPeerConnectionState;
    this.DataChannelState = DataChannelState;
  }
}