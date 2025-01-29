<template>
  <div class="full-width" >
    <div class="col-12" style="height:calc(100vh - 50px); overflow:auto">
      <!--<div class="row q-col-gutter-md q-px-md q-pt-md ">
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

				</div>-->

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
      :initial-selected="selectedTableData"
        :editable="true"
        :show-hover-buttons="true"
        @update-selected="handleSelectionUpdate"
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
const selectedChart = ref('Revenue')
const chartOptions = [
  'Revenue',
  'Savings',
  'LTV',
  'Customer'
]

const tableData = reactive( [
  {
    name: 'Search Engine Optimization (SEO)',
    icon: 'G',
    selected: true,
    irg: 9,
    color: '#4ADE80',
    selectedScenario: 'optimistic',
    startDate: '2025-01-15',
    scenarios: {
      optimistic: {
        y2025: 35000,
        y2026: 80000,
        y2027: 175000,
        y2028: 350000,
        y2029: 700000
      },
      realistic: {
        y2025: 29750,
        y2026: 68000,
        y2027: 148750,
        y2028: 297500,
        y2029: 595000
      },
      pessimistic: {
        y2025: 24500,
        y2026: 56000,
        y2027: 122500,
        y2028: 245000,
        y2029: 490000
      }
    }
  },
  {
    name: 'Pay per click (PPC)',
    icon: 'A',
    color: '#86EFAC',
    selected: true,
    irg: 8,
    selectedScenario: 'optimistic',
    startDate: '2025-01-15',
    scenarios: {
      optimistic: {
        y2025: 35000,
        y2026: 80000,
        y2027: 175000,
        y2028: 350000,
        y2029: 700000
      },
      realistic: {
        y2025: 29750,
        y2026: 68000,
        y2027: 148750,
        y2028: 297500,
        y2029: 595000
      },
      pessimistic: {
        y2025: 24500,
        y2026: 56000,
        y2027: 122500,
        y2028: 245000,
        y2029: 490000
      }
    }
  },
  {
    name: 'Lead nurturing',
    icon: 'profile',
    color: '#BBF7D0',
    selected: false,
    irg: 8,
    selectedScenario: 'optimistic',
    startDate: '2025-01-15',
    scenarios: {
      optimistic: {
        y2025: 20000,
        y2026: 45000,
        y2027: 98000,
        y2028: 196000,
        y2029: 392000
      },
      realistic: {
        y2025: 17000,
        y2026: 38250,
        y2027: 83300,
        y2028: 166600,
        y2029: 333200
      },
      pessimistic: {
        y2025: 14000,
        y2026: 31500,
        y2027: 68600,
        y2028: 137200,
        y2029: 274400
      }
    }
  },
  {
    name: 'Lead revival',
    icon: 'profile',
    color: '#34D399',
    selected: false,
    irg: 8,
    selectedScenario: 'optimistic',
    startDate: '2025-01-15',
    scenarios: {
      optimistic: {
        y2025: 20000,
        y2026: 45000,
        y2027: 98000,
        y2028: 196000,
        y2029: 392000
      },
      realistic: {
        y2025: 17000,
        y2026: 38250,
        y2027: 83300,
        y2028: 166600,
        y2029: 333200
      },
      pessimistic: {
        y2025: 14000,
        y2026: 31500,
        y2027: 68600,
        y2028: 137200,
        y2029: 274400
      }
    }
  },
  {
    name: 'Lead research',
    icon: 'profile',
    color: '#A7F3D0',
    selected: false,
    irg: 8,
    selectedScenario: 'optimistic',
    startDate: '2025-01-15',
    scenarios: {
      optimistic: {
        y2025: 15000,
        y2026: 34000,
        y2027: 74000,
        y2028: 148000,
        y2029: 296000
      },
      realistic: {
        y2025: 12750,
        y2026: 28900,
        y2027: 62900,
        y2028: 125800,
        y2029: 251600
      },
      pessimistic: {
        y2025: 10500,
        y2026: 23800,
        y2027: 51800,
        y2028: 103600,
        y2029: 207200
      }
    }
  },
  {
    name: 'Lead qualification',
    icon: 'profile',
    color: '#D1FAE5',
    selected: false,
    irg: 8,
    selectedScenario: 'optimistic',
    startDate: '2025-01-15',
    scenarios: {
      optimistic: {
        y2025: 15000,
        y2026: 34000,
        y2027: 74000,
        y2028: 148000,
        y2029: 296000
      },
      realistic: {
        y2025: 12750,
        y2026: 28900,
        y2027: 62900,
        y2028: 125800,
        y2029: 251600
      },
      pessimistic: {
        y2025: 10500,
        y2026: 23800,
        y2027: 51800,
        y2028: 103600,
        y2029: 207200
      }
    }
  },
  {
    name: 'Client nurturing',
    icon: 'profile',
    color: '#6EE7B7',
    selected: false,
    irg: 8,
    selectedScenario: 'optimistic',
    startDate: '2025-01-15',
    scenarios: {
      optimistic: {
        y2025: 15000,
        y2026: 34000,
        y2027: 74000,
        y2028: 148000,
        y2029: 296000
      },
      realistic: {
        y2025: 12750,
        y2026: 28900,
        y2027: 62900,
        y2028: 125800,
        y2029: 251600
      },
      pessimistic: {
        y2025: 10500,
        y2026: 23800,
        y2027: 51800,
        y2028: 103600,
        y2029: 207200
      }
    }
  },
  {
    name: 'Cold emailing',
    icon: 'profile',
    color: '#6EE7B7',
    selected: false,
    irg: 7,
    selectedScenario: 'optimistic',
    startDate: '2025-01-15',
    scenarios: {
      optimistic: {
        y2025: 10000,
        y2026: 22000,
        y2027: 48000,
        y2028: 96000,
        y2029: 192000
      },
      realistic: {
        y2025: 8500,
        y2026: 18700,
        y2027: 40800,
        y2028: 81600,
        y2029: 163200
      },
      pessimistic: {
        y2025: 7000,
        y2026: 15400,
        y2027: 33600,
        y2028: 67200,
        y2029: 134400
      }
    }
  }
]);

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

const selectedTableData = computed(()=>{
  return computedTableData.value.filter(data=> data.selected)
})

const handleSelectionUpdate = (newSelection:any) => {
  console.log(newSelection)
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