<script setup lang="ts">
import { Button, ConfigProvider, Modal, PageHeader, Result } from 'ant-design-vue';
import { RouterView } from 'vue-router'
import { SettingOutlined, FormatPainterOutlined, PauseCircleFilled, PlayCircleFilled } from '@ant-design/icons-vue';
import { inject, ref } from 'vue';
import router from '@/plugins/router'
import useTheme from './core/composables/useTheme';
import { GameServiceKey } from './core/constants/injectionKeys';
import useGameState from './core/composables/useGameState';
import usePlayer from './core/composables/usePlayer';

const gameService = inject(GameServiceKey)!;
const { player } = usePlayer();

const settingsOpen = ref(false);
const { currentThemeAlgorithm, switchTheme, setTheme } = useTheme();
setTheme();

const { isPaused } = useGameState();

function goBack() {
  // TODO: can you go back? this makes sense for the web app version, maybe its disabled mid game, or if mid game, then the game gets reset.
  router.back();
}

function togglePause() {
  gameService.togglePause();
}


</script>

<template>
  <ConfigProvider :theme="{
    algorithm: currentThemeAlgorithm,
  }">
    <main class="h-screen max-h-screen flex flex-col p-6">
      <div>
        <PageHeader>
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
              <!-- TODO: maybe add a pause button here -->
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
    <Modal v-model:open="settingsOpen" title="Settings" :closable="false">
      <p>Random settings like audio</p>
      <template #footer>
      </template>
    </Modal>
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
  </ConfigProvider>
</template>
