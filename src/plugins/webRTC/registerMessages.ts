import { JoinGameMessage } from '@/core/models/messages/joinGameMessage';
import { JoinTeamMessage } from '@/core/models/messages/joinTeamMessage';
import { PlayerWordsMessage } from '@/core/models/messages/playerWordsMessage';
import { SyncMessage } from '@/core/models/messages/syncMessage';

export default function () {
	new JoinGameMessage();
	new JoinTeamMessage();
	new SyncMessage();
	new PlayerWordsMessage();
}
