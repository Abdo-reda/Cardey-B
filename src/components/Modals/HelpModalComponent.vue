<script setup lang="ts">
import { RoutesEnum } from '@/core/enums/routesEnum';
import router from '@/plugins/router';
import { BugOutlined } from '@ant-design/icons-vue';
import { Button, Modal } from 'ant-design-vue';

const helpOpen = defineModel<boolean>({
  default: false
})

</script>

<template>
   <Modal v-model:open="helpOpen" title="Help & Info" :closable="true">
      <div>
       
    
      </div>
      <template #footer>
      </template>
    </Modal>
</template>