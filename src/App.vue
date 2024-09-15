<script setup lang="ts">
import { Button, ConfigProvider, Modal, PageHeader, Result } from 'ant-design-vue';
import { RouterView } from 'vue-router'
import { SettingOutlined, FormatPainterOutlined, PauseCircleFilled, PlayCircleFilled, BugOutlined, ArrowLeftOutlined, CheckOutlined, CloseOutlined} from '@ant-design/icons-vue';
import { inject, ref } from 'vue';
import router from '@/plugins/router'
import useTheme from './core/composables/useTheme';
import { GameServiceKey } from './core/constants/injectionKeys';
import useGameState from './core/composables/useGameState';
import usePlayer from './core/composables/usePlayer';
import { RoutesEnum } from './core/enums/routesEnum';

const gameService = inject(GameServiceKey)!;
const { player } = usePlayer();

const settingsOpen = ref(false);
const quitModalOpen = ref(false);

const { currentThemeAlgorithm, switchTheme, setTheme } = useTheme();
setTheme();

const { isPaused } = useGameState();

function goBack() {
  // TODO: can you go back? this makes sense for the web app version, maybe its disabled mid game, or if mid game, then the game gets reset.
  quitModalOpen.value = false;
  router.push({ name: RoutesEnum.HOME });
}

function togglePause() {
  gameService.togglePause();
}

function goToDebug() {
  settingsOpen.value = false;
  router.push({ name: RoutesEnum.DEBUG });
}

function quitGame() {
  if (router.currentRoute.value.name === RoutesEnum.CREATE_GAME) {
    router.push({ name: RoutesEnum.HOME });
    return;
  }
  quitModalOpen.value = true;
}


</script>

<template>
  <ConfigProvider :theme="{
    algorithm: currentThemeAlgorithm,
  }">
    <main class="h-screen max-h-screen flex flex-col p-6">
      <div>
        <PageHeader @back="quitGame()">
          <template #backIcon>
            <Button v-if="router.currentRoute.value.name !== RoutesEnum.HOME" 
                    size="large"
                    class="flex flex-col justify-center items-center text-gray-400 dark:text-gray-300" type="default"
                    shape="circle">
              <template #icon>
                <ArrowLeftOutlined />
              </template>
            </Button>
          </template>
          <template #extra>
            <div v-auto-animate class=" flex gap-x-2">
              <Button @click="switchTheme" size="large"
                class="flex flex-col justify-center items-center text-gray-400 dark:text-gray-300" type="default"
                shape="circle">
                <template #icon>
                  <FormatPainterOutlined />
                </template>
              </Button>
              <Button @click="settingsOpen = true" size="large"
                class="flex flex-col justify-center items-center text-gray-400 dark:text-gray-300" type="default"
                shape="circle">
                <template #icon>
                  <SettingOutlined />
                </template>
              </Button>
              <Button v-if="player.isHost" @click="togglePause" size="large"
                class="flex flex-col justify-center items-center text-gray-400 dark:text-gray-300" type="default"
                shape="circle">
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
    </main>
    <!-- Setting Modal -->
    <Modal v-model:open="settingsOpen" title="Settings" :closable="false">
      <div>
        <div class="m-8">
          <p>Random settings like audio</p>
        </div>
        <Button @click="goToDebug" danger class="flex justify-center items-center">
          Debug
          <template #icon>
            <BugOutlined />
          </template>
        </Button>
      </div>
      <template #footer>
      </template>
    </Modal>
    <!-- Pause Modal -->
    <Modal :centered="true" :keyboard="false" :maskClosable="false" v-model:open="isPaused" :closable="false">
      <Result sub-title="only the host can unpause">
        <template #title>
          <p class="font-semibold"> The Game is Paused! </p>
        </template>
        <template #extra>
          <div class="flex items-center justify-center">
            <Button v-if="player.isHost" @click="togglePause" class="flex items-center" key="play" type="primary">
              <template #icon>
                <PlayCircleFilled />
              </template>
              Unpause
            </Button>
          </div>
        </template>
      </Result>
      <template #footer>
      </template>
    </Modal>

    <!-- Quit Game Confirmation Modal -->
    <Modal @ok="goBack()" :centered="true" :keyboard="true" :maskClosable="true" v-model:open="quitModalOpen" :closable="true">
      <Result status="warning">
        <template #title>
          <p class="font-semibold"> Are you sure you want to quit ?</p>
        </template>
      </Result>
    </Modal>
  </ConfigProvider>
</template>
