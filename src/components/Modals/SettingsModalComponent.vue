<script setup lang="ts">
import useAppSettings from '@/core/composables/useAppSettings';
import { RoutesEnum } from '@/core/enums/routesEnum';
import router from '@/plugins/router';
import { BugOutlined } from '@ant-design/icons-vue';
import { Button, Checkbox, FormItem, Input, Modal, Switch, TypographyParagraph, TypographyTitle } from 'ant-design-vue';

const { appSettings } = useAppSettings();

const settingsOpen = defineModel<boolean>({
  default: false
})


function goToDebug() {
  settingsOpen.value = false;
  router.push({ name: RoutesEnum.DEBUG });
}
</script>

<template>
   <Modal v-model:open="settingsOpen" title="Settings" :closable="true">
      <div class="my-4 space-y-4">
        <div class="flex gap-x-2 items-center justify-between">
          <TypographyParagraph class="!m-0" :strong=true > Background Animations </TypographyParagraph>
          <Switch v-model:checked="appSettings.backgroundAnimation"/>
        </div>
        <div class="flex gap-x-2 items-center justify-between">
          <TypographyParagraph class="!m-0" :strong=true > Background Animations </TypographyParagraph>
          <Switch v-model:checked="appSettings.backgroundAnimation"/>
        </div>
        <div class="flex gap-x-2 items-center justify-between">
          <TypographyParagraph class="!m-0" :strong=true > Background Animations </TypographyParagraph>
          <Switch v-model:checked="appSettings.backgroundAnimation"/>
        </div>
      </div>
      <template #footer>
        <Button @click="goToDebug" danger class="flex justify-center items-center">
          Debug
          <template #icon>
            <BugOutlined />
          </template>
        </Button>
      </template>
    </Modal>
</template>