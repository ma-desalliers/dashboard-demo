<template>
  <div class="sidebar-menu q-px-md q-py-lg">
    <!-- Company Header -->
    <div class="q-mb-md q-pb-md c-light-border-bottom">
      <ClientHeader></ClientHeader>
    </div>

    <!-- Growth Plan Section-->
    <div class="section-container c-light-border-bottom">
      <GenerateContentPopup></GenerateContentPopup>
      <div clas="section-header q-mb-sm q-px-md">
        <div class="row items-center q-mb-md cursor-pointer q-px-md q-mb-xs q-py-xs">
          <div class="">{{ $t("growth-plan") }}</div>
        </div>
        <div class="row items-center q-mb-md cursor-pointer q-px-md q-mb-xs q-py-xs" @click="goto('/marketing/calendar')">
          <div class="">{{ $t("content-calendar") }}</div>
        </div>
        <div class="row items-center q-mb-md cursor-pointer q-px-md q-mb-xs q-py-xs">
          <div class="">{{ $t("opportunity") }}</div>
        </div>
      </div>
    </div>

    <!-- Departments Section -->
    <div class="section-container c-light-border-bottom q-pb-md q-pt-md">
      <div class="departments ">
        <q-expansion-item v-for="dept in departments" :key="dept.name" v-model="dept.expanded" :class="[
          'department-item']">
          <template v-slot:header>
            <q-item-section avatar class="">
              <q-avatar rounded size="32px">
                <img class="c-img-cover" :src="dept.icon" :alt="dept.name" :style="{ backgroundColor: dept.color }" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              {{ dept.name }}
            </q-item-section>
            <q-item-section side v-if="dept.new">
              <q-chip :color="dept.color" text-color="white" class="text-caption" style="border-radius: 4px">
                {{ $t("new") }}
              </q-chip>
            </q-item-section>

          </template>

          <q-list padding class="sub-items">
            <q-item v-for="subItem in dept.subItems" :key="subItem.name" clickable v-ripple
              :class="`sub-item ${getSubItemColor(dept, subItem.active)}`" @click="handleSubItemClick( subItem)">
              <q-item-section class="q-py-sm">
                {{ subItem.name }}
              </q-item-section>
              <selected-element-indicator rounded :color="`bg-${dept.color}`" :show="subItem.active" />
            </q-item>
          </q-list>
        </q-expansion-item>
      </div>
    </div>

    <!-- Knowledge Base Section -->
    <div class="section-container q-mt-md">
      <q-expansion-item v-model="knowledgeSection.expanded" class="knowledge-section q-mb-xs">
        <template v-slot:header>
          <q-item-section>
            {{ knowledgeSection.name }}
          </q-item-section>
        </template>

        <q-list padding class="sub-items">
          <q-item v-for="item in knowledgeSection.items" :key="item.name" clickable v-ripple :class="[
            'q-py-sm sub-item',
            { 'active-sub-item': item.active }
          ]" @click="handleKnowledgeItemClick(item)">
            <q-item-section class="q-pl-md">
              {{ item.name }}
            </q-item-section>
            <q-item-section side v-if="item.comingSoon">
              <span class="text-grey-6 text-caption">{{ $t('coming-soon') }}</span>
            </q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>

      <q-btn v-if="false" class="full-width q-mt-md" :class="{ 'shine-effect': !isPricingRoute }" color="primary"
        text-color="white" :label="isPricingRoute ? 'Demo' : 'Pricing'" @click="handleButtonClick" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from "@/src/stores/notificationStore";
import { useMainDisplayStore } from "@/src/stores/mainDisplayStore";
import { useCompanyStore } from "~/src/stores/companyStore";
import ClientHeader from "~/src/components/shared/ClientHeader.vue";
const route = useRoute();
const router = useRouter();
const notificationStore = useNotificationStore();
const mainDisplayStore = useMainDisplayStore();
const { t } = useI18n();
const isMobile = computed(() => mainDisplayStore.isMobile);
const companyStore = useCompanyStore();

const departments = reactive([
  {
    name: t("marketing"),
    active: true,
    expanded: true,
    page: "demo",
    color: "green",
    new: false,
    icon: `/user/marketing.png`,
    subItems: [
      { name: "SEO", active: true, path: '/marketing/seo/keywords' },
      { name: "Email", active: false },
      { name: "Social Media", active: false },
      { name: "Leads magnets", active: false }
    ]
  },
  /* {
     name: t("sales"),
     active: false,
     expanded: false,
     page: "sales",
     color: "blue",
     icon: `/${company.folder}/user/sale.png`,
     subItems: [
       { name: "Leads", active: false },
       { name: "Opportunities", active: false }
     ]
   },
   {
     name: t("support"),
     active: false,
     expanded: false,
     color: "purple",
     page: "SupportDisplay",
     icon: `/${company.folder}/user/support.png`,
     subItems: [
       { name: "Tickets", active: false },
       { name: "Knowledge Base", active: false }
     ]
   },
   {
     name: t("hr"),
     active: false,
     expanded: false,
     color: "yellow",
     page: "HrDisplay",
     icon: `/${company.folder}/user/hr.png`,
     subItems: [
       { name: "Recruitment", active: false },
       { name: "Training", active: false }
     ]
   }*/
])

const knowledgeSection = reactive({
  name: t("knowledge"),
  expanded: true,
  items: [
    { name: t("product"), active: false, path:`/company/${companyStore.theCompany.uuid}/products` },
    { name: t("audience"), active: false },
    { name: t("branding"), active: false },
    { name: t("channels"), active: false, comingSoon: true }
  ]
})

const handleKnowledgeItemClick = (item: any) => {
  if(item.path) goto(item.path)

  if (item.comingSoon) {
    notificationStore.showBasic({
      message: `${item.name} coming soon!`,
      color: "info",
      position: "top-left",
      timeout: 2000
    })
    return
  }

  // Reset all active states
  knowledgeSection.items.forEach(i => i.active = false)
  // Set clicked item as active
  item.active = true
}

const handleSubItemClick = async (subItem: any) => {

  // Reset all active states
  departments.forEach(d => {
    d.active = false
    d.subItems.forEach(si => si.active = false)
  })
  
  if(subItem.path){
    goto(subItem.path)
  }
  // Set only the clicked sub-item as active
  subItem.active = true


}

const goto = (path:string) =>{
  router.push(path)
}

const getSubItemColor = (dept: any, active: boolean) => {
  return active ? `bg-${dept.color}-1 text-${dept.color}` : ''
}

interface Question {
  id: number;
  text: string;
  answered: boolean;
}

const isPricingRoute = computed(() => route.path === "/pricing");

// Updated button click handler
const handleButtonClick = async () => {
  if (isPricingRoute.value) {
    await router.push("/demo");
  } else {
    await router.push("/pricing");
  }
};
</script>

<style scoped lang="scss">
.sidebar-menu {
  width: 300px;
  height: 100%;
  border-right: 1px solid #e7e7e7;
  background: var(--main-gray);
  overflow: hidden;
}

.section-header {
  .text-caption {
    font-size: 0.75rem;
    letter-spacing: 0.4px;
  }
}

.departments {
  .q-item {
    padding-top: 4px !important;
    padding-bottom: 4px !important;
    min-height: unset;
    border-radius: 4px;
  }
}

.progress-bar {
  width: 40px;
  margin-right: 8px;
  margin-bottom: 3px;
  border-radius: 4px;
}

.c-company-name {
  font-size: 1.2rem;
  color: #213343;
}

.c-light-border-bottom {
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

.c-linear-container {
  align-items: center;
  margin-top: 4px;
}

.shine-effect {
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(to right,
        transparent 0%,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.4) 50%,
        rgba(255, 255, 255, 0) 100%);
    filter: blur(5px);
    transform: skewX(-25deg);
    animation: shine 4s infinite;
  }
}

.question-label-container {
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
