<template>
  <div class="q-pa-md">
    <!-- First Card -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Autonomous Agents ROI Calculator</div>
        <div class="text-subtitle2">Estimate your potential return on investment by allocating revenue to autonomous AI agents.</div>

        <div class="row q-col-gutter-md q-mt-md">
          <div class="col-12 col-sm-6">
            <div class="text-subtitle2 q-mb-sm">Annual Revenue</div>
            <div class="row items-center">
              <q-slider
                v-model="revenue"
                :min="500000"
                :max="1000000000"
                :step="500000"
                class="col"
              />
              <div class="q-ml-sm" style="min-width: 120px">
                {{ formatCurrency(revenue) }}
              </div>
            </div>
          </div>
          <div class="col-12 col-sm-6">
            <div class="text-subtitle2 q-mb-sm">Investment Percentage</div>
            <div class="row items-center">
              <q-slider
                v-model="investmentPercentage"
                :min="0"
                :max="10"
                :step="0.5"
                class="col"
              />
              <div class="q-ml-sm" style="min-width: 120px">
                {{ formatCurrency(investment) }}
              </div>
            </div>
          </div>
        </div>

        <div class="row q-col-gutter-md q-mt-lg">
          <div class="col-12 col-sm-4">
            <q-card flat class="bg-grey-1">
              <q-card-section class="text-center">
                <div class="text-h6">{{ formatCurrency(investment) }}</div>
                <div class="text-subtitle2">AI Investment</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-4">
            <q-card flat class="bg-grey-1">
              <q-card-section class="text-center">
                <div class="text-h6">${{ costPerCredit.toFixed(3) }}</div>
                <div class="text-subtitle2">Cost per Credit</div>
                <q-badge color="green" class="q-mt-sm">
                  {{ savings }}% savings
                </q-badge>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-4">
            <q-card flat class="bg-grey-1">
              <q-card-section class="text-center">
                <div class="text-h6">{{ estimatedTasks.toLocaleString() }}</div>
                <div class="text-subtitle2">Estimated Monthly Tasks</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Second Card -->
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">Task Opportunities</div>
        <div class="text-h5 text-green q-mt-md">
          Credits Available: {{ remainingCredits.toLocaleString() }}
        </div>

        <div class="row q-col-gutter-md q-mt-md">
          <div v-for="task in tasks" :key="task.name" class="col-12 col-sm-4">
            <q-input
              v-model.number="taskCounts[task.name]"
              type="number"
              outlined
              dense
              :label="task.name + ' Count'"
              :min="0"
              :max="Math.floor(availableCredits / task.creditsPerTask)"
              @update:model-value="updateTaskCounts"
            />
          </div>
        </div>

        <q-table
          :rows="tableData"
          :columns="columns"
          row-key="name"
          flat
          bordered
          class="q-mt-md"
        >
          <template v-slot:bottom>
            <q-tr>
              <q-td colspan="3" class="text-weight-bold">Total Credits Used:</q-td>
              <q-td>{{ totalCreditsUsed }}</q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Task {
  name: string
  creditsPerTask: number
  subtasks: string[]
}

const tasks: Task[] = [
  {
    name: "Task A",
    creditsPerTask: 100,
    subtasks: ["Scrape relevant web pages", "Identify product attributes", "Flag missing info"]
  },
  {
    name: "Task B",
    creditsPerTask: 200,
    subtasks: ["Propose content topics", "Prioritize content", "Generate drafts"]
  },
  {
    name: "Task C",
    creditsPerTask: 50,
    subtasks: ["Classify company", "Identify products", "Update knowledge base"]
  }
]

const columns = [
  { name: 'name', label: 'Task Name', field: 'name', align: 'left' },
  { name: 'count', label: 'Number of Tasks', field: 'count', align: 'left' },
  { name: 'creditsPerTask', label: 'Credits per Task', field: 'creditsPerTask', align: 'left' },
  { name: 'totalCredits', label: 'Total Credits', field: 'totalCredits', align: 'left' }
]

const revenue = ref(500000)
const investmentPercentage = ref(0)
const taskCounts = ref<Record<string, number>>({
  'Task A': 0,
  'Task B': 0,
  'Task C': 0
})

const investment = computed(() => revenue.value * (investmentPercentage.value / 100))

const { costPerCredit, savings } = computed(() => {
  const inv = investment.value
  if (inv >= 1000000) return { costPerCredit: 0.025, savings: 75 }
  if (inv >= 750000) return { costPerCredit: 0.035, savings: 65 }
  if (inv >= 500000) return { costPerCredit: 0.045, savings: 55 }
  if (inv >= 300000) return { costPerCredit: 0.055, savings: 45 }
  if (inv >= 200000) return { costPerCredit: 0.065, savings: 35 }
  if (inv >= 150000) return { costPerCredit: 0.070, savings: 30 }
  if (inv >= 100000) return { costPerCredit: 0.080, savings: 20 }
  if (inv >= 75000) return { costPerCredit: 0.085, savings: 15 }
  if (inv >= 50000) return { costPerCredit: 0.090, savings: 10 }
  return { costPerCredit: 0.10, savings: 0 }
}).value

const availableCredits = computed(() => Math.floor(investment.value / costPerCredit))

const avgCreditsPerTask = computed(() => 
  tasks.reduce((acc, task) => acc + task.creditsPerTask, 0) / tasks.length
)

const estimatedTasks = computed(() => 
  Math.floor(availableCredits.value / avgCreditsPerTask.value)
)

const totalCreditsUsed = computed(() => {
  return tasks.reduce((total, task) => {
    return total + (taskCounts.value[task.name] || 0) * task.creditsPerTask
  }, 0)
})

const remainingCredits = computed(() => availableCredits.value - totalCreditsUsed.value)

const tableData = computed(() => 
  tasks.map(task => ({
    name: task.name,
    count: taskCounts.value[task.name] || 0,
    creditsPerTask: task.creditsPerTask,
    totalCredits: (taskCounts.value[task.name] || 0) * task.creditsPerTask
  }))
)

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value)
}

const updateTaskCounts = () => {
  // Ensure task counts don't exceed maximum allowed by available credits
  tasks.forEach(task => {
    const maxTasks = Math.floor(availableCredits.value / task.creditsPerTask)
    if ((taskCounts.value[task.name] || 0) > maxTasks) {
      taskCounts.value[task.name] = maxTasks
    }
  })
}
</script>

<style scoped>
.q-slider { 
  min-width: 150px;
}
</style>