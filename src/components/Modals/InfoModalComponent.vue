<script setup lang="ts">
import { Avatar, List, ListItem, ListItemMeta, Modal, TabPane, Tabs } from 'ant-design-vue';
import { SmileOutlined, HistoryOutlined, InfoCircleOutlined } from '@ant-design/icons-vue';
import { CHANGELOG } from '@/core/constants/changelogConstant';
import { ref } from 'vue';

interface IContributor {
	title: string;
	description: string;
	github: string;
	img: string;
}

const activeTab = ref('1');

const contributors: IContributor[] = [
	{
		title: 'AbdoReda (NoPoint)',
		github: 'https://github.com/Abdo-reda',
		description: 'Just a Random Curious Being.',
		img: 'A.jpg'
	},
	{
		title: 'Nour Abdellatif',
		description: 'Just a Nerd.',
		github: 'https://github.com/NourAbdellatif',
		img: 'N.png'
	},
	{
		title: 'Sameh',
		description: 'Just a Chill Guy.',
		github: 'https://github.com/MuhammadSameh',
		img: 'S.jpg'
	}
];

const isOpen = defineModel<boolean>();
</script>

<template>
	<Modal v-model:open="isOpen" :closable="false">
		<Tabs v-model:activeKey="activeTab">
			<TabPane key="1">
				<template #tab>
					<span>
						<InfoCircleOutlined />
						Info
					</span>
				</template>
				Hi <SmileOutlined />, this project was created by three people. If you stumbled upon
				this randomly please,
				<a href="mailto:3bdo.reda@gmail.com" class="italic text-primary/50 font-semibold">
					contact us
				</a>
				and tell us what you think.
				<List item-layout="horizontal" class="m-4" :data-source="contributors">
					<template #renderItem="{ item }">
						<ListItem>
							<ListItemMeta class="!items-center" :description="item.description">
								<template #title>
									<a :href="item.github">{{ item.title }}</a>
								</template>
								<template #avatar>
									<a :href="item.github">
										<Avatar :src="`images/${item.img}`" />
									</a>
								</template>
							</ListItemMeta>
						</ListItem>
					</template>
				</List>
			</TabPane>
			<TabPane key="2">
				<template #tab>
					<span>
						<HistoryOutlined />
						Changelog
					</span>
				</template>
				<List item-layout="horizontal" class="m-4" :data-source="CHANGELOG">
					<template #renderItem="{ item }">
						<ListItem>
							<ListItemMeta>
								<template #title>
									 <span class="!font-bold"> V{{ item.version }} - {{ item.title }} </span>
								</template>
								<template #description>
									<ul>
										<li v-for="change in item.changes" :key="change">
											- {{change}}
										</li>	
									</ul>
								</template>
							</ListItemMeta>
						</ListItem>
					</template>
				</List>
			</TabPane>
		</Tabs>
		<template #footer> </template>
	</Modal>
</template>
