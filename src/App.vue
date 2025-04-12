<script setup lang="ts">
import {
	Button,
	ConfigProvider,
	Modal,
	PageHeader,
	Result,
	TypographyTitle,
} from 'ant-design-vue';
import { RouterView } from 'vue-router';
import {
	SettingOutlined,
	FormatPainterOutlined,
	PauseCircleFilled,
	InfoCircleOutlined,
	PlayCircleFilled,
	ArrowLeftOutlined
} from '@ant-design/icons-vue';
import { inject, ref } from 'vue';
import router from '@/plugins/router';
import useTheme from './core/composables/useTheme';
import { GameServiceKey } from './core/constants/injectionKeys';
import useGameState from './core/composables/useGameState';
import usePlayer from './core/composables/usePlayer';
import { RoutesEnum } from './core/enums/routesEnum';
import ChatComponent from './components/Layout/ChatComponent.vue';
import SettingModalComponent from './components/Modals/SettingModalComponent.vue';
import InfoModalComponent from './components/Modals/InfoModalComponent.vue';

const version = __APP_VERSION__;
const gameService = inject(GameServiceKey)!;
const { currentPlayer } = usePlayer();
const settingsOpen = ref(false);
const infoOpen = ref(false);
const quitModalOpen = ref(false);

const { currentThemeAlgorithm, switchTheme, setTheme } = useTheme();
setTheme();

const { isPaused } = useGameState();

function quitGame() {
	quitModalOpen.value = false;
	gameService.quitGame();
	// TODO: can you go back? 🤔 this makes sense for the web app version, maybe its disabled mid game, or if mid game, then the game gets reset.
	// Am i host or client? 🤔
	// if host -> send message host left game -> redirect all clients to home page and reset connections🦶
	// if client -> send message client left game -> update game state that the player has left
}

function togglePause() {
	gameService.togglePause();
}

function handleGoBack() {
	if (router.currentRoute.value.name === RoutesEnum.CREATE_GAME) {
		quitModalOpen.value = false;
		router.push({ name: RoutesEnum.HOME });
		return;
	}
	quitModalOpen.value = true;
}
</script>

<template>
	<ConfigProvider :theme="{
		algorithm: currentThemeAlgorithm
	}">
		<main class="h-screen max-h-screen flex flex-col p-6">
			<div>
				<PageHeader @back="handleGoBack()">
					<template #backIcon>
						<Button v-if="router.currentRoute.value.name !== RoutesEnum.HOME" size="large"
							class="flex flex-col justify-center items-center text-gray-400 dark:text-gray-300"
							type="default" shape="circle">
							<template #icon>
								<ArrowLeftOutlined />
							</template>
						</Button>
					</template>
					<template #extra>
						<div v-auto-animate class="flex gap-x-2">
							<Button @click="switchTheme" size="large"
								class="flex flex-col justify-center items-center text-gray-400 dark:text-gray-300"
								type="default" shape="circle">
								<template #icon>
									<FormatPainterOutlined />
								</template>
							</Button>
							<Button @click="settingsOpen = true" size="large"
								class="flex flex-col justify-center items-center text-gray-400 dark:text-gray-300"
								type="default" shape="circle">
								<template #icon>
									<SettingOutlined />
								</template>
							</Button>
							<Button v-if="currentPlayer.isHost" @click="togglePause" size="large"
								class="flex flex-col justify-center items-center text-gray-400 dark:text-gray-300"
								type="default" shape="circle">
								<template #icon>
									<PlayCircleFilled v-if="isPaused" />
									<PauseCircleFilled v-else />
								</template>
							</Button>
						</div>
					</template>
				</PageHeader>
			</div>
			<RouterView v-slot="{ Component, route }">
				<Transition name="fade" mode="out-in">
					<component :key="route.name" class="flex-1 max-h-full overflow-hidden" :is="Component" />
				</Transition>
			</RouterView>
			<div class="mx-6 my-8 w-fit">
				<Button @click="infoOpen = true" type="text" class="flex items-center" size="large">
					<InfoCircleOutlined />
					V {{ version }}
				</Button>
				<!-- <TypographyTitle class="!m-0" :level="4">
       
         
        </TypographyTitle> -->
				<InfoModalComponent v-model="infoOpen" />
			</div>
		</main>
		<!-- CHAT -->
		<ChatComponent />
		<!-- Setting Modal -->
		<SettingModalComponent v-model="settingsOpen" />
		<!-- Pause Modal -->
		<Modal :centered="true" :keyboard="false" :maskClosable="false" v-model:open="isPaused" :closable="false">
			<Result sub-title="only the host can unpause">
				<template #title>
					<p class="font-semibold">The Game is Paused!</p>
				</template>
				<template #extra>
					<div class="flex items-center justify-center">
						<Button v-if="currentPlayer.isHost" @click="togglePause" class="flex items-center" key="play"
							type="primary">
							<template #icon>
								<PlayCircleFilled />
							</template>
							Unpause
						</Button>
					</div>
				</template>
			</Result>
			<template #footer> </template>
		</Modal>
		<!-- Quit Game Confirmation Modal -->
		<Modal @ok="quitGame()" :centered="true" :keyboard="true" :maskClosable="true" v-model:open="quitModalOpen"
			:closable="true">
			<Result status="warning">
				<template #title>
					<p class="font-semibold">Are you sure you want to quit ?</p>
				</template>
			</Result>
		</Modal>
	</ConfigProvider>
</template>
