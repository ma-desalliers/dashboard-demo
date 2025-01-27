<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <div v-for="(expert, index) in experts" :key="index" class="q-pa-md q-card">
        <div class="row q-col-gutter-md items-center q-mb-md">
          <div class="col-auto">
            <q-avatar size="48px">
              <img :src="`/api/placeholder/48/48`" :alt="expert.name">
            </q-avatar>
          </div>
          <div class="col">
            <div class="text-h6 q-mb-xs">{{ expert.name }}</div>
            <div class="text-subtitle2 text-grey-7">{{ expert.title }}</div>
          </div>
        </div>
        
        <div class="text-body2 q-mb-md text-grey-8">{{ expert.description }}</div>
        
        <div>
          <div class="text-subtitle2 q-mb-sm">Key Functions:</div>
          <div class="row q-col-gutter-sm">
            <div v-for="(func, idx) in expert.functions" :key="idx" class="col-auto">
              <q-chip
                dense
                class="bg-blue-1 text-blue-9"
                size="sm"
              >
                {{ func }}
              </q-chip>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const experts = [
  {
    name: "Laura",
    title: "Market Intelligence Specialist",
    description: "Specializes in market research, competitor analysis, and trend identification. Processes large datasets to extract actionable insights.",
    functions: ["Market Analysis", "Competitor Tracking", "Trend Forecasting", "Data Visualization"]
  },
  {
    name: "Stella", 
    title: "Content Strategy Expert",
    description: "Creates and optimizes content across multiple channels. Ensures brand consistency and engagement.",
    functions: ["Content Creation", "SEO Optimization", "Brand Voice Maintenance", "Multi-channel Distribution"]
  },
  {
    name: "Mike",
    title: "Sales Development Specialist", 
    description: "Manages lead qualification and initial customer engagement. Automates follow-ups and appointment scheduling.",
    functions: ["Lead Qualification", "Email Campaigns", "Meeting Scheduling", "Pipeline Management"]
  },
  {
    name: "Steven",
    title: "Performance Analytics Expert",
    description: "Tracks KPIs and generates comprehensive performance reports. Identifies optimization opportunities.",
    functions: ["Performance Tracking", "Report Generation", "Data Analysis", "ROI Calculation"]
  },
  {
    name: "Emma",
    title: "Workflow Optimization Specialist",
    description: "Streamlines workflow processes and handles task coordination between teams and other AI agents.",
    functions: ["Workflow Automation", "Resource Allocation", "Task Prioritization", "Process Optimization"]
  }
];
</script>

<style scoped>
.q-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.q-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 0.1);
}
</style>