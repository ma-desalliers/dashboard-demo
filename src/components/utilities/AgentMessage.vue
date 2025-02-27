<template>
  <div class="agent-message q-px-none full-width">
    <q-card flat class="bg-green-1 full-wdith">
      <!-- Header Section -->
      <q-card-section class="q-pb-none">
        <div class="row items-center">
          <q-avatar size="40px" color="green" square class="c-rounded">
            <img src="/user/mike.png" alt="Mike" >
          </q-avatar>
          
          <div class="q-ml-sm col">
            <div class="text-subtitle1 text-dark">Message de Mike</div>
            <div class="text-caption text-grey-8">Directeur marketing chez Surfaceprep</div>
          </div>
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
                  Voici les faits saillants de cet article :
                </div>

                <!-- Message Content -->
                <div class="">
                {{ displayedText }}
                </div>
              </q-card-section>
            </q-card>
          </q-card-section>

          <!-- Action Button -->
          <q-card-actions class="q-px-md q-pb-md">
            <q-btn
              unelevated
              class="c-px-md"
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
import typeWriter from '~/src/asset/composable/typewriter';

// Define hardcoded data structures to match the screenshot
const agent = {
  name: 'Mike',
  jobTitle: 'Directeur marketing chez Surfaceprep',
  avatarUrl: '/mike-avatar.jpg'
}


const emit = defineEmits<{
  (e: 'action-click'): void
}>()

const expanded = ref(true)
const displayedText = ref("")
const isTyping = ref(false)

// Start the typing effect
const startTyping = () => {
  //if (inputMessage.value.trim() === '') return
  
  isTyping.value = true
  displayedText.value = ''
  
  // Call our typeWriter function
  typeWriter(
    `Cet article s’adresse aux entreprises manufacturières qui désirent réduire les défauts de fabrication.

L’article propose des stratégies pour choisir le bon système de vision.`,
    (text) => {
      displayedText.value = text
    },
    () => {
      // This is called when typing is complete
      isTyping.value = false
    }
  )
}

onMounted(()=>{
  startTyping()
})




</script>

<style scoped lang="scss">
.agent-message {
  :deep(.q-card) {
    border-radius: 4px;
  }
}
</style>