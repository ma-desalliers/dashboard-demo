<template>
  <div class="seo-strategy q-pa-md">
    <!-- Strategy Header -->
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6">Search Engine Optimization (SEO)</div>
      <q-btn flat dense label="Actions" icon-right="expand_more">
        <q-menu>
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section>Option 1</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>Option 2</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
    
    <div class="text-grey-7 q-mb-lg">
      Boost your website's visibility in search engines to attract more organic traffic, leading to increased sales and revenue growth.
    </div>

    <!-- Search Engines -->
    <div class="row q-gutter-sm q-mb-lg">
      <q-chip outline>
        <q-avatar icon="img:https://www.google.com/favicon.ico" />
        Google
      </q-chip>
      <q-chip outline>
        <q-avatar icon="img:https://www.bing.com/favicon.ico" />
        Bing
      </q-chip>
    </div>

    <!-- Tactics Section -->
    <CExpansionItem
      v-model="tacticsExpanded"
      title="Tactics"
      class="q-mb-md"
    >
      <q-list padding>
        <q-item v-for="tactic in tactics" :key="tactic.title">
          <q-item-section avatar>
            <q-icon name="assistant" color="green" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ tactic.title }}</q-item-label>
            <q-item-label caption>{{ tactic.subtitle }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn color="green" outline rounded size="sm" label="Best match" />
          </q-item-section>
        </q-item>
      </q-list>
    </CExpansionItem>

    <!-- AI Agents Section -->
    <CExpansionItem
      v-model="agentsExpanded"
      title="AI Agents"
      class="q-mb-md"
    >
      <q-list padding>
        <q-item v-for="agent in agents" :key="agent.name">
          <q-item-section avatar>
            <q-avatar>
              <img :src="agent.avatar">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ agent.name }}</q-item-label>
            <q-item-label caption>{{ agent.role }}</q-item-label>
            <q-item-label caption>{{ agent.tasks }} tasks</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </CExpansionItem>

    <!-- Campaigns Section -->
    <CExpansionItem
      v-model="campaignsExpanded"
      title="Campaigns"
    >
      <div class="q-pa-md text-center">
        <div class="row justify-center q-mb-md">
          <q-avatar size="48px">
            <img src="https://cdn.quasar.dev/img/avatar.png" />
          </q-avatar>
        </div>
        <div class="text-h6 q-mb-md">Mettez vos agents au travail.</div>
        <div class="text-grey-7 q-mb-md">
          Augmentez votre visibilité dans les moteurs de recherche.
        </div>
        <q-btn color="green" label="Activer ma campagne" />
      </div>

      <q-list padding>
        <q-item v-for="campaign in campaigns" :key="campaign.name">
          <q-item-section>
            <q-item-label>{{ campaign.name }}</q-item-label>
            <q-item-label caption>
              <q-badge :color="campaign.active ? 'green' : 'grey'" />
              {{ campaign.active ? 'Active' : 'Paused' }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </CExpansionItem>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tacticsExpanded = ref(true)
const agentsExpanded = ref(true)
const campaignsExpanded = ref(true)

const tactics = ref([
  { title: 'Target new search intents', subtitle: '1500 intent found' },
  { title: 'Update your pages content', subtitle: '25 pages found' },
  { title: 'Fix your pages technical issues', subtitle: '15 pages found' }
])

const agents = ref([
  { name: 'Mike', role: 'Keyword researcher', tasks: 15, avatar: 'https://cdn.quasar.dev/img/avatar1.jpg' },
  { name: 'Laura', role: 'Copywriter', tasks: 1500, avatar: 'https://cdn.quasar.dev/img/avatar2.jpg' },
  { name: 'Dieudonné', role: 'Wordpress Expert', tasks: 1300, avatar: 'https://cdn.quasar.dev/img/avatar3.jpg' }
])

const campaigns = ref([
  { name: 'USA_Manufacturers_EN', active: true },
  { name: 'CA_Manufacturers_FR', active: false }
])
</script>

<style scoped>
.seo-strategy {
  max-width: 800px;
  border-right: solid 1px #e7e7e7 ;
}
</style>