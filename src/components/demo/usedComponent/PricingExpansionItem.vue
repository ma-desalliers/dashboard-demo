<template>
  <q-expansion-item
    v-model="isExpanded"
    :default-opened="true"
    expand-icon-class="hidden"
    header-class="q-pa-none"
  >
    <template v-slot:header>
      <div class="row full-width items-center justify-between q-px-md q-py-sm bg-grey-1">
        <div class="row items-center q-gutter-x-md">
          <q-icon
            :name="isExpanded ? 'expand_more' : 'expand_less'"
            size="24px"
            class="cursor-pointer"
          />
          <div class="row items-center q-gutter-x-sm">
            <div class="row">
              <q-avatar size="32px" class="avatar-overlap">
                <img src="https://s3-alpha-sig.figma.com/img/6681/9b78/606aa85d62ea6621249bbab802a3b6c3?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NBqOUgYA7ZAkAdER6TPWwdDcPvLHjijT8wy1n0YyDARJx9TS9mE9qgb5cFGaF836JC8vZA~Wnz4PVrr-jGnH1SOIZGVkMjvtxmyawC94-5vOZZ5Cztq~kHrmQFDuAi8Q36FeHcc8Jxlk~z8IxhPAuUD-Z0USNmNmcT0UD-NTYRD2zb2WUiuiK3x9pfU2FGvG9uk5Pw5budjN37ihuTMZvHhJ~7W~lKu~HPqkuiQFr8-SGs0WNvrLyC8pPPdXEAliDUJFLoEYqxwPbkZ0tgicLDuWmRyv1SBrYcYkv-oSIM4AkID-hSNelyw5OK23EIUMeWjFpM9LkHfz6JrlPu6LaQ__">
              </q-avatar>
              <q-avatar size="32px" class="avatar-overlap">
                <img src="https://s3-alpha-sig.figma.com/img/6681/9b78/606aa85d62ea6621249bbab802a3b6c3?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NBqOUgYA7ZAkAdER6TPWwdDcPvLHjijT8wy1n0YyDARJx9TS9mE9qgb5cFGaF836JC8vZA~Wnz4PVrr-jGnH1SOIZGVkMjvtxmyawC94-5vOZZ5Cztq~kHrmQFDuAi8Q36FeHcc8Jxlk~z8IxhPAuUD-Z0USNmNmcT0UD-NTYRD2zb2WUiuiK3x9pfU2FGvG9uk5Pw5budjN37ihuTMZvHhJ~7W~lKu~HPqkuiQFr8-SGs0WNvrLyC8pPPdXEAliDUJFLoEYqxwPbkZ0tgicLDuWmRyv1SBrYcYkv-oSIM4AkID-hSNelyw5OK23EIUMeWjFpM9LkHfz6JrlPu6LaQ__">
              </q-avatar>
              <q-avatar size="32px" class="avatar-overlap">
                <img src="https://s3-alpha-sig.figma.com/img/6681/9b78/606aa85d62ea6621249bbab802a3b6c3?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NBqOUgYA7ZAkAdER6TPWwdDcPvLHjijT8wy1n0YyDARJx9TS9mE9qgb5cFGaF836JC8vZA~Wnz4PVrr-jGnH1SOIZGVkMjvtxmyawC94-5vOZZ5Cztq~kHrmQFDuAi8Q36FeHcc8Jxlk~z8IxhPAuUD-Z0USNmNmcT0UD-NTYRD2zb2WUiuiK3x9pfU2FGvG9uk5Pw5budjN37ihuTMZvHhJ~7W~lKu~HPqkuiQFr8-SGs0WNvrLyC8pPPdXEAliDUJFLoEYqxwPbkZ0tgicLDuWmRyv1SBrYcYkv-oSIM4AkID-hSNelyw5OK23EIUMeWjFpM9LkHfz6JrlPu6LaQ__">
              </q-avatar>
            </div>
            <span class="text-weight-medium">{{ teamName }}</span>
          </div>
        </div>

        <div class="row items-center q-gutter-x-lg">
          <div class="text-right" style="width: 96px">
            <span class="text-weight-medium">${{ humanCost }}</span>
          </div>
          <div class="text-right" style="width: 96px">
            <span class="text-weight-medium">${{aiCost}}</span>
          </div>
          <div class="text-right" style="width: 96px">
            <q-chip
              dense
              class="bg-green-1 text-green-8"
              text-color="green-8"
            >
              -{{ savingsPercentage }}%
            </q-chip>
          </div>
        </div>
      </div>
    </template>

    <div class="q-pa-md">
      <slot></slot>
    </div>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { mdiHumanGreetingVariant } from '@quasar/extras/mdi-v6';
import { addImports } from 'nuxt/kit';
import { ref } from 'vue'

const isExpanded = ref(true)

const props = defineProps<{
  teamName: string,
  aiCost: number,
  humanCostRatio?:number
}>()

const humanCost = computed(()=>{
  if(!props.aiCost) return 0

  return props.aiCost * (props.humanCostRatio ||  3.8)
})

const savingsPercentage = computed(() => {
  if (humanCost.value === 0) return 0
  // Calculate how much less the AI cost is compared to human cost
  return Math.round(((humanCost.value - props.aiCost) / humanCost.value) * 100)
})
</script>

<style scoped>
.avatar-overlap {
  margin-right: -8px;
  border: 2px solid white;
  background-color: white;
}

.avatar-overlap:not(:first-child) {
  margin-left: -8px;
}

:deep(.q-expansion-item__container) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.q-item__section--side) {
  display: none;
}
</style>