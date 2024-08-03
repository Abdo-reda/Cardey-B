<script setup lang="ts">
import { Button, ConfigProvider, Modal } from 'ant-design-vue';
import { RouterView } from 'vue-router'
import { SettingOutlined, FormatPainterOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
import { theme } from 'ant-design-vue';

const settingsOpen = ref(false);
const isDark = ref(localStorage.getItem("theme") === "dark");
const currentThemeAlgorithm = ref(theme.defaultAlgorithm);

function switchTheme(): void {
  isDark.value = !isDark.value;
  setTheme();
}

function setTheme() {
  if (isDark.value) {
    currentThemeAlgorithm.value = theme.darkAlgorithm;
    document.documentElement.classList.add('dark');
    document.body.classList.add('body-dark');
    document.body.classList.remove('body-light');
    localStorage.setItem("theme", "dark");
  } else {
    currentThemeAlgorithm.value = theme.defaultAlgorithm;
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('body-dark');
    document.body.classList.add('body-light');
    localStorage.setItem("theme", "light");
  }
}

setTheme();

</script>

<template>
  <ConfigProvider :theme="{
    algorithm: currentThemeAlgorithm,
  }">
    <main class="h-screen grid grid-rows-12 p-4">
      <div class="row-span-1 self-center">
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
      </div>
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component class="row-span-11" :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <Modal v-model:open="settingsOpen" title="Settings" :closable="false">
      <p>Random settings like audio</p>
      <template #footer>
        <Button key="submit" type="primary">Ok</Button>
      </template>
    </Modal>
  </ConfigProvider>
</template>
