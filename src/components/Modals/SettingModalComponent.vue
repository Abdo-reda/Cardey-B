<script setup lang="ts">
import { Modal, Button } from 'ant-design-vue';
import {
	BugOutlined,
	ControlOutlined,
	InfoCircleOutlined
} from '@ant-design/icons-vue';
import router from '@/plugins/router';
import { RoutesEnum } from '@/core/enums/routesEnum';

const isOpen = defineModel<boolean>();

function goToDebug() {
	isOpen.value = false;
	router.push({ name: RoutesEnum.DEBUG });
}
</script>

<template>
	<Modal v-model:open="isOpen" :closable="false">
		<template #title>
			<span>
				<ControlOutlined />
				Settings
			</span>
		</template>
		<div>
			<div class="my-4">
				<p>Random settings like audio</p>
			</div>
			<Button @click="goToDebug" danger class="flex justify-center items-center mt-4">
				Go To Debug
				<template #icon>
					<BugOutlined />
				</template>
			</Button>
		</div>
		<template #footer> </template>
	</Modal>
</template>
