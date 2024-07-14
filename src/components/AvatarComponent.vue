<script setup lang="ts">
import { Avatar } from 'ant-design-vue';
import { ColorsEnum } from '@/core/enums/colorsEnum';
import { AvatarsEnum } from '@/core/enums/avatarsEnum';
import { defineAsyncComponent, shallowRef, watch } from 'vue';

interface IAvatarProps {
    color: ColorsEnum;
    avatarIcon: AvatarsEnum;
}

const props = defineProps<IAvatarProps>();
const svgComponent = shallowRef();

// const svgComponent = computed(() => {
//     return defineAsyncComponent(() => import(`@/assets/svgs/${props.avatarIcon}.svg?component`));
// });

watch(
    () => props.avatarIcon,
    () => {
        svgComponent.value = defineAsyncComponent(() => import(`@/assets/svgs/${props.avatarIcon}.svg?component`));
    },
    { immediate: true }
);

</script>

<template>
    <!-- <component :is="svgComponent" /> -->
    <Avatar class="bg-white shadow-md border border-gray-100 flex justify-center items-center">
        <template #icon>
            <component height="60%" width="60%" :color="color" :fill-opacity="0.3" :is="svgComponent" />
        </template>
    </Avatar>
</template>