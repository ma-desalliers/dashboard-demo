<template>
  <div class="q-pa-md row full-width q-col-gutter-md">
    <!-- First Card -->
    <div class="col-7" style="max-height:95vh; overflow: auto;">   
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-h6">Autonomous Agents ROI Calculator</div>
          <div class="text-subtitle2">Estimate your potential return on investment by allocating revenue to autonomous AI agents.</div>

          <div class="column q-col-gutter-md q-mt-md">
            <div class="col-12 col-sm-6">
              <div class="text-subtitle2 q-mb-sm">Annual Revenue</div>
              <div class="row items-center">
                <q-slider
                  v-model="revenue"
                  :min="500000"
                  :max="1000000000"
                  :step="500000"
                  class="col"
                  @update:model-value="setOptions()"
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
                  :max="20"
                  :step="0.5"
                  class="col"
                  @update:model-value="setOptions()"
                />
                <div class="q-ml-sm" style="min-width: 120px">
                  {{ investmentPercentage }}%
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
                 <!-- <div class="text-h6">{{ estimatedTasks.toLocaleString() }}</div>-->
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

          <div class="q-pt-md">
  <!-- Data Team -->
  <q-expansion-item
    label="Data Team"
    header-class="c-section-subtitle"
    :class="{ 'custom-expansion': true }"
    :style="{ '--expansion-bg-color': 'var(--main-gray)' }"
    :default-opened="true"
  >
    <template v-slot:header>
      <div class="row items-center justify-between q-gutter-sm full-width c-expansion-header-hover">
        <div class="row items-center">
          <span class="c-section-subtitle">Data Team</span>
        </div>
        <div class="row items-center">
          <div style="padding-right: 75px">
            <q-chip class="q-ml-sm" dense>300 Credits</q-chip>
          </div>
          <div class="row items-center q-gutter-x-sm">
            <q-avatar v-for="(member, index) in teamMembers" :key="index" size="28px"
              :class="index !== 0 ? 'overlap-left' : ''">
              <img :src="member.avatar" :alt="member.name">
              <q-tooltip>{{ member.name }}</q-tooltip>
            </q-avatar>
          </div>
        </div>
      </div>
    </template>

    <q-table :rows="dataTeamData" :columns="columns" row-key="deliverable" flat bordered :pagination="{rowsPerPage: 0}">
      <!-- ... table slot content remains the same ... -->
    </q-table>
  </q-expansion-item>

  <!-- Content Team -->
  <q-expansion-item
    label="Content Team"
    header-class="c-section-subtitle"
    :class="{ 'custom-expansion': true }"
    :style="{ '--expansion-bg-color': 'var(--main-gray)' }"
    :default-opened="true"
  >
    <template v-slot:header>
      <div class="row items-center justify-between q-gutter-sm full-width c-expansion-header-hover">
        <div class="row items-center">
          <span class="c-section-subtitle">Content Team</span>
        </div>
        <div class="row items-center">
          <div style="padding-right: 75px">
            <q-chip class="q-ml-sm" dense>375 Credits</q-chip>
          </div>
          <div class="row items-center q-gutter-x-sm">
            <q-avatar v-for="(member, index) in teamMembers" :key="index" size="28px"
              :class="index !== 0 ? 'overlap-left' : ''">
              <img :src="member.avatar" :alt="member.name">
              <q-tooltip>{{ member.name }}</q-tooltip>
            </q-avatar>
          </div>
        </div>
      </div>
    </template>

    <q-table :rows="contentTeamData" :columns="columns" row-key="deliverable" flat bordered :pagination="{rowsPerPage: 0}">
      <!-- ... table slot content remains the same ... -->
    </q-table>
  </q-expansion-item>

  <!-- SEO Team -->
  <q-expansion-item
    label="SEO Team"
    header-class="c-section-subtitle"
    :class="{ 'custom-expansion': true }"
    :style="{ '--expansion-bg-color': 'var(--main-gray)' }"
    :default-opened="true"
  >
    <template v-slot:header>
      <div class="row items-center justify-between q-gutter-sm full-width c-expansion-header-hover">
        <div class="row items-center">
          <span class="c-section-subtitle">SEO Team</span>
        </div>
        <div class="row items-center">
          <div style="padding-right: 75px">
            <q-chip class="q-ml-sm" dense>750 Credits</q-chip>
          </div>
          <div class="row items-center q-gutter-x-sm">
            <q-avatar v-for="(member, index) in teamMembers" :key="index" size="28px"
              :class="index !== 0 ? 'overlap-left' : ''">
              <img :src="member.avatar" :alt="member.name">
              <q-tooltip>{{ member.name }}</q-tooltip>
            </q-avatar>
          </div>
        </div>
      </div>
    </template>

    <q-table :rows="seoTeamData" :columns="columns" row-key="deliverable" flat bordered :pagination="{rowsPerPage: 0}">
      <!-- ... table slot content remains the same ... -->
    </q-table>
  </q-expansion-item>

  <!-- Monetization Team -->
  <q-expansion-item
    label="Monetization Team"
    header-class="c-section-subtitle"
    :class="{ 'custom-expansion': true }"
    :style="{ '--expansion-bg-color': 'var(--main-gray)' }"
    :default-opened="true"
  >
    <template v-slot:header>
      <div class="row items-center justify-between q-gutter-sm full-width c-expansion-header-hover">
        <div class="row items-center">
          <span class="c-section-subtitle">Monetization Team</span>
        </div>
        <div class="row items-center">
          <div style="padding-right: 75px">
            <q-chip class="q-ml-sm" dense>650 Credits</q-chip>
          </div>
          <div class="row items-center q-gutter-x-sm">
            <q-avatar v-for="(member, index) in teamMembers" :key="index" size="28px"
              :class="index !== 0 ? 'overlap-left' : ''">
              <img :src="member.avatar" :alt="member.name">
              <q-tooltip>{{ member.name }}</q-tooltip>
            </q-avatar>
          </div>
        </div>
      </div>
    </template>

    <q-table :rows="monetizationTeamData" :columns="columns" row-key="deliverable" flat bordered :pagination="{rowsPerPage: 0}">
      <!-- ... table slot content remains the same ... -->
    </q-table>
  </q-expansion-item>

  <!-- Email Marketing Team -->
  <q-expansion-item
    label="Email Marketing Team"
    header-class="c-section-subtitle"
    :class="{ 'custom-expansion': true }"
    :style="{ '--expansion-bg-color': 'var(--main-gray)' }"
    :default-opened="true"
  >
    <template v-slot:header>
      <div class="row items-center justify-between q-gutter-sm full-width c-expansion-header-hover">
        <div class="row items-center">
          <span class="c-section-subtitle">Email Marketing Team</span>
        </div>
        <div class="row items-center">
          <div style="padding-right: 75px">
            <q-chip class="q-ml-sm" dense>300 Credits</q-chip>
          </div>
          <div class="row items-center q-gutter-x-sm">
            <q-avatar v-for="(member, index) in teamMembers" :key="index" size="28px"
              :class="index !== 0 ? 'overlap-left' : ''">
              <img :src="member.avatar" :alt="member.name">
              <q-tooltip>{{ member.name }}</q-tooltip>
            </q-avatar>
          </div>
        </div>
      </div>
    </template>

    <q-table :rows="emailMarketingTeamData" :columns="columns" row-key="deliverable" flat bordered :pagination="{rowsPerPage: 0}">
      <!-- ... table slot content remains the same ... -->
    </q-table>
  </q-expansion-item>

  <!-- Social Media Team -->
  <q-expansion-item
    label="Social Media Team"
    header-class="c-section-subtitle"
    :class="{ 'custom-expansion': true }"
    :style="{ '--expansion-bg-color': 'var(--main-gray)' }"
    :default-opened="true"
  >
    <template v-slot:header>
      <div class="row items-center justify-between q-gutter-sm full-width c-expansion-header-hover">
        <div class="row items-center">
          <span class="c-section-subtitle">Social Media Team</span>
        </div>
        <div class="row items-center">
          <div style="padding-right: 75px">
            <q-chip class="q-ml-sm" dense>400 Credits</q-chip>
          </div>
          <div class="row items-center q-gutter-x-sm">
            <q-avatar v-for="(member, index) in teamMembers" :key="index" size="28px"
              :class="index !== 0 ? 'overlap-left' : ''">
              <img :src="member.avatar" :alt="member.name">
              <q-tooltip>{{ member.name }}</q-tooltip>
            </q-avatar>
          </div>
        </div>
      </div>
    </template>

    <q-table :rows="socialMediaTeamData" :columns="columns" row-key="deliverable" flat bordered :pagination="{rowsPerPage: 0}">
      <!-- ... table slot content remains the same ... -->
    </q-table>
  </q-expansion-item>
</div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-5">
      <q-card flat bordered>
        <q-card-section>
          <div id="chart"></div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import ApexCharts from 'apexcharts'

interface Task {
  name: string
  department: string
  team: string
  creditsPerTask: number
  tasks: string[]
}


const teamMembers = [
  { 
    name: 'John Doe', 
    avatar: 'https://s3-alpha-sig.figma.com/img/6681/9b78/606aa85d62ea6621249bbab802a3b6c3?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NBqOUgYA7ZAkAdER6TPWwdDcPvLHjijT8wy1n0YyDARJx9TS9mE9qgb5cFGaF836JC8vZA~Wnz4PVrr-jGnH1SOIZGVkMjvtxmyawC94-5vOZZ5Cztq~kHrmQFDuAi8Q36FeHcc8Jxlk~z8IxhPAuUD-Z0USNmNmcT0UD-NTYRD2zb2WUiuiK3x9pfU2FGvG9uk5Pw5budjN37ihuTMZvHhJ~7W~lKu~HPqkuiQFr8-SGs0WNvrLyC8pPPdXEAliDUJFLoEYqxwPbkZ0tgicLDuWmRyv1SBrYcYkv-oSIM4AkID-hSNelyw5OK23EIUMeWjFpM9LkHfz6JrlPu6LaQ__' 
  },
  { 
    name: 'Jane Smith', 
    avatar: 'https://s3-alpha-sig.figma.com/img/ca22/0be1/0900c3512764d10cb323649cee99e036?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=pUpWY0WYxPxqt1s9sRy80Ha4lCBY8erHWK26t9eQGcS~7Dhk21DpQB-~nlNniYhdzCoRSzRGZV0PkFkz8-yMZV1sP3JhzTo0wZp-ZFllJzhk4so1IGxVq1wLju3l5wZbUdw7ZA8QBvqJe0sc8BG56dbmL4-k17XMQTp6lbU6wwwGQ~dVypQb6NcFtEz0N4lFoR1dWFquJ90iSHssiiDJ3OVtvWTCkJrue1cdkL-upf7Jjr34tNMJsiNuWgsSCOqpSMXJIikg-ZARR1NoSoC494hSKqZijVQxORfBmdl3WbKNhhgXVbN2BE~jtEi4onuU-cQOoVhuXuHHaPq6D5uXKQ__' 
  },
  { 
    name: 'John Smith', 
    avatar: 'https://s3-alpha-sig.figma.com/img/cc65/eef8/a13492f5ddf5a8d78627e4b69abe8d9a?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=iS~F9tOgeJX75do25JMrjg7dSs8XJR8WRWPfpxV4wFFFkqWsdr2GSDx75P1Oh0OGru~o5qq5EeSCF9r-J1uOGSh~Lxf-aEY2q~XaBkX6WfIbaTFcOGt51FTIPPrij78zflDaytPEI4S3aXWFuMKW8vXalPVevhHVFxfWIG9J99gmtrPPuHMVnMDi7k2bJm-qpNm7LVzDnqk88R7Ae9cVHFiXxe5jV9FAFeU5leF4LZ54OiWg~xZR4wQGeP-Y17jSKwLqE6akGFIcSAt6BChGEoE-n8Oua6FOxOZMQ0PzfjH-I6OdGMTGPyVRTZjYrqHHOv~vwSvMbXbms-gkqrx00w__' 
  }
]

const columns = [
  { name: 'deliverable', label: 'Deliverable', field: 'deliverable', style: 'width: 575px', align: 'left' },
  { name: 'credits', label: 'Credits', field: 'credits', align: 'left' },
]

const dataTeamData = [
  { deliverable: 'Data suggestions', credits: 200 },
  { deliverable: 'Data scraping', credits: 100 },
  { deliverable: 'Market suggestion', credits: 100 },
  { deliverable: 'JTBD suggestions', credits: 100 }
]

const contentTeamData = [
  { deliverable: 'Branded Image', credits: 25 },
  { deliverable: 'Blog post suggestions', credits: 100 },
  { deliverable: 'Blog Post', credits: 250 }
]

const seoTeamData = [
  { deliverable: 'SEO Technical Audit', credits: 250 },
  { deliverable: 'SEO Keywords intent', credits: 250 },
  { deliverable: 'SEO-Optimized Webpage', credits: 250 }
]

const monetizationTeamData = [
  { deliverable: 'Lead magnet suggestions', credits: 100 },
  { deliverable: 'Lead magnet preview', credits: 50 },
  { deliverable: 'Lead magnet resource', credits: 500 },
  { deliverable: 'Form suggestions', credits: 50 }
]

const emailMarketingTeamData = [
  { deliverable: 'Nurturing email suggestions', credits: 50 },
  { deliverable: 'Nurturing email content', credits: 250 }
]

const socialMediaTeamData = [
  { deliverable: 'Social media post', credits: 25 },
  { deliverable: 'Social media post', credits: 25 },
  { deliverable: 'Social media calendar', credits: 100 },
  { deliverable: 'Social media schedules', credits: 250 }
]
const revenue = ref(500000)
const investmentPercentage = ref(0)
const chart = ref()

const options = reactive({
  chart: {
    type: 'bar'
  },
  series: [{
    name: 'sales',
    data: [30,40]
  }],
  xaxis: {
    categories: ['','']
  }
})
const remainingCredits = computed(() => availableCredits.value - 0 ) //totalCreditsUsed.value)
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


const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value)
}

const setOptions = () => {
  if (!chart.value) return

  chart.value.updateSeries([{
    data: [{
      x: 'Revenue',
      y: Math.round(revenue.value)
    }, {
      x: 'Investment',
      y: Math.round(investment.value)
    }, {
      x: 'Employee cost Approx.',
      y: Math.round(investment.value * 3.8)
    }]
  }])
}

onMounted(() => {
  const chartOptions = {
    chart: {
      type: 'bar'
    },
    series: [{
      name: 'sales',
      data: [revenue.value, investment.value]
    }],
    xaxis: {
      categories: ['Revenue', 'Investment', 'Employee cost Approx.']
    }
  }
  
  chart.value = new ApexCharts(document.querySelector("#chart"), chartOptions)
  chart.value.render()
})
</script>

<style scoped>
.q-slider { 
  min-width: 150px;
}

.overlap-left {
  margin-left: -12px;  /* Create overlapping effect */
}

/* Add hover effect to avatars */
.q-avatar {
  transition: transform 0.2s;
  border: 2px solid white;  /* Add border to separate overlapping avatars */
  background-color: white;
}

.q-avatar:hover {
  transform: translateY(-2px);
  z-index: 1;  /* Bring hovered avatar to front */
}

/* Custom tooltip styling */
:deep(.q-tooltip) {
  font-size: inherit;
  background: white;
  color: #000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
</style>