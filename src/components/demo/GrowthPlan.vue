<template>
  <div class="row full-width full-height">
    <div class="col-12 c-border-bottom" :class="{'c-bottom-shadow': isMobile}">
      <q-tabs
        v-model="listView"
        color="primary"
        :align="'left'"  
        active-color="primary"
        active-class="c-bg-primary-lighten"
        indicator-color="primary"
        :class="{'q-pl-md' : !isMobile}"
      >
        <q-tab disable name="Trends" label="Trends" class="q-mr-md" />
        <q-tab active name="Roadmap" label="Roadmap" class="q-mr-md" />
        <q-tab disable name="Ressources" label="Ressources" />
      </q-tabs>
    </div>
    <div class="col-12" style="height:calc(100% - 50px); overflow:auto">
      <div class="row q-col-gutter-md q-px-md q-pt-md ">
					<div class="col-4 ">
						<q-card flat bordered>
							<q-card-section>
								<div class="text-subtitle1">Payback period</div>
								<div class="text-h5 q-mt-sm">5 months</div>
								<div class="text-subtitle1">August 2026</div>
							</q-card-section>
						</q-card>
					</div>
					<div class="col-4">

						<q-card flat bordered>
							<q-card-section>
								<div class="text-subtitle1">Total savings</div>
								<div class="text-h5 q-mt-sm">$2.5M</div>
								<div class="text-positive">+1400% vs Human cost</div>
							</q-card-section>
						</q-card>
					</div>
					<div class="col-4">
						<q-card flat bordered>
							<q-card-section>
								<div class="text-subtitle1">Yearly savings</div>
								<div class="text-h5 q-mt-sm">$249K</div>
								<div class="text-positive">+1400% vs Human cost</div>
							</q-card-section>
						</q-card>
					</div>

				</div>

      <q-card bordered flat class="q-mx-md q-px-md q-mt-md q-pb-md">
        <q-card-section class="row justify-between items-end q-pb-none q-px-none">
          <q-select
            v-model="selectedChart"
            :options="chartOptions"
            dense
            borderless
            options-dense
            dropdown-icon="expand_more"
            :class="{'text-h6': !isMobile, 'text-subtitle1': isMobile}"
          />
          <CustomDateRange></CustomDateRange>
        </q-card-section>
        <savings v-if="selectedChart === 'Savings'"></savings>
        <Revenue v-if="selectedChart === 'Revenue'" :table-data="computedTableData"></Revenue>
      </q-card>
      <Stategies :table-data="computedTableData"
      :initial-selected="computedTableData"
        :editable="true"
        :show-hover-buttons="true"
        @update:selected="handleSelectionUpdate"
        @scenario-change="handleScenarioChange"
        @edit="handleEdit"
        @delete="handleDelete"></Stategies>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, type Reactive } from 'vue';
import { useMainDisplayStore } from '@/src/stores/mainDisplayStore'
import Savings from './atlasComponent/chart/Savings.vue';
import Stategies from './atlasComponent/Stategies.vue';
import Revenue from './atlasComponent/chart/Revenue.vue';
import CustomDateRange from './atlasComponent/CustomDateRange.vue';
// Reactive state
const mainDisplayStore = useMainDisplayStore()
const isMobile = computed(() => mainDisplayStore.isMobile)
const listView = ref('Roadmap')

// Chart selection
const selectedChart = ref('Savings')
const chartOptions = [
  'Savings',
  'Revenue',
  'LTV',
  'Customer'
]


const tableData = reactive([
  {
    name: 'SEO',
    icon: 'G',
    selected: true,
    irg: 9,
    color: '#4ADE80',
    selectedScenario: 'optimistic',
    startDate: '2025-01-15',
    scenarios: {
      optimistic: {
        y2025: 50000,
        y2026: 57500,
        y2027: 66125,
        y2028: 76044,
        y2029: 87450
      },
      realistic: {
        y2025: 42500,
        y2026: 46750,
        y2027: 51425,
        y2028: 56568,
        y2029: 62224
      },
      pessimistic: {
        y2025: 35000,
        y2026: 36750,
        y2027: 38588,
        y2028: 40517,
        y2029: 42543
      }
    }
  },
  {
    name: 'Google Ads',
    icon: 'A',
    color: '#86EFAC',
    selected: true,
    irg: 8,
    selectedScenario: 'optimistic',
    startDate: '2025-01-15',
    scenarios: {
      optimistic: {
        y2025: 50000,
        y2026: 57500,
        y2027: 66125,
        y2028: 76044,
        y2029: 87450
      },
      realistic: {
        y2025: 42500,
        y2026: 46750,
        y2027: 51425,
        y2028: 56568,
        y2029: 62224
      },
      pessimistic: {
        y2025: 35000,
        y2026: 36750,
        y2027: 38588,
        y2028: 40517,
        y2029: 42543
      }
    }
  },
  {
    name: 'Lead nurturing',
    icon: 'profile',
    color: '#BBF7D0',
    selected: true,
    irg: 8,
    selectedScenario: 'optimistic',
    startDate: '2025-01-15',
    scenarios: {
      optimistic: {
        y2025: 25000,
        y2026: 28750,
        y2027: 33063,
        y2028: 38022,
        y2029: 43725
      },
      realistic: {
        y2025: 21250,
        y2026: 23375,
        y2027: 25713,
        y2028: 28284,
        y2029: 31112
      },
      pessimistic: {
        y2025: 17500,
        y2026: 18375,
        y2027: 19294,
        y2028: 20259,
        y2029: 21272
      }
    }
  },
  {
    name: 'Lead revival',
    icon: 'profile',
    color: '#34D399',
    selected: true,
    irg: 8,
    selectedScenario: 'optimistic',
    startDate: '2025-01-15',
    scenarios: {
      optimistic: {
        y2025: 25000,
        y2026: 28750,
        y2027: 33063,
        y2028: 38022,
        y2029: 43725
      },
      realistic: {
        y2025: 21250,
        y2026: 23375,
        y2027: 25713,
        y2028: 28284,
        y2029: 31112
      },
      pessimistic: {
        y2025: 17500,
        y2026: 18375,
        y2027: 19294,
        y2028: 20259,
        y2029: 21272
      }
    }
  },
  {
    name: 'Cold emailing',
    icon: 'profile',
    color: '#6EE7B7',
    selected: true,
    irg: 8,
    selectedScenario: 'optimistic',
    startDate: '2025-01-15',
    scenarios: {
      optimistic: {
        y2025: 25000,
        y2026: 28750,
        y2027: 33063,
        y2028: 38022,
        y2029: 43725
      },
      realistic: {
        y2025: 21250,
        y2026: 23375,
        y2027: 25713,
        y2028: 28284,
        y2029: 31112
      },
      pessimistic: {
        y2025: 17500,
        y2026: 18375,
        y2027: 19294,
        y2028: 20259,
        y2029: 21272
      }
    }
  },
  {
    name: 'Lead research',
    icon: 'profile',
    color: '#A7F3D0',
    selected: true,
    irg: 8,
    selectedScenario: 'optimistic',
    startDate: '2025-01-15',
    scenarios: {
      optimistic: {
        y2025: 25000,
        y2026: 28750,
        y2027: 33063,
        y2028: 38022,
        y2029: 43725
      },
      realistic: {
        y2025: 21250,
        y2026: 23375,
        y2027: 25713,
        y2028: 28284,
        y2029: 31112
      },
      pessimistic: {
        y2025: 17500,
        y2026: 18375,
        y2027: 19294,
        y2028: 20259,
        y2029: 21272
      }
    }
  },
  {
    name: 'Lead qualification',
    icon: 'profile',
    color: '#D1FAE5',
    selected: true,
    irg: 8,
    selectedScenario: 'optimistic',
    startDate: '2025-01-15',
    scenarios: {
      optimistic: {
        y2025: 25000,
        y2026: 28750,
        y2027: 33063,
        y2028: 38022,
        y2029: 43725
      },
      realistic: {
        y2025: 21250,
        y2026: 23375,
        y2027: 25713,
        y2028: 28284,
        y2029: 31112
      },
      pessimistic: {
        y2025: 17500,
        y2026: 18375,
        y2027: 19294,
        y2028: 20259,
        y2029: 21272
      }
    }
  }
])

const computedTableData = computed(() => {
  return tableData.map((item:any) => {
    // Get the current selected scenario values
    const scenarioValues:any = item.scenarios[item.selectedScenario]

    return {
      ...item, // Spread all original item properties
      // Add computed values for each year based on selected scenario
      y2025: scenarioValues.y2025,
      y2026: scenarioValues.y2026,
      y2027: scenarioValues.y2027,
      y2028: scenarioValues.y2028,
      y2029: scenarioValues.y2029,
      // You can add additional computed properties here if needed
      total: Object.values(scenarioValues).reduce((sum:any, val:any) => sum + val, 0),
      averagePerYear: Object.values(scenarioValues).reduce((sum:any, val:any) => sum + val, 0) / 5,
      // Keep original data available if needed
      originalScenarios: item.scenarios
    }
  })
})

const handleSelectionUpdate = (newSelection:any) => {
  tableData.forEach((data:any) => {
    if(newSelection.find((selection : any) => selection.name == data.name )){
      data.selected = true;
      return 
    }
    data.selected = false
  })
}

const handleScenarioChange = (strategy: any, newScenario: string) => {
  // Handle scenario change
  console.log(`Strategy ${strategy.name} scenario changed to ${newScenario}`)
  const value =  tableData.find((data:any) => data.name == strategy.name)
  if(value) value.selectedScenario = newScenario
}

const handleEdit = (strategy:any) => {
  // Handle edit action
  console.log(`Edit strategy ${strategy.name}`)
}

const handleDelete = (strategy:any) => {
  // Handle delete action
  console.log(`Delete strategy ${strategy.name}`)
}

</script>

<style lang="scss" scoped>
.c-content-marketing {

	&.isMobile{
		height:calc(100% - 50px);
	}
	.content-list {
		border: 0px solid #e0e0e0;
		// border-radius: 4px;
		background: white;
	}
	
	.header-row {
		background: #f8f9fa;
		min-height: 40px;
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
	}
	
	.content-item {
		min-height: 72px;
		
		&:hover {
			background: #f8f9fa;
		}
	}
	
	.content-info {
		.text-subtitle2 {
			font-weight: 500;
			line-height: 1.2;
		}
		
		.text-caption {
			margin-top: 4px;
		}
	}
	
	.q-item {
		padding: 8px 16px;
	}
}

.c-page-detail-container{  
	//overflow-x:hidden;
	transition: 0.25s;
}

.pages-container{
	height:calc(100% - 30px);
	min-height: calc(100% - 30px);
	position: relative;

	.page-scroll{
		position:absolute;
		top:8px;
		left:0;
		right:0;
		bottom:0;
		overflow-y: auto;
	}
}

.no-border-select {
  :deep(.q-field__control) {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;

    &::before {  /* Changed from :before to ::before for consistency */
      display: none !important;
    }
  }
  
  :deep(.q-field__marginal) {
    color: inherit;
  }
}


.c-bottom-shadow{
	box-shadow: 1px 1px 5px #e0e0e0;
}
</style>