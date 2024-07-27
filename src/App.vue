<script setup lang="ts">
import { Button, ConfigProvider, Modal } from 'ant-design-vue';
import { RouterView } from 'vue-router'
import { SettingOutlined, FormatPainterOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
import useTheme from './core/composables/useTheme';

const settingsOpen = ref(false);
const { currentThemeAlgorithm, switchTheme, setTheme } = useTheme();
setTheme();
</script>

<template>
  <ConfigProvider :theme="{
    algorithm: currentThemeAlgorithm,
  }">
    <main class="h-screen p-4">
      <div>
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
        </div>
        <Modal v-model:open="settingsOpen" title="Settings" :closable="true" :footer="false">
          <p>Random settings like audio</p>
          <!-- <template #footer>
          </template> -->
        </Modal>
      </div>
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </ConfigProvider>
</template>
