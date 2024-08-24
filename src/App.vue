<script setup lang="ts">
import { Button, ConfigProvider, Modal, PageHeader } from 'ant-design-vue';
import { RouterView } from 'vue-router'
import { SettingOutlined, FormatPainterOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
import router from '@/plugins/router'
import useTheme from './core/composables/useTheme';

const settingsOpen = ref(false);
const { currentThemeAlgorithm, switchTheme, setTheme } = useTheme();
setTheme();

function goBack() {
  // TODO: can you go back? this makes sense for the web app version, maybe its disabled mid game, or if mid game, then the game gets reset.
  router.back();
}

</script>

<template>
  <ConfigProvider :theme="{
    algorithm: currentThemeAlgorithm,
  }">
    <main class="h-screen max-h-screen flex flex-col p-4">
      <div>
        <PageHeader @back="goBack">
          <template #extra>
            <div class="flex gap-x-2">
              <Button @click="settingsOpen = true" size="large"
                class="flex flex-col justify-center items-center text-gray-400 dark:text-gray-300" type="default"
                shape="circle">
                <template #icon>
                  <SettingOutlined />
                </template>
              </Button>
              <Button @click="switchTheme" size="large"
                class="flex flex-col justify-center items-center text-gray-400 dark:text-gray-300" type="default"
                shape="circle">
                <template #icon>
                  <FormatPainterOutlined />
                </template>
              </Button>
              <!-- TODO: maybe add a pause button here -->
            </div>
          </template>
        </PageHeader>

      </div>
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component class="flex-1 max-h-full overflow-hidden" :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <Modal v-model:open="settingsOpen" title="Settings" :closable="false">
      <p>Random settings like audio</p>
      <template #footer>
      </template>
    </Modal>
  </ConfigProvider>
</template>
