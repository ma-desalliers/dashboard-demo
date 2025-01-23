<template>
	<div class="q-pa-md row full-width q-col-gutter-md">
		<!-- First Card -->
		<div class="col-4">
			<q-card bordered class="pricing-card q-pa-md" flat>
				<section>
					<div class="text-h6 q-mb-md">Marketing investment</div>
					<q-list>
						<q-item v-for="item in marketingItems" :key="item.label">
							<q-item-section>{{ item.label }}</q-item-section>
							<q-item-section side>{{ item.value }}</q-item-section>
						</q-item>
					</q-list>
				</section>

				<q-card class="q-my-md" bordered>
					<q-card-section>
						<div class="text-h6">Pricing plan</div>
						<div class="row justify-between q-mt-sm">
							<div>
								<div class="text-h5">12,000$<span class="text-caption">/month</span></div>
								<div class="text-caption">5 years</div>
							</div>
							<div class="text-right">
								<div class="text-h5">0,067$<span class="text-caption">/credit</span></div>
								<div class="text-green">Save 80%</div>
							</div>
						</div>
						<div class="q-mt-sm">
							<q-btn flat color="primary" label="Change plan" @click="showChangePlan" />
							<div class="text-subtitle2 q-mt-xs">Innovator - Tier 1</div>
						</div>
					</q-card-section>
				</q-card>

				<section class="q-my-md">
					<div class="text-h6 q-mb-md">Billing frequency</div>
					<q-btn-group>
						<q-btn color="primary" label="Annualy" />
						<q-btn color="grey-4" text-color="grey-8" label="Quarterly" />
					</q-btn-group>
				</section>

				<section>
					<div class="text-h6 q-mb-md">Pricing plan</div>
					<q-list>
						<q-item v-for="item in pricingItems" :key="item.label">
							<q-item-section>{{ item.label }}</q-item-section>
							<q-item-section side>{{ item.value }}</q-item-section>
						</q-item>
					</q-list>
				</section>
			</q-card>
		</div>

		<div class="col-8" style="max-height:800px;overflow:auto">
			<div class="column q-col-gutter-md">
				<div class="row q-col-gutter-md q-pl-md q-pt-md ">
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



				<!-- Second Card -->
				<q-card flat bordered class="q-ml-md">
					<q-card-section>

						<div class="q-pt-md">
							<q-tabs v-model="tab" class="text-primary" align="justify" narrow-indicator>
								<q-tab name="revenue" label="Revenue" />
								<q-tab name="expenses" label="Expenses" />
								<q-tab name="savings" label="Savings" />
							</q-tabs>

							<q-tab-panels v-model="tab" animated>
								<q-tab-panel name="revenue">
									<div class="text-h6">Revenue</div>
									<RevenueChart></RevenueChart>
									<!-- Revenue content -->
								</q-tab-panel>

								<q-tab-panel name="expenses">
									<div class="text-h6">Expenses</div>
									<!-- Expenses content -->
								</q-tab-panel>

								<q-tab-panel name="savings">

									<CostsavingChart></CostsavingChart>

									<div>
										<div class="row full-width items-center justify-between q-pl-xl q-pr-sm q-py-sm">
											<!-- Left Section: Team Info -->
											<div class="row col-3 items-center q-gutter-x-md">
												Team
											</div>
											<div class="col-3">
												Deliverables
											</div>

											<!-- Middle Section: Financial Info -->
											<div class="row col-4 items-center justify-center q-gutter-x-lg">
												Human cost
											</div>

											<!-- Right Section: Savings -->
											<div class="column col-2 items-center justify-end q-gutter-x-md">
												Ai Cost
											</div>
										</div>

										<div class="q-pt-md">
											<div v-for="team in teams">
												<PricingExpansionItem :team-name="team.name" v-model:table-data="team.table" :ai-cost="300"
													:cost-per-credit="costPerCredit">
												</PricingExpansionItem>
											</div>
										</div>
									</div>
								</q-tab-panel>
							</q-tab-panels>
						</div>

					</q-card-section>
				</q-card>
			</div>
		</div>

		<SidePanel v-model="planSidePanel" :width="700">
			<q-card flat bordered class="q-ml-md">
				<q-card-section class="row">
					<pricecomparaison @plan-selected="(selected) => handleSelectPlan(selected)"></pricecomparaison>
				</q-card-section>
			</q-card>
		</SidePanel>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from "vue";
import ApexCharts from "apexcharts";
import PricingExpansionItem from "./usedComponent/PricingExpansionItem.vue";
import company from "~/src/repository/client";
import pricecomparaison from "./usedComponent/pricecomparaison.vue";
import CostsavingChart from "./usedComponent/costsavingChart.vue";
import RevenueChart from "./usedComponent/revenueChart.vue";


const marketingItems = ref([
	{ label: 'Total', value: '50,000$' },
	{ label: 'Marketing', value: '50,000$' },
	{ label: 'SEO', value: '25,000$' },
	{ label: 'Sales', value: '620,000$' }
])

const pricingItems = ref([
	{ label: 'AI credits', value: '1,500,000' },
	{ label: 'Payment', value: '50,000$ every quarter' },
	{ label: 'Contract value', value: '620,000$' },
	{ label: 'Seuil de rentabilité', value: 'Août 2025 (24 mois)' }
])

const planSidePanel = ref(false)
const tab = ref('savings')
const teams = reactive([
	{
		name: "marketing",
		table: [
			{
				Name: "Service page",
				AgentName: "Laura",
				AgentRole: "Content creator",
				AgentTeam: "Marketing",
				Type: "Page",
				DurationMinutes: 480,
				HumanCost: "800 $",
				AICredits: 1000,
				quantity: 50
			},
			{
				Name: "Blog category",
				AgentName: "Laura",
				AgentRole: "Content creator",
				AgentTeam: "Marketing",
				Type: "Page",
				DurationMinutes: 480,
				HumanCost: "800 $",
				AICredits: 1000,
				quantity: 50
			},
			{
				Name: "Product Hub",
				AgentName: "Laura",
				AgentRole: "Content creator",
				AgentTeam: "Marketing",
				Type: "Page",
				DurationMinutes: 480,
				HumanCost: "800 $",
				AICredits: 1000,
				quantity: 50
			},
			{
				Name: "Blog Hub",
				AgentName: "Laura",
				AgentRole: "Content creator",
				AgentTeam: "Marketing",
				Type: "Page",
				DurationMinutes: 480,
				HumanCost: "800 $",
				AICredits: 1000,
				quantity: 50
			},
			{
				Name: "Blog post",
				AgentName: "Laura",
				AgentRole: "Content creator",
				AgentTeam: "Marketing",
				Type: "Page",
				DurationMinutes: 480,
				HumanCost: "1080 $",
				AICredits: 1500,
				quantity: 50
			},
			{
				Name: "Calculator",
				AgentName: "Laura",
				AgentRole: "Content creator",
				AgentTeam: "Marketing",
				Type: "Lead Magnet",
				DurationMinutes: 1920,
				HumanCost: "3200 $",
				AICredits: 5000,
				quantity: 50
			},
			{
				Name: "Ebook",
				AgentName: "Laura",
				AgentRole: "Content creator",
				AgentTeam: "Marketing",
				Type: "Lead Magnet",
				DurationMinutes: 480,
				HumanCost: "800 $",
				AICredits: 1000,
				quantity: 50
			},
			{
				Name: "Checklist",
				AgentName: "Laura",
				AgentRole: "Content creator",
				AgentTeam: "Marketing",
				Type: "Lead Magnet",
				DurationMinutes: 480,
				HumanCost: "800 $",
				AICredits: 1000,
				quantity: 50
			},
			{
				Name: "Newsletter",
				AgentName: "Laura",
				AgentRole: "Content creator",
				AgentTeam: "Marketing",
				Type: "Email",
				DurationMinutes: 240,
				HumanCost: "400 $",
				AICredits: 250,
				quantity: 50
			},
			{
				Name: "Social post",
				AgentName: "Laura",
				AgentRole: "Content creator",
				AgentTeam: "Marketing",
				Type: "Post",
				DurationMinutes: 120,
				HumanCost: "200 $",
				AICredits: 100,
				quantity: 50
			},
			{
				Name: "Cold outreach",
				AgentName: "Noah",
				AgentRole: "SDR",
				AgentTeam: "Sales",
				Type: "Email",
				DurationMinutes: 60,
				HumanCost: "100 $",
				AICredits: 20,
				quantity: 50
			},
			{
				Name: "Smart reply",
				AgentName: "Noah",
				AgentRole: "SDR",
				AgentTeam: "Sales",
				Type: "Email",
				DurationMinutes: 15,
				HumanCost: "25 $",
				AICredits: 5,
				quantity: 50
			},
			{
				Name: "Qualification call",
				AgentName: "Noah",
				AgentRole: "SDR",
				AgentTeam: "Sales",
				Type: "Call",
				DurationMinutes: 30,
				HumanCost: "50 $",
				AICredits: 100,
				quantity: 50
			},
			{
				Name: "Follow-up call",
				AgentName: "Noah",
				AgentRole: "SDR",
				AgentTeam: "Sales",
				Type: "Call",
				DurationMinutes: 30,
				HumanCost: "50 $",
				AICredits: 100,
				quantity: 50
			},
			{
				Name: "Email response",
				AgentName: "Stella",
				AgentRole: "Customer Success (CS)",
				AgentTeam: "Support",
				Type: "Email",
				DurationMinutes: 15,
				HumanCost: "25 $",
				AICredits: 5,
				quantity: 50
			},
			{
				Name: "Email follow-up",
				AgentName: "Stella",
				AgentRole: "Customer Success (CS)",
				AgentTeam: "Support",
				Type: "Email",
				DurationMinutes: 15,
				HumanCost: "25 $",
				AICredits: 5,
				quantity: 50
			},
			{
				Name: "Follow-up call",
				AgentName: "Stella",
				AgentRole: "Customer Success (CS)",
				AgentTeam: "Support",
				Type: "Call",
				DurationMinutes: 50,
				HumanCost: "83 $",
				AICredits: 250,
				quantity: 50
			},
		],
	},
]);

const revenue = ref(1000000);
const investment = ref(100000);

const costChart = ref();


// To this:
const creditCalculation = computed(() => {
	const baseCredit = 0.01;
	const inv = investment.value;
	if (inv >= 1000000) return { costPerCredit: baseCredit * 0.05, savings: 95 };
	if (inv >= 750000) return { costPerCredit: baseCredit * 0.15, savings: 85 };
	if (inv >= 500000) return { costPerCredit: baseCredit * 0.25, savings: 75 };
	if (inv >= 300000) return { costPerCredit: baseCredit * 0.35, savings: 65 };
	if (inv >= 200000) return { costPerCredit: baseCredit * 0.45, savings: 55 };
	if (inv >= 150000) return { costPerCredit: baseCredit * 0.55, savings: 45 };
	if (inv >= 100000) return { costPerCredit: baseCredit * 0.75, savings: 25 };
	return { costPerCredit: baseCredit * 0.75, savings: 25 };
});

const savingsCurveData = computed(() => {
	const investmentLevels = [100000, 150000, 200000, 300000, 500000, 750000, 1000000];
	return investmentLevels.map((inv) => ({
		x: inv,
		y:
			inv >= 1000000
				? 95
				: inv >= 750000
					? 85
					: inv >= 500000
						? 75
						: inv >= 300000
							? 65
							: inv >= 200000
								? 55
								: inv >= 150000
									? 45
									: inv >= 100000
										? 25
										: 25,
	}));
});

const investmentPercentage = computed(() => {
	if (!revenue.value) return 0;
	return ((investment.value / revenue.value) * 100).toFixed(1);
});

// Create separate computed properties for each value
const costPerCredit = ref(0.044) //computed(() => creditCalculation.value.costPerCredit);
const savings = computed(() => creditCalculation.value.savings);

const availableCredits = computed(() =>
	Math.floor(investment.value / costPerCredit.value)
);

const formatCurrency = (value: number): string => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	}).format(value);
};

const handleSelectPlan = (selected: any) => {
	costPerCredit.value = selected.costPerCredit
	console.log('Selected PLAN', selected)
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

const showChangePlan = () => {
	planSidePanel.value = true;
}

onMounted(() => {
	const costChartOptions = {
		chart: {
			type: "area",
			height: 350,
			animations: {
				enabled: true,
				easing: "easeinout",
			},
			toolbar: {
				show: false,
			},
		},
		series: [
			{
				name: "Savings Percentage",
				data: savingsCurveData.value,
			},
		],
		annotations: {
			xaxis: [
				{
					x: investment.value,
					borderColor: company.primaryColor,
					strokeDashArray: 0,
					borderWidth: 2,
					label: {
						borderColor: company.primaryColor,
						style: {
							color: "#fff",
							background: company.primaryColor,
						},
						text: "",
					},
				},
			],
		},
		colors: ["#21BA45"],
		stroke: {
			curve: "stepline",
			width: 2,
		},
		fill: {
			type: "gradient",
			gradient: {
				shadeIntensity: 1,
				opacityFrom: 0.45,
				opacityTo: 0.05,
				stops: [0, 100],
			},
		},
		grid: {
			borderColor: "#f1f1f1",
			strokeDashArray: 4,
		},
		xaxis: {
			type: "numeric",
			categories: ["$2k", "$6k", "$15k", "$60k", "$150k", "$425k", "$700k", "$1000k"],
			tickAmount: 8,
			labels: {
				formatter: (value: number) => `$${value / 1000}k`,
			},
			axisBorder: {
				show: true,
			},
			axisTicks: {
				show: true,
			},
		},
		yaxis: {
			min: 0,
			max: 100,
			title: {
				text: "Savings Percentage (%)",
			},
			labels: {
				formatter: (value: number) => `${value}%`,
			},
		},
		tooltip: {
			shared: false,
			y: {
				formatter: (value: number) => `${value}%`,
			},
			x: {
				formatter: (value: number) => formatCurrency(value),
			},
		},
	};
	// Initialize the cost chart
	/*costChart.value = new ApexCharts(document.querySelector("#chart"), costChartOptions);
		costChart.value.render();*/
});

watch(investment, (newValue) => {
	costChart.value.updateOptions({
		annotations: {
			xaxis: [
				{
					x: newValue > 1000000 ? 1000000 : newValue,
					borderColor: company.primaryColor,

					label: {
						orientation: "horizontal",
						style: {
							color: "#fff",
							background: company.primaryColor,
						},
						text: "Current",
					},
				},
			],
		},
	});
});
</script>

<style scoped>
.q-slider {
	min-width: 150px;
}

.overlap-left {
	margin-left: -12px;
	/* Create overlapping effect */
}

/* Add hover effect to avatars */
.q-avatar {
	transition: transform 0.2s;
	border: 2px solid white;
	/* Add border to separate overlapping avatars */
	background-color: white;
}

.q-avatar:hover {
	transform: translateY(-2px);
	z-index: 1;
	/* Bring hovered avatar to front */
}

/* Custom tooltip styling */
:deep(.q-tooltip) {
	font-size: inherit;
	background: white;
	color: #000;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

#chart {
	/*min-height:unset !important*/
}

.calculator-card {
	position: sticky;
	top: 12px;
}
</style>
