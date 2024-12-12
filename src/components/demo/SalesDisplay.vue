<template>
  <q-card flat bordered class="module-card q-pa-lg">
    <div class="row q-col-gutter-xl">
      <!-- Left Section -->
      <div class="col-12 col-md-6">
        <div class="text-overline q-mb-sm">
          <q-chip class="text-blue bg-blue-1">  Module en développement</q-chip>
        </div>
        
        <div class="text-h4 text-bold text-blue q-mb-md">
          Développement des affaires propulsé par l'IA
        </div>
        
        <div class="text-subtitle1 q-mb-lg text-grey-8">
          Augmenter votre chiffre d'affaires grâce à une feuille de route alignée aux métriques leviers propre à votre entreprise.
        </div>

        <!-- Feature List -->
        <div class="features-list q-mb-lg">
          <div v-for="(feature, index) in features" :key="index" class="feature-item q-mb-sm">
            <q-item dense class="q-pa-none">
              <q-item-section avatar>
                <q-icon name="check_circle" color="blue" />
              </q-item-section>
              <q-item-section>
                <div class="row items-center">
                  <span class="feature-text">{{ feature.text }}</span>
                  <q-icon
                    v-if="feature.hasInfo"
                    name="info"
                    size="xs"
                    color="grey-6"
                    class="q-ml-sm cursor-pointer"
                  >
                    <q-tooltip>{{ feature.tooltip }}</q-tooltip>
                  </q-icon>
                </div>
              </q-item-section>
            </q-item>
          </div>
        </div>


      </div>

      <!-- Right Section -->
      <div class="col-12 col-md-6">
        <!-- Video Preview -->
        <q-card class="video-preview" flat bordered>
          <q-img
            src="/api/placeholder/600/400"
            class="video-thumbnail"
          >
            <div class="absolute-center">
              <q-btn
                round
                color="white"
                text-color="primary"
                icon="play_arrow"
                size="lg"
                @click="playVideo"
              />
            </div>
          </q-img>
        </q-card>

        <!-- Integrations -->
        <div class="q-mt-lg">
          <div class="text-overline q-mb-sm">INTÉGRATIONS PRÉVUES</div>
          <div class="row q-col-gutter-md items-center">
            <div v-for="(integration, index) in integrations" :key="index" class="col-auto">
              <q-img
                :src="`/api/placeholder/100/40`"
                :ratio="16/9"
                class="integration-logo"
                width="100px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Feature {
  text: string
  hasInfo: boolean
  tooltip?: string
}

const email = ref('')

const features: Feature[] = [
  { text: 'Tradeshow', hasInfo: true, tooltip: 'Information about tradeshow feature' },
  { text: 'Séquences de courriel', hasInfo: true, tooltip: 'Information about email sequences' },
  { text: 'Formation des représentants', hasInfo: false },
  { text: 'Recherche complexe de produits', hasInfo: true, tooltip: 'Advanced product search capabilities' },
  { text: 'Guide de comparaison de produit', hasInfo: true, tooltip: 'Product comparison features' },
  { text: "Demande d'avis Google", hasInfo: true, tooltip: 'Google review request system' }
]

const integrations = [
  'Zoho',
  'Salesforce',
  'HubSpot',
  'Pipedrive',
  'SAP'
]

const handleSubscribe = () => {
  // Handle subscription logic here
  console.log('Subscribing with email:', email.value)
}

const playVideo = () => {
  // Handle video playback logic here
  console.log('Playing video preview')
}
</script>

<style scoped lang="scss">
.module-card {
  background: white;
}

.video-preview {
  overflow: hidden;
  border-radius: 8px;
  
  .video-thumbnail {
    transition: transform 0.3s ease;
    cursor: pointer;

    &:hover {
      transform: scale(1.02);
    }
  }
}

.integration-logo {
  opacity: 0.7;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 1;
  }
}

.feature-text {
  font-weight: 500;
}

.registration-section {
  border-top: 1px solid #e0e0e0;
  padding-top: 1.5rem;
}
</style>