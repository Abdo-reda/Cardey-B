import { reactive, type Reactive } from "vue";
import { AvatarsEnum } from "../enums/avatarsEnum";
import type { IMessage } from "../interfaces/messageInterface";
import type { IPlayerService } from "../interfaces/playerServiceInterface";
import type { IPlayer } from "../interfaces/playerInterface";
import type { IHostService } from "../interfaces/hostServiceInterface";
import { MethodsEnum } from "../enums/methodsEnum";

export class HostPlayerService implements IPlayerService {
    player: Reactive<IPlayer>;
    hostService: IHostService;

    constructor(hostService: IHostService, player: IPlayer){
        this.hostService = hostService;
        this.player = reactive(player);
    }
    
    setupListeners(): void{
        this.hostService.onRecievedMessage = (playerId: string, message: IMessage<any>) => {
			console.log('--- Message recieved from player (client): ', playerId, message);
			console.log('==== host', message.method);
			if (message.method === MethodsEnum.JOIN_GAME) {
				// this.playerJoinedGame(message.data);
                console.log('--- host handling join game')
			}
            
			if (message.method === MethodsEnum.JOIN_TEAM) {
                console.log('--- host handling join team')
				// this.pushPlayerToTeam(
				// 	this.gameState.value.players.find(
				// 		(player) => player.id === message.data.playerId
				// 	)!,
				// 	message.data.teamId
				// );
			}
            console.log('--- syncing game')
			// this.sendSyncGameState();
		};
    }

    sendMessage<T>(message: IMessage<T>): void{
        this.hostService.sendMessageToAllExcept(message, []);
    }

    async joinGameAsync(): Promise<void>{
        const roomId = await this.hostService.createNewRoomAsync();
		this.player.id = roomId;
		this.player.roomId = roomId;
    }
}
