import { computed, ref } from 'vue';
import type { IChatMessage } from '../interfaces/messageInterfaces/chatMessageInterface';

const chatMessages = ref<IChatMessage[]>([]);
const chatOpen = ref(false);
const unReadMessages = ref<number>(0);

const isChatOpen = computed({
	get: () => chatOpen.value,
	set: (value: boolean) => {
		chatOpen.value = value;
		if (value) unReadMessages.value = 0;
	}
});

function addMessage(chatMsg: IChatMessage) {
	chatMessages.value.push(chatMsg);
	if (!chatOpen.value) unReadMessages.value++;
}

function resetMessages() {
	chatMessages.value = [];
}

export default function useRoomChat() {
	return {
		chatMessages,
		isChatOpen,
		unReadMessages,
		resetMessages,
		addMessage
	};
}
