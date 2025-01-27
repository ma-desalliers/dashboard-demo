<template>
  <q-expansion-item
    v-model="isExpanded"
    :default-opened="true"
    expand-icon-class="hidden"
    header-class="q-pa-none"
    class="q-mb-md rounded-borders c-simple-border"
    :class="{'c-box-shadow': isExpanded}"
  >
    <!-- Header Section -->
    <template v-slot:header>
      <div class="row full-width items-center justify-between q-px-md q-py-sm">
        <!-- Left Section: Team Info -->
        <div class="row col-3 items-center q-gutter-x-md">
          <div class="column items-center q-gutter-x-sm">
            <span class="text-weight-medium">{{ teamName }}
              <q-btn
              flat
              round
              dense
              icon="info"
              size="xs"
              color="grey"
              @click="openAgentSidebar($event)"
            />
            </span>
            <div class="row">
              <q-avatar
                v-for="(member, index) in uniqueTeamMembers"
                :key="index"
                size="24px"
                class="avatar-overlap"
              >
                <img :src="`/avatars/${member?.AgentName?.toLowerCase()}.png`" />
              </q-avatar>
            </div>

          </div>
        </div>
        <div class="col-3">
          <span class="text-grey">{{ totalTasks }} tasks</span>
        </div>

        <!-- Middle Section: Financial Info -->
        <div class="row col-4 items-center justify-center q-gutter-x-lg">
          <div class="text-center">
            <div class="text-weight-medium">${{ totalHumanCost.toLocaleString() }}</div>
            <div class="text-grey text-caption">Avg salary : 85,000$</div>
          </div>
          
        </div>
       

        <!-- Right Section: Savings -->
        <div class="column col-2 items-center justify-end q-gutter-x-md">
          <div class="text-center">
            <div class="text-weight-medium">${{ totalAICost.toLocaleString() }}</div>
            <div class="text-grey text-caption"></div>
          </div>
          <div class="text-right text-positive">{{ savingsPercentage }}% savings</div>
        </div>
      </div>
    </template>

    <!-- Table Section -->
    <div class="q-pa-md c-grey-background">
      
      <q-table
        :rows="tableRows"
        :columns="columns"
        row-key="Name"
        flat
        class="c-grey-background"
        :pagination="{ rowsPerPage: 0 }"
      >
        <!-- Quantity Column -->
        <template #body-cell-quantity="props">
          <q-td :props="props">
            <q-select
              v-model="props.row.quantity"
              :options="[0,25, 50,100,200,500,1000,2000]"
              dense
              options-dense
              borderless
              emit-value
              map-options
              style="width: 80px"
              @update:model-value="handleQuantityChange(props.row, $event)"
            />
          </q-td>
        </template>

        <!-- Human Cost Column -->
        <template #body-cell-humanCost="props">
          <q-td :props="props">
            <div class="row justify-end q-gutter-x-sm">
            <span>${{ getHumanCost(props.row).toLocaleString() }}</span>
            <q-btn
              flat
              round
              dense
              icon="info"
              size="xs"
              color="grey"
              @click="showCostDialog(props.row)"
            />
          </div>

          </q-td>
        </template>

        <!-- AI Cost Column -->
        <template #body-cell-aiCost="props">
          <q-td :props="props">
          <span>${{  getAICost(props.row).toLocaleString() }} </span>
            <q-btn
              flat
              round
              dense
              icon="info"
              size="xs"
              color="grey"
              @click="showAICostDialog(props.row)"
            /></q-td>
        </template>

        <!-- Savings Column -->
        <template #body-cell-savings="props">
          <q-td :props="props" class="text-positive">
            -{{ calculateRowSavings(props.row) }}%
          </q-td>
        </template>
      </q-table>
    </div>
  </q-expansion-item>

  <CostDialog v-model="showDialog"
    :task-duration="humanCostDialog.taskDuration"
    :opportunity-cost="humanCostDialog.opportunitycost"
    :hourly-rate="humanCostDialog.hourRate">
  </CostDialog>
  <AiCostDialog v-model="showAIDialog" :ai-credit="currentAiCredit" :cost-per-credit="costPerCredit"></AiCostDialog>
  <SidePanel v-model="showSideBar" :title="'Agents'">
    <MarketingSideBar></MarketingSideBar>
  </SidePanel>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import CostDialog from './HumanCost.vue';
import AiCostDialog from "./AiCostDialog.vue";
import MarketingSideBar from "./MarketingSideBar.vue";

const costDialogRefs = ref<any>({});
interface TaskData {
  Name: string;
  AgentName: string;
  AgentRole: string;
  AgentTeam: string;
  Type: string;
  DurationMinutes: number;
  HumanCost: string;
  AICredits: number;
  quantity: number;
}

interface Props {
  teamName: string;
  tableData: TaskData[];
  costPerCredit: number;
}

const props = withDefaults(defineProps<Props>(), {
  teamName: "Team",
  tableData: () => [],
  costPerCredit: 0.25,
});

const emit = defineEmits(["update:tableData"]);
const isExpanded = ref(true);
const showDialog = ref(false)
const showAIDialog = ref(false)
const showSideBar = ref(false)
const currentAiCredit = ref()

const humanCostDialog = reactive({
  opportunitycost : 0,
  hourRate:0,
  taskDuration:0
})

// Table configuration
const columns = [
  {
    name: "Name",
    label: "Deliverable",
    field: "Name",
    align: "left",
  },
  {
    name: "quantity",
    label: "Quantity",
    field: "quantity",
    align: "left",
  },
  {
    name: "humanCost",
    label: "Human cost",
    field: "humanCost",
    align: "right",
  },
  {
    name: "aiCost",
    label: "AI cost",
    field: "aiCost",
    align: "right",
  },
  {
    name: "savings",
    label: "Savings",
    field: "savings",
    align: "right",
  },
];

// Updated computed properties
const tableRows = computed(() => {
  return props.tableData.map((row) => ({
    ...row
  }));
});

const uniqueTeamMembers = computed(() => {
  if (!props.tableData?.length) return [];
  return [...new Map(props.tableData.map((item) => [item.AgentName, item])).values()];
});

const totalTasks = computed(() => {
  return tableRows.value.reduce((sum, row) => {
    const tasksPerDeliverable = Math.round((row.quantity || 0));
    return sum + (row.quantity || 0);
  }, 0);
});

// Updated cost calculations
const getHumanCost = (row: TaskData): number => {
  const baseCost = parseFloat(row.HumanCost.replace(" $", ""));
  return Math.round(baseCost * (row.quantity || 0)); // Adjusted to match screenshot values
};

const getAICost = (row: TaskData): number => {
  return Math.round((row.AICredits * props.costPerCredit * (row.quantity || 0))); // Adjusted to match screenshot values
};

const totalHumanCost = computed(() => {
  return tableRows.value.reduce((sum, row) => {
    return sum + getHumanCost(row);
  }, 0);
});

const totalAICost = computed(() => {
  return tableRows.value.reduce((sum, row) => {
    return sum + getAICost(row);
  }, 0);
});

const savingsPercentage = computed(() => {
  if (totalHumanCost.value === 0) return 0;
  const savings =
    ((totalHumanCost.value - totalAICost.value) / totalHumanCost.value) * 100;
  return Math.round(savings);
});

const avgSalary = computed(() => {
  if (!props.tableData?.length) return 0;
  const firstRow = props.tableData[0];
  const hourlyRate =
    parseFloat(firstRow.HumanCost.replace(" $", "")) / (firstRow.DurationMinutes / 60);
  return Math.round(hourlyRate * 2080);
});

const calculateRowSavings = (row: TaskData): number => {
  const humanCost = getHumanCost(row);
  if (humanCost === 0) return 0;
  const aiCost = getAICost(row);
  return Math.round(((humanCost - aiCost) / humanCost) * 100);
};

// Handler remains the same
const handleQuantityChange = (row: TaskData, newValue: number) => {
  const updatedData = props.tableData.map((item) =>
    item.Name === row.Name ? { ...item, quantity: newValue } : item
  );
  emit("update:tableData", updatedData);
};



// Calculate hourly rate from human cost and duration
const getHourlyRate = (row:any) => {
  return parseFloat(row.HumanCost.replace(" $", "")) / (row.DurationMinutes / 60);
};

// Show the cost dialog for a specific row
const showCostDialog = (row:any) => {
  showDialog.value = true;
  const hourCost = parseFloat(row.HumanCost.replace(" $", "")) / (row.DurationMinutes / 60);
  humanCostDialog.taskDuration = row.DurationMinutes / 60;
  humanCostDialog.hourRate = hourCost * 0.33
  humanCostDialog.opportunitycost = hourCost * 0.67
};

const showAICostDialog = (row:any) =>{
  showAIDialog.value = true
  currentAiCredit.value = row.AICredits
}

const openAgentSidebar = (event:Event) =>{
  event.stopImmediatePropagation()
  event.preventDefault()
  showSideBar.value = true
}

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

:deep(.q-table th) {
  font-weight: 500;
}

:deep(.q-table tbody td) {
  font-size: 14px;
}

:deep(.q-field__control) {
  padding: 0 8px;
}
</style>
