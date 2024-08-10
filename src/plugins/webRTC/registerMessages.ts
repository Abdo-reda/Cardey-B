import { JoinGameMessage } from '@/core/models/messages/joinGameMessage';
import { JoinTeamMessage } from '@/core/models/messages/joinTeamMessage';
import { PlayerWordsMessage } from '@/core/models/messages/playerWordsMessage';
import { PlayWordMessage } from '@/core/models/messages/playWordMessage';
import { SyncMessage } from '@/core/models/messages/syncMessage';
import { UpdateTurnMessage } from '@/core/models/messages/updateTurnMessage';

export default function () {
	new JoinGameMessage();
	new JoinTeamMessage();
	new SyncMessage();
	new PlayerWordsMessage();
	new PlayWordMessage();
	new UpdateTurnMessage();
}
