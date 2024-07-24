<script setup lang="ts">
import { Avatar, Tooltip } from 'ant-design-vue';
import { ColorsEnum } from '@/core/enums/colorsEnum';
import { AvatarsEnum } from '@/core/enums/avatarsEnum';
import { defineAsyncComponent, shallowRef, watch } from 'vue';

interface IAvatarProps {
    color: ColorsEnum;
    avatarIcon: AvatarsEnum;
    tooltip?: string;
}

const props = defineProps<IAvatarProps>();
const svgComponent = shallowRef();

watch(
    () => props.avatarIcon,
    () => {
        svgComponent.value = defineAsyncComponent({
            loader: () => import(`@/assets/svgs/${props.avatarIcon}.svg?component`),
        });
    },
    { immediate: true }
);

</script>

<template>
    <Avatar v-if="!tooltip"
        class="bg-white dark:bg-gray-800 shadow-md border border-gray-100 flex justify-center items-center">
        <template #icon>
            <component height="60%" width="60%" :color="color" :fill-opacity="0.3" :is="svgComponent" />
        </template>
    </Avatar>
    <Tooltip v-else :color="color">
        <template #title>
            {{ tooltip }}
        </template>
        <Avatar class="bg-white dark:bg-gray-800 shadow-md border border-gray-100 flex justify-center items-center">
            <template #icon>
                <component height="60%" width="60%" :color="color" :fill-opacity="0.3" :is="svgComponent" />
            </template>
        </Avatar>
    </Tooltip>
</template>