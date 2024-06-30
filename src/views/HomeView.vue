<script setup lang="ts">
import { Avatar, Button, FormItem, Input } from 'ant-design-vue';
import { computed, ref } from 'vue';

const name = ref('');

// const avatarName = computed(() => {
//     name.value.length > 56
//     return name.value;
// });

</script>

<template>
    <div class="h-full">
        <div class="text-center m-4">
            <p class="font-semibold text-3xl"> Cardey-B Game </p>
        </div>
        <div class="flex flex-col h-5/6 bg-red-200 items-center justify-center m-4 p-4">
            <div class="flex flex-col justify-center items-center">
                <Avatar class="hover:cursor-pointer size-32">
                </Avatar>
                <div class="flex flex-row items-center justify-center m-4 gap-4">
                    <FormItem class="m-0">
                        <Input v-model:value="name" />
                    </FormItem>
                </div>
                <div class="flex items-center justify-center gap-4">
                    <Button type="primary"> Host Game </Button>
                    <Button type="dashed"> Join Game </Button>
                </div>
            </div>
        </div>
    </div>
</template>
