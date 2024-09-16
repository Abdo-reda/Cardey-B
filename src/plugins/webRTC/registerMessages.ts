import { JoinGameMessage } from '@/core/models/messages/joinGameMessage';
import { JoinTeamMessage } from '@/core/models/messages/joinTeamMessage';
import { PlayerDisconnectedMessage } from '@/core/models/messages/playerDisconnectedMessage';
import { PlayerWordsMessage } from '@/core/models/messages/playerWordsMessage';
import { PlayWordMessage } from '@/core/models/messages/playWordMessage';
import { QuitGameMessage } from '@/core/models/messages/quitGameMessage';
import { SyncMessage } from '@/core/models/messages/syncMessage';
import { TestMessage } from '@/core/models/messages/testMessage';
import { UpdatePhaseMessage } from '@/core/models/messages/updatePhaseMessage';
import { UpdateTurnMessage } from '@/core/models/messages/updateTurnMessage';

export default function () {
	new JoinGameMessage();
	new JoinTeamMessage();
	new SyncMessage();
	new PlayerWordsMessage();
	new PlayWordMessage();
	new UpdateTurnMessage();
	new UpdatePhaseMessage();
	new TestMessage();
	new PlayerDisconnectedMessage();
	new QuitGameMessage();
}
