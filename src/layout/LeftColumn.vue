<template>
	<div class="sidebar-menu q-px-md q-py-lg">
		<!-- Company Header -->
		 <div class="q-mb-md q-pb-md c-light-border-bottom">
		<ClientHeader></ClientHeader>
	</div>

		<!-- Growth Plan Section
<div class="row items-center q-mb-md cursor-pointer">
	<q-icon name="rocket_launch" size="sm" class="text-primary q-mr-sm" />
	<div class="text-weight-medium">Plan de croissance</div>
</div> -->

		<!-- Departments Section -->
		<div class="section-container q-mb-md">
			<div class="section-header q-mb-sm q-px-md">
				<div class="row items-center">
					<div class="c-box-subtitle q-pr-sm">AI Departments</div>
					<Tooltip :title="'Content Marketing'" :description="'this is a description '"></Tooltip>
				</div>
			</div>
			<div class="departments c-light-border-bottom q-pb-md">
				<q-item v-for="dept in departments" :key="dept.name" clickable @click="openDept(dept)" v-ripple
					class="q-px-md q-mb-xs q-py-xs"
					:class="dept.active ? `bg-${dept.color}-1 text-${dept.color}` : `bg-${dept.color}-hover`">
					<q-item-section avatar>
						<q-avatar rounded size="32px">
							<img class="c-img-cover" :src="dept.icon" :alt="dept.name" :style="{backgroundColor: dept.color}">
						</q-avatar>
					</q-item-section>
					<q-item-section>
						{{ dept.name }}
					</q-item-section>
					<q-item-section side v-if="dept.new">
						<q-chip :color="dept.color" text-color="white" class="text-caption" style="border-radius: 4px">
							New
						</q-chip>
					</q-item-section>
					<selected-element-indicator rounded :color="`bg-${dept.color}`"
						:show="dept.active"></selected-element-indicator>
				</q-item>
			</div>
		</div>

		<div class="section-container q-mb-sm   q-pt-md  ">
			<div class="section-header q-mb-sm q-px-md">
				<div class="row items-center">
					<div class="c-box-subtitle q-pr-sm">Knowledge center</div>
					<Tooltip :title="'Content Marketing'" :description="'this is a description '"></Tooltip>
					<div class="row c-linear-container q-pt-sm">
						<div></div>
						<q-linear-progress :value="0.4" size="11px" color="green" track-color="green" class="progress-bar"
							label="" />
						<span class="question-label-container">2/5 question</span>
					</div>
				</div>
			</div>

			<div class="c-light-border-bottom departments  q-pb-lg q-pt-sm">
				<q-item v-for="question in questions" :key="question.id" clickable v-ripple class="q-px-md q-mb-xs q-py-xs"
					@click="handleQuestionClick(question)">
					<q-item-section avatar>
						<q-avatar rounded size="24px" class="bg-green-1">
							<q-icon name="add" color="green" />
						</q-avatar>
					</q-item-section>
					<q-item-section>
						{{ question.text }}
					</q-item-section>
				</q-item>
			</div>
		</div>

		<!-- Knowledge Base Section -->
		<div class="section-container q-mb-md  q-pt-md">
			<div class="section-header q-mb-sm q-px-md">
				<div class="row items-center">
					<div class="c-box-subtitle q-pr-sm">Company</div>
					<Tooltip :title="'Content Marketing'" :description="'this is a description '"></Tooltip>
				</div>
			</div>
			<div class="knowledge-items departments">
				<q-item v-for="item in knowledgeItems" :key="item.name" clickable v-ripple class="q-px-md">
					<q-item-section avatar>
						<q-avatar rounded size="32px" class="bg-purple-1">
							<q-icon :name="item.icon" color="purple" />
						</q-avatar>
					</q-item-section>
					<q-item-section>
						{{ item.name }}
					</q-item-section>
					<q-item-section side class="c-row c-linear-container">
						<div>
							<q-linear-progress :value="item.progress" size="xl" :color="item.progress >= 0.7 ? 'green' : 'orange'"
								:track-color="item.progress >= 0.7 ? 'green' : 'orange'" class="progress-bar" />
						</div>
						<div class="">
							{{ item.progress * 10 }}/10
						</div>
					</q-item-section>
				</q-item>
			</div>
			<div class="q-px-md q-pt-sm">
				<q-btn v-if="false" class="full-width q-mt-md" :class="{ 'shine-effect': !isPricingRoute }" color="primary"
					text-color="white" :label="isPricingRoute ? 'Demo' : 'Pricing'" @click="handleButtonClick" />
			</div>
		</div>
		<!-- Pilot Project Section 
<div class="section-container">
	<div class="section-header q-mb-sm">
		<div class="row items-center justify-between">
			<div class="c-box-subtitle">Projet pilote</div>
			<q-icon name="help_outline" size="xs" class="text-grey-6" />
		</div>
	</div>
	<div class="pilot-items">
		<q-item v-for="item in pilotItems" :key="item.name" clickable v-ripple class="q-px-none">
			<q-item-section avatar>
				<q-avatar size="32px">
					<q-icon :name="item.icon" />
				</q-avatar>
			</q-item-section>
			<q-item-section>
				{{ item.name }}
			</q-item-section>
		</q-item>
	</div>
</div>-->
	</div>
</template>

<script setup lang="ts">
import company from '@/src/repository/client'
import { useDemoCurrentPageStore } from '~/src/stores/demoCurrentPage';
import { useNotificationStore } from '../stores/notificationStore';
import { useMainDisplayStore } from '../stores/mainDisplayStore';
const route = useRoute()
const router = useRouter()
const notificationStore = useNotificationStore()
const mainDisplayStore = useMainDisplayStore()

const isMobile = computed(() => mainDisplayStore.isMobile)

const closeMenu = () =>{
	mainDisplayStore.setShowMenu(false)
}

interface KnowledgeItem {
	name: string;
	icon: string;
	progress: number;
}

interface PilotItem {
	name: string;
	icon: string;
}

const departments = reactive( [
{ name: 'Marketing',active:true, page:"demo", color:"green", new:true ,  icon: 'https://s3-alpha-sig.figma.com/img/6681/9b78/606aa85d62ea6621249bbab802a3b6c3?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NBqOUgYA7ZAkAdER6TPWwdDcPvLHjijT8wy1n0YyDARJx9TS9mE9qgb5cFGaF836JC8vZA~Wnz4PVrr-jGnH1SOIZGVkMjvtxmyawC94-5vOZZ5Cztq~kHrmQFDuAi8Q36FeHcc8Jxlk~z8IxhPAuUD-Z0USNmNmcT0UD-NTYRD2zb2WUiuiK3x9pfU2FGvG9uk5Pw5budjN37ihuTMZvHhJ~7W~lKu~HPqkuiQFr8-SGs0WNvrLyC8pPPdXEAliDUJFLoEYqxwPbkZ0tgicLDuWmRyv1SBrYcYkv-oSIM4AkID-hSNelyw5OK23EIUMeWjFpM9LkHfz6JrlPu6LaQ__'},
{ name: 'Sales', color:"blue" ,page:"sales", icon: 'https://s3-alpha-sig.figma.com/img/ca22/0be1/0900c3512764d10cb323649cee99e036?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=pUpWY0WYxPxqt1s9sRy80Ha4lCBY8erHWK26t9eQGcS~7Dhk21DpQB-~nlNniYhdzCoRSzRGZV0PkFkz8-yMZV1sP3JhzTo0wZp-ZFllJzhk4so1IGxVq1wLju3l5wZbUdw7ZA8QBvqJe0sc8BG56dbmL4-k17XMQTp6lbU6wwwGQ~dVypQb6NcFtEz0N4lFoR1dWFquJ90iSHssiiDJ3OVtvWTCkJrue1cdkL-upf7Jjr34tNMJsiNuWgsSCOqpSMXJIikg-ZARR1NoSoC494hSKqZijVQxORfBmdl3WbKNhhgXVbN2BE~jtEi4onuU-cQOoVhuXuHHaPq6D5uXKQ__' },
{ name: 'Support', color:'purple',page:"SupportDisplay", icon: 'https://s3-alpha-sig.figma.com/img/cc65/eef8/a13492f5ddf5a8d78627e4b69abe8d9a?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=iS~F9tOgeJX75do25JMrjg7dSs8XJR8WRWPfpxV4wFFFkqWsdr2GSDx75P1Oh0OGru~o5qq5EeSCF9r-J1uOGSh~Lxf-aEY2q~XaBkX6WfIbaTFcOGt51FTIPPrij78zflDaytPEI4S3aXWFuMKW8vXalPVevhHVFxfWIG9J99gmtrPPuHMVnMDi7k2bJm-qpNm7LVzDnqk88R7Ae9cVHFiXxe5jV9FAFeU5leF4LZ54OiWg~xZR4wQGeP-Y17jSKwLqE6akGFIcSAt6BChGEoE-n8Oua6FOxOZMQ0PzfjH-I6OdGMTGPyVRTZjYrqHHOv~vwSvMbXbms-gkqrx00w__' },
{ name: 'HR', color:'yellow',page:"HrDisplay", icon: 'https://s3-alpha-sig.figma.com/img/f531/4bcb/20508d8057ddd872ef028224431117df?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=XTR0onY04aw1tVH-17Rh7LDB9ncPeUWpjcMaLWQoq6yDM2a42t6QYvoGCJmATu1cci-v-07yMJn9b82krhnYgr72MQ0ls3neF2DxvXgDygEITK6M95ryPlKoBbw4A3-cvdfm4b7MjyiSAjs3SIykkyP-GlOyQ7PvBuoc-cCj7w-ik4gzuYzqUcDGwQgr8Mit1srA415xDw4JHW-UUy8IL-XctXhGybivtrPNwd5HqB0kMKBSXxQgnosebbCOWmiM5LlJ09bKVBE2710cjgOfBEYx2hjftSiC9MVH1Ky0lgu7vzd5CQTrLU~vZ1QyTc80qu3F-bGRoKuUzlzE1Rf1Nw__' }
]);

const knowledgeItems: KnowledgeItem[] = [
{ name: 'Company', icon: 'business', progress: 0.8 },
{ name: 'Audience', icon: 'groups', progress: 0.3},
{ name: 'Product', icon: 'inventory_2', progress: 0.1 }
];

const openDept = async (dept: any) => {
	if (dept.name === 'Marketing') {
		departments.forEach(dep => dep.active = false);
		dept.active = true;
		await router.push(`/${dept.page}`);
	} else {
		// Show notification instead of navigating for unavailable departments
		notificationStore.showBasic({
			message: `${dept.name} agents available soon!`,
			color: 'info',
			position: 'top-left',
			timeout: 2000
		});
	}
};

const openCompany = async( company:any) =>{
	window.location.href = company.link
}

interface Question {
	id: number;
	text: string;
	answered: boolean;
}

const questions = ref<Question[]>([
{ id: 2, text: "What is your best product?", answered: false },
{ id: 1, text: "Who are your competitors?", answered: true },

{ id: 3, text: "What's your target market?", answered: true }
]);

const handleQuestionClick = (question: Question) => {
	// Handle question click
};



const isPricingRoute = computed(() => route.path === '/pricing')

// Updated button click handler
const handleButtonClick = async () => {
	if (isPricingRoute.value) {
		await router.push('/demo')
	} else {
		await router.push('/pricing')
	}
}




</script>

<style scoped lang="scss">
.sidebar-menu {
	width: 300px;
	height:100%;
	border-right:1px solid #e7e7e7; ;
	background: var(--main-gray);
	overflow:hidden
}

.section-header {
	.text-caption {
		font-size: 0.75rem;
		letter-spacing: 0.4px;
	}
}

.departments{
	.q-item{
		padding-top:4px!important;
		padding-bottom:4px !important;
		min-height: unset;
		border-radius: 4px;
	}
}

.progress-bar {
	width: 40px;
	margin-right: 8px;
	margin-bottom: 3px;
	border-radius: 4px;;
}

.c-company-name{
	font-size:1.2rem;
	color:#213343;
}

.c-light-border-bottom{
	border-bottom: solid 1px #e7e7e7;
}

:deep(.q-item) {
	min-height: 48px;
	border-radius: 8px;
	
	&:hover {
		background: rgba(0, 0, 0, 0.03);
	}
}

:deep(.q-item__section--side) {
	padding-right: 0;
}

:deep(.q-item__section--avatar) {
	min-width: 40px;
}

.c-linear-container{
	align-items: center;
	margin-top:4px;
}
.shine-effect {
	position: relative;
	overflow: hidden;
	
	&::after {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 50%;
		height: 100%;
		background: linear-gradient(
		to right,
		transparent 0%,
		rgba(255, 255, 255, 0) 0%,
		rgba(255, 255, 255, 0.4) 50%,
		rgba(255, 255, 255, 0) 100%
		);
		filter: blur(5px);
		transform: skewX(-25deg);
		animation: shine 4s infinite;
	}
}

.question-label-container{
	margin-bottom: 3px;
}

@keyframes shine {
	0% {
		left: -100%;
	}
	100% {
		left: 350%;
	}
}

/* Make sure the shine effect doesn't affect the button text */
.q-btn {
	position: relative;
	
	.q-btn__content {
		position: relative;
		z-index: 1;
	}
}
</style>