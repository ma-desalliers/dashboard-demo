<template>
  <q-expansion-item
    v-model="isExpanded"
    :default-opened="true"
    expand-icon-class="hidden"
    header-class="q-pa-none"
  >
    <template v-slot:header>
      <div class="row full-width items-center justify-between q-px-md q-py-sm bg-grey-1">
        <div class="row col-6 items-center q-gutter-x-md">
          <q-icon
            :name="isExpanded ? 'expand_more' : 'expand_less'"
            size="24px"
            class="cursor-pointer"
          />
          <div class="row items-center q-gutter-x-sm">
            <div class="row">
              <q-avatar v-for="(member, index) in teamMembers" 
                       :key="index"
                       size="32px" 
                       class="avatar-overlap">
                <img :src="member.avatar">
              </q-avatar>
            </div>
            <span class="text-weight-medium">{{ teamName }}</span>
          </div>
        </div>
				<div class="row items-center q-gutter-x-lg">
          <div class="text-right" style="width: 96px">
            <span class="text-weight-medium">{{totalCredit}}</span>
          </div>
        </div>
        <div class="row items-center q-gutter-x-lg">
          <div class="text-right" style="width: 96px">
            <span class="text-weight-medium">${{ totalCost.toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </template>

    <div class="q-py-md">
      <q-table
        :rows="tableData"
        :columns="columns"
        row-key="deliverable"
        flat
        bordered
        :pagination="{ rowsPerPage: 0 }"
      >
        <template #body-cell-TaskCost="props">
          <q-td :props="props">
            <div class="text-weight-medium">
              ${{ calculateTaskCost(props.row.credits) }}
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface TableRow {
  deliverable: string
  credits: number
}

interface TeamMember {
  avatar: string
}

interface Props {
  teamName: string
  costPerCredit: number
  tableData: TableRow[]
  teamMembers?: TeamMember[]
}

const props = withDefaults(defineProps<Props>(), {
  teamMembers: () => [{
    avatar: 'https://s3-alpha-sig.figma.com/img/6681/9b78/606aa85d62ea6621249bbab802a3b6c3?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NBqOUgYA7ZAkAdER6TPWwdDcPvLHjijT8wy1n0YyDARJx9TS9mE9qgb5cFGaF836JC8vZA~Wnz4PVrr-jGnH1SOIZGVkMjvtxmyawC94-5vOZZ5Cztq~kHrmQFDuAi8Q36FeHcc8Jxlk~z8IxhPAuUD-Z0USNmNmcT0UD-NTYRD2zb2WUiuiK3x9pfU2FGvG9uk5Pw5budjN37ihuTMZvHhJ~7W~lKu~HPqkuiQFr8-SGs0WNvrLyC8pPPdXEAliDUJFLoEYqxwPbkZ0tgicLDuWmRyv1SBrYcYkv-oSIM4AkID-hSNelyw5OK23EIUMeWjFpM9LkHfz6JrlPu6LaQ__'
  }]
})

const isExpanded = ref(true)

const columns = [
  { name: 'deliverable', label: 'Deliverable', field: 'deliverable', style: 'width: 575px', align: 'left' },
  { name: 'credits', label: 'Credits', field: 'credits', align: 'left' },
  { name: 'TaskCost', label: 'Task Costs', field: 'credits', align: 'right'}
]

const calculateTaskCost = (credits: number) => {
  return (credits * props.costPerCredit).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const totalCost = computed(() => {
  return props.tableData.reduce((sum, row) => sum + (row.credits * props.costPerCredit), 0)
})

const totalCredit = computed(() => {
  return props.tableData.reduce((sum, row) => sum + row.credits, 0)
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