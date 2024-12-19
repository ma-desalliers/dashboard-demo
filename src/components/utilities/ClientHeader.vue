<template>
<div class="row justify-between q-px-md full-width">
  <div>

    <div name="expand_more" class="row items-center cursor-pointer">
      <!-- Current company display -->
      <div v-if="company.logoType == 'svg'" style="height:25px; width:25px" class="q-mr-sm">
        <div v-html="company.logo"></div>
      </div>
      <q-avatar rounded v-if="company.logoType == 'img'" size="24px" class="q-mr-sm">
        <img :src="company.logo" alt="Company logo" class="c-img-contain">

      </q-avatar>
      <div class="c-company-name">{{ company.name }}</div>

      <!-- Menu trigger icon with menu -->
      <q-icon name="expand_more" size="sm" class="q-ml-xs cursor-pointer">

      </q-icon>

      <q-menu transition-show="jump-down" transition-hide="jump-up" class="company-menu">
        <q-list style="min-width: 200px">
          <q-item v-for="item in company.subCompany" :key="item.name" clickable v-close-popup
            @click="openCompany(item)">
            <q-item-section avatar v-if="item.logoType === 'svg'" style="max-width: 40px">
              <div style="height:25px; width:25px">
                <div v-html="item.logo"></div>
              </div>
            </q-item-section>
            <q-item-section v-else style="max-width: 40px">
              <q-avatar rounded size="24px" class="q-mr-sm">
                <img :src="item.logo" alt="Company logo" class="c-img-contain">

              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ item.name }}</q-item-label>
            </q-item-section>

          </q-item>
        </q-list>
      </q-menu>
    </div>
  </div>
  <div style="align-self: flex-end;" v-if="isMobile" @click="toggleMenu">
    <q-icon v-if="menuVisible" name="close" size="24px"> </q-icon>
    <q-icon v-else name="menu" size="24px" > </q-icon>
  </div>
</div>

</template>

<script setup lang="ts">
import company from '@/src/repository/client'
import { useDemoCurrentPageStore } from '~/src/stores/demoCurrentPage';
import { useNotificationStore } from '@/src/stores/notificationStore';
import { useMainDisplayStore } from '@/src/stores/mainDisplayStore';

const route = useRoute()

const mainDisplayStore = useMainDisplayStore()

const isMobile = computed(() => mainDisplayStore.isMobile)
const menuVisible = computed(() => mainDisplayStore.showMenu)

const closeMenu = () =>{
	mainDisplayStore.setShowMenu(false)
}

const showMenu = () =>{
	mainDisplayStore.setShowMenu(true)
}

const toggleMenu = () =>{
	if(menuVisible.value) closeMenu()
	else showMenu()
}

const openCompany = async( company:any) =>{
	window.location.href = company.link
}



const isPricingRoute = computed(() => route.path === '/pricing')


</script>

<style scoped lang="scss">

.section-header {
	.text-caption {
		font-size: 0.75rem;
		letter-spacing: 0.4px;
	}
}

.c-company-name{
	font-size:1.2rem;
	color:#213343;
}

.c-light-border-bottom{
	border-bottom: solid 1px #e7e7e7;
}

</style>