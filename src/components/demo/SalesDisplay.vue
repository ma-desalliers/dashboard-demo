<template>
  <q-card flat class="module-card q-pa-lg">
    <div class="row q-col-gutter-xl">
      <!-- Left Section -->
      <div class="col-12 col-md-6">
        <div class="text-overline q-mb-sm">
          <q-chip class="less-round text-blue bg-blue-1">  Module en développement</q-chip>
        </div>
        
        <div class="text-h4 text-bold q-mb-md">
          <span class="text-blue">Développement des affaires</span> propulsé par l'IA
        </div>
        
        <div class="text-subtitle1 q-mb-lg text-grey-8">
          Augmenter votre chiffre d'affaires grâce à une feuille de route alignée aux métriques leviers propre à votre entreprise.
        </div>

        <!-- Feature List -->
        <div class="features-list q-mb-lg">
          <div v-for="(feature, index) in features" :key="index" class="feature-item q-mb-sm">
            <q-item dense class="q-pa-none">
              <q-item-section avatar style="min-width: 23px;">
                <q-icon name="check_circle" color="blue" size="18px" />
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
          <div class="text-center text-overline q-mb-sm">INTÉGRATIONS PRÉVUES</div>
          <div class="row q-col-gutter-md items-center justify-evenly">
            <div v-for="(integration, index) in integrations" :key="index" class="col-auto">
              <q-img
                :src="`/images/${integration.name.toLowerCase()}.png`"
                class="integration-logo"
                :width="`${integration.width}px`"
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
  {
    name: 'Wordpress',
    width: 174
  },
  {
    name: 'Zoho',
    width: 87
  },
  {
    name: 'Sage',
    width: 70
  },
  {
    name: 'Xero',
    width: 45
  },
  {
    name: 'Sap',
    width: 82
  }
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
.less-round {
  border-radius: 6px;
}
.module-card {
  background: white;
}

.video-preview {
  overflow: hidden;
  border-radius: 6px;
  
  .video-thumbnail {
    transition: transform 0.3s ease;
    cursor: pointer;

    &:hover {
      transform: scale(1.02);
    }
  }
}

.feature-item .q-item-section[avatar] {
  padding-right: 0;
  min-width: none;
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