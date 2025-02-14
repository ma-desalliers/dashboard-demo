<template>
  <div class="agent-message q-pa-md">
    <q-card flat class="bg-green-1">
      <!-- Header Section -->
      <q-card-section class="q-pb-none">
        <div class="row items-center">
          <q-avatar size="40px">
            <img src="" alt="Mike">
          </q-avatar>
          
          <div class="q-ml-sm col">
            <div class="text-subtitle1 text-dark">Message de Mike</div>
            <div class="text-caption text-grey-8">Directeur marketing chez Surfaceprep</div>
          </div>
          
          <q-btn
            flat
            round
            dense
            :icon="expanded ? 'expand_less' : 'expand_more'"
            @click="expanded = !expanded"
          />
        </div>
      </q-card-section>

      <!-- Content Section -->
      <q-slide-transition>
        <div v-show="expanded">
          <q-card-section>
            <q-card flat class="bg-white">
              <q-card-section>
                <!-- Greeting -->
                <div class="text-body1 q-mb-md">
                  Salut Marc-André, voici les faits saillants de cet article :
                </div>

                <!-- Message Content -->
                <div class="q-gutter-y-md">
                  <div>
                    <div class="row">
                      <div class="text-weight-bold text-body1">Audience:</div>
                      <div class="col q-ml-sm text-body1">
                        Les entreprises manufacturières qui désirent réduire les défauts de fabrication.
                      </div>
                    </div>
                  </div>
                  <div>
                    <div class="row">
                      <div class="text-weight-bold text-body1">Valeur:</div>
                      <div class="col q-ml-sm text-body1">
                        Le contenu présente des stratégies pour éviter les coûts associés à l'achat du mauvais système de vision.
                      </div>
                    </div>
                  </div>
                  <div>
                    <div class="row">
                      <div class="text-weight-bold text-body1">Stratégie:</div>
                      <div class="col q-ml-sm text-body1">
                        Publier cet article sur votre site internet améliorera votre autorité.
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-card-section>

          <!-- Action Button -->
          <q-card-actions class="q-px-md q-pb-md">
            <q-btn
              unelevated
              color="positive"
              label="Afficher l'article"
              @click="$emit('action-click')"
            />
          </q-card-actions>
        </div>
      </q-slide-transition>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Define hardcoded data structures to match the screenshot
const agent = {
  name: 'Mike',
  jobTitle: 'Directeur marketing chez Surfaceprep',
  avatarUrl: '/mike-avatar.jpg'
}

const message = {
  greeting: 'Salut Marc-André, voici les faits saillants de cet article :',
  sections: [
    {
      title: 'Audience',
      content: 'Les entreprises manufacturières qui désirent réduire les défauts de fabrication.'
    },
    {
      title: 'Valeur',
      content: "Le contenu présente des stratégies pour éviter les coûts associés à l'achat du mauvais système de vision."
    },
    {
      title: 'Stratégie',
      content: 'Publier cet article sur votre site internet améliorera votre autorité.'
    }
  ],
  actionButton: {
    label: "Afficher l'articl"
  }
}

const emit = defineEmits<{
  (e: 'action-click'): void
}>()

const expanded = ref(true)
</script>

<style scoped lang="scss">
.agent-message {
  :deep(.q-card) {
    border-radius: 8px;
  }
}
</style>