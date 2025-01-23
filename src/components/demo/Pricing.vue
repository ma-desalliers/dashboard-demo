<template>
	<div class="q-pa-md row full-width q-col-gutter-md">
		<!-- First Card -->
		<div class="col-5">
			<q-card flat bordered class="q-mb-md calculator-card">
				<q-card-section>
					<div class="text-h6">Autonomous Agents ROI Calculator</div>
					<div class="text-subtitle2">Estimate your potential return on investment by allocating revenue to autonomous
						AI agents.</div>
					<div class="column q-col-gutter-md q-mt-md">
						<div class="col-12">
							<div class="text-subtitle2 q-mb-sm">Annual Revenue</div>
							<div class="row items-center">
								<q-btn dense round outline icon="remove" text-color="primary" size="sm" @click="adjustRevenue(-500000)"
									:disable="revenue <= 1000000" />
								<q-slider v-model="revenue" :min="1000000" :max="1000000000" :step="500000" class="col q-mx-sm" />
								<q-btn dense round outline icon="add" text-color="primary" size="sm" @click="adjustRevenue(500000)"
									:disable="revenue >= 1000000000" />
								<div class="q-ml-sm" style="min-width: 120px">
									{{ formatCurrency(revenue) }}
								</div>
							</div>
						</div>
						<div class="col-12">
							<div class="text-subtitle2 q-mb-sm">AI Investment</div>
							<div class="row items-center">
								<q-btn dense outline round icon="remove" color="primary" size="sm" @click="adjustInvestment(-50000)"
									:disable="investment <= 100000" />
								<q-slider v-model="investment" :min="100000" :max="10000000" :step="50000" class="col q-mx-sm" />
								<q-btn dense outline round icon="add" color="primary" size="sm" @click="adjustInvestment(50000)"
									:disable="investment >= 10000000" />
								<div class="q-ml-sm" style="min-width: 120px">
									{{ formatCurrency(investment) }}
								</div>
							</div>
						</div>
					</div>

					<div class="column q-col-gutter-md q-mt-lg">
						<div class="col-12 col-sm-4">
							<q-card flat class="bg-grey-1">
								<q-card-section class="text-center">
									<div class="text-h6">{{ investmentPercentage }}%</div>
									<div class="text-subtitle2">AI Investment</div>

								</q-card-section>
							</q-card>
						</div>
						<div class="col-12 col-sm-4">
							<q-card flat class="bg-grey-1">
								<q-card-section class="text-center">
									<div class="text-h6">${{ costPerCredit.toFixed(4) }}</div>
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
									<div class="text-subtitle2">Estimated Total Tasks</div>
								</q-card-section>
							</q-card>
						</div>
					</div>
				</q-card-section>
			</q-card>
		</div>

		<div class="col-7 q-col-gutter-d">
	<!--	<q-card flat bordered>
				<q-card-section class="row">
					<div id="chart" class="col-6"></div>
					<div id="chart2" class="col-6"></div>
				</q-card-section>
			</q-card>-->

			<!-- Second Card -->
			<q-card flat bordered>
				<q-card-section>
					<div class="text-h6">Task Opportunities</div>
					<div class="text-h5 text-green q-mt-md">
						Credits Available: {{ remainingCredits.toLocaleString() }}
					</div>

					<div class="q-pt-md">
						<div v-for="team in teams">
						<PricingExpansionItem :team-name="team.name" :table-data="team.table" :ai-cost="300"
							:cost-per-credit="costPerCredit">
						</PricingExpansionItem>
					</div>
					</div>
				</q-card-section>
			</q-card>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import ApexCharts from 'apexcharts'
import PricingExpansionItem from './usedComponent/PricingExpansionItem.vue';
import company from '~/src/repository/client'; 


const teams = [{
	name: 'marketing', table:  [
      {
        "Name": "Service page",
        "AgentName": "Laura",
        "AgentRole": "Content creator",
        "AgentTeam": "Marketing",
        "Type": "Page",
        "DurationMinutes": 480,
        "HumanCost": "800 $",
        "AICredits": 1000
      },
      {
        "Name": "Blog category",
        "AgentName": "Laura",
        "AgentRole": "Content creator",
        "AgentTeam": "Marketing",
        "Type": "Page",
        "DurationMinutes": 480,
        "HumanCost": "800 $",
        "AICredits": 1000
      },
      {
        "Name": "Product Hub",
        "AgentName": "Laura",
        "AgentRole": "Content creator",
        "AgentTeam": "Marketing",
        "Type": "Page",
        "DurationMinutes": 480,
        "HumanCost": "800 $",
        "AICredits": 1000
      },
      {
        "Name": "Blog Hub",
        "AgentName": "Laura",
        "AgentRole": "Content creator",
        "AgentTeam": "Marketing",
        "Type": "Page",
        "DurationMinutes": 480,
        "HumanCost": "800 $",
        "AICredits": 1000
      },
      {
        "Name": "Blog post",
        "AgentName": "Laura",
        "AgentRole": "Content creator",
        "AgentTeam": "Marketing",
        "Type": "Page",
        "DurationMinutes": 480,
        "HumanCost": "1080 $",
        "AICredits": 1500
      },
      {
        "Name": "Calculator",
        "AgentName": "Laura",
        "AgentRole": "Content creator",
        "AgentTeam": "Marketing",
        "Type": "Lead Magnet",
        "DurationMinutes": 1920,
        "HumanCost": "3200 $",
        "AICredits": 5000
      },
      {
        "Name": "Ebook",
        "AgentName": "Laura",
        "AgentRole": "Content creator",
        "AgentTeam": "Marketing",
        "Type": "Lead Magnet",
        "DurationMinutes": 480,
        "HumanCost": "800 $",
        "AICredits": 1000
      },
      {
        "Name": "Checklist",
        "AgentName": "Laura",
        "AgentRole": "Content creator",
        "AgentTeam": "Marketing",
        "Type": "Lead Magnet",
        "DurationMinutes": 480,
        "HumanCost": "800 $",
        "AICredits": 1000
      },
      {
        "Name": "Newsletter",
        "AgentName": "Laura",
        "AgentRole": "Content creator",
        "AgentTeam": "Marketing",
        "Type": "Email",
        "DurationMinutes": 240,
        "HumanCost": "400 $",
        "AICredits": 250
      },
      {
        "Name": "Social post",
        "AgentName": "Laura",
        "AgentRole": "Content creator",
        "AgentTeam": "Marketing",
        "Type": "Post",
        "DurationMinutes": 120,
        "HumanCost": "200 $",
        "AICredits": 100
      },
      {
        "Name": "Cold outreach",
        "AgentName": "Noah",
        "AgentRole": "SDR",
        "AgentTeam": "Sales",
        "Type": "Email",
        "DurationMinutes": 60,
        "HumanCost": "100 $",
        "AICredits": 20
      },
      {
        "Name": "Smart reply",
        "AgentName": "Noah",
        "AgentRole": "SDR",
        "AgentTeam": "Sales",
        "Type": "Email",
        "DurationMinutes": 15,
        "HumanCost": "25 $",
        "AICredits": 5
      },
      {
        "Name": "Qualification call",
        "AgentName": "Noah",
        "AgentRole": "SDR",
        "AgentTeam": "Sales",
        "Type": "Call",
        "DurationMinutes": 30,
        "HumanCost": "50 $",
        "AICredits": 100
      },
      {
        "Name": "Follow-up call",
        "AgentName": "Noah",
        "AgentRole": "SDR",
        "AgentTeam": "Sales",
        "Type": "Call",
        "DurationMinutes": 30,
        "HumanCost": "50 $",
        "AICredits": 100
      },
      {
        "Name": "Email response",
        "AgentName": "Stella",
        "AgentRole": "Customer Success (CS)",
        "AgentTeam": "Support",
        "Type": "Email",
        "DurationMinutes": 15,
        "HumanCost": "25 $",
        "AICredits": 5
      },
      {
        "Name": "Email follow-up",
        "AgentName": "Stella",
        "AgentRole": "Customer Success (CS)",
        "AgentTeam": "Support",
        "Type": "Email",
        "DurationMinutes": 15,
        "HumanCost": "25 $",
        "AICredits": 5
      },
      {
        "Name": "Follow-up call",
        "AgentName": "Stella",
        "AgentRole": "Customer Success (CS)",
        "AgentTeam": "Support",
        "Type": "Call",
        "DurationMinutes": 50,
        "HumanCost": "83 $",
        "AICredits": 250
      }
    ]}]/*, { name : 'Content Team', table: [
	{ deliverable: 'Branded Image', credits: 250 },
	{ deliverable: 'Blog post suggestions', credits: 1000 },
	{ deliverable: 'Blog Post', credits: 2500 }
	]}, { name : 'Seo Team', table: [
	{ deliverable: 'SEO Technical Audit', credits: 2500 },
	{ deliverable: 'SEO Keywords intent', credits: 2500 },
	{ deliverable: 'SEO-Optimized Webpage', credits: 2500 }
	]}, { name : 'Monetization Team', table: [
	{ deliverable: 'Lead magnet suggestions', credits: 1000 },
	{ deliverable: 'Lead magnet preview', credits: 500 },
	{ deliverable: 'Lead magnet resource', credits: 5000 },
	{ deliverable: 'Form suggestions', credits: 500 }
	]}, { name : 'Email Marketing Team', table: [
	{ deliverable: 'Nurturing email suggestions', credits: 500 },
	{ deliverable: 'Nurturing email content', credits: 2500 }	
	]}, { name : 'Social Media Team', table: [
	{ deliverable: 'Social media post', credits: 250 },
	{ deliverable: 'Social media post', credits: 250 },
	{ deliverable: 'Social media calendar', credits: 1000 },
	{ deliverable: 'Social media schedules', credits: 2500 }
	]}
	]*/
	
	const revenue = ref(1000000)
	const investment = ref(100000)
	
	const costChart = ref()
	
	const chart2 = ref()
	
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
	
	
	// To this:
	const creditCalculation = computed(() => {
		const baseCredit = 0.01
		const inv = investment.value
		if (inv >= 1000000) return { costPerCredit: baseCredit * 0.05, savings: 95 }
		if (inv >= 750000) return { costPerCredit: baseCredit * 0.15, savings: 85 }
		if (inv >= 500000) return { costPerCredit: baseCredit * 0.25, savings: 75 }
		if (inv >= 300000) return { costPerCredit: baseCredit * 0.35, savings: 65 }
		if (inv >= 200000) return { costPerCredit: baseCredit * 0.45, savings: 55 }
		if (inv >= 150000) return { costPerCredit: baseCredit * 0.55, savings: 45 }
		if (inv >= 100000) return { costPerCredit: baseCredit * 0.75, savings: 25 }
		return { costPerCredit: baseCredit * 0.75, savings: 25 }
	})
	
	const savingsCurveData = computed(() => {
		const investmentLevels = [100000, 150000, 200000, 300000, 500000, 750000, 1000000];
		return investmentLevels.map(inv => ({
			x: inv,
			y: inv >= 1000000 ? 95 :
			inv >= 750000 ? 85 :
			inv >= 500000 ? 75 :
			inv >= 300000 ? 65 :
			inv >= 200000 ? 55 :
			inv >= 150000 ? 45 :
			inv >= 100000 ? 25 : 25
		}));
	});
	
	const investmentPercentage = computed(() => {
		if (!revenue.value) return 0
		return ((investment.value / revenue.value) * 100).toFixed(1)
	})
	
	// Create separate computed properties for each value
	const costPerCredit = computed(() => creditCalculation.value.costPerCredit)
	const savings = computed(() => creditCalculation.value.savings)
	
	const availableCredits = computed(() => Math.floor(investment.value / costPerCredit.value))
	
	
	const formatCurrency = (value: number): string => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0
		}).format(value)
	}
	
	const adjustRevenue = (amount: number) => {
		const newValue = revenue.value + amount;
		if (newValue >= 1000000 && newValue <= 1000000000) {
			revenue.value = newValue;
		}
	};
	
	const adjustInvestment = (amount: number) => {
		const newValue = investment.value + amount;
		if (newValue >= 100000 && newValue <= 10000000) {
			investment.value = newValue;
		}
	};
	
	onMounted(() => {
		
		const costChartOptions = {
			chart: {
				type: 'area',
				height: 350,
				animations: {
					enabled: true,
					easing: 'easeinout',
				},
				toolbar: {
					show: false
				}
			},
			series: [{
				name: 'Savings Percentage',
				data: savingsCurveData.value
			}],
			annotations: {
				xaxis: [{
					x: investment.value,
					borderColor: company.primaryColor,
					strokeDashArray: 0,
					borderWidth: 2,
					label: {
						borderColor: company.primaryColor,
						style: {
							color: '#fff',
							background: company.primaryColor
						},
						text: ''
					}
				}]
			},
			colors: ['#21BA45'],
			stroke: {
				curve: 'stepline',
				width: 2
			},
			fill: {
				type: 'gradient',
				gradient: {
					shadeIntensity: 1,
					opacityFrom: 0.45,
					opacityTo: 0.05,
					stops: [0, 100]
				}
			},
			grid: {
				borderColor: '#f1f1f1',
				strokeDashArray: 4,
			},
			xaxis: {
				type: 'numeric',
				categories: ['$2k', '$6k', '$15k', '$60k', '$150k', '$425k', '$700k', '$1000k'],
				tickAmount: 8,
				labels: {
					formatter: (value: number) => `$${value/1000}k`
				},
				axisBorder: {
					show: true
				},
				axisTicks: {
					show: true
				}
			},
			yaxis: {
				min: 0,
				max: 100,
				title: {
					text: 'Savings Percentage (%)'
				},
				labels: {
					formatter: (value: number) => `${value}%`
				}
			},
			tooltip: {
				shared: false,
				y: {
					formatter: (value: number) => `${value}%`
				},
				x: {
					formatter: (value: number) => formatCurrency(value)
				}
			}
		};
		// Initialize the cost chart
		/*costChart.value = new ApexCharts(document.querySelector("#chart"), costChartOptions);
		costChart.value.render();*/
		
	})
	
	watch(investment, (newValue) => {
		costChart.value.updateOptions({
			annotations: {
				xaxis: [{
					x: newValue > 1000000 ? 1000000 : newValue ,
					borderColor: company.primaryColor,
					
					label: {
						orientation: 'horizontal',
						style: {
							color: '#fff',
							background: company.primaryColor
						},
						text: 'Current'
					}
				}]
			}
		});
	});
	
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

#chart{
	/*min-height:unset !important*/
}

.calculator-card{
	position:sticky; 
	top:12px;
}
</style>