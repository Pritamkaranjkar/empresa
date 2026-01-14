<template>
  <AdminLayout>
    <div class="dashboard">
      <div class="header">
        <h1>Super Admin Dashboard</h1>
        <p class="subtitle">A clean overview of your business metrics</p>
      </div>

      <!-- Overview Stats -->
      <div class="stats-grid">
        <div class="stat-card" v-for="(item, i) in overviewStats" :key="i">
          <h3>{{ item.label }}</h3>
          <p>{{ item.value }}</p>
        </div>
      </div>

      <!-- Revenue Summary -->
      <div class="section">
        <h2>Revenue Summary</h2>
        <div class="stats-grid">
          <div class="stat-card" v-for="(item, i) in revenueStats" :key="i">
            <h3>{{ item.label }}</h3>
            <p>₹{{ item.value }}</p>
          </div>
        </div>
      </div>

      <!-- Revenue Trend -->
      <div class="section">
        <h2>Revenue Trend (Last 6 Months)</h2>
        <div class="chart-card">
          <canvas id="revenueChart" height="100"></canvas>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="section">
        <h2>Recent Transactions</h2>
        <div class="card">
          <el-table
            v-if="stats.revenue.recentTransactions?.length"
            :data="stats.revenue.recentTransactions"
            stripe
            class="apple-table"
          >
            <el-table-column prop="planId.name" label="Plan" width="250" />
            <el-table-column prop="userId.name" label="User" width="250" />
            <el-table-column prop="userId.email" label="Email" width="250" />
            <el-table-column prop="billingCycle" label="Cycle" width="250" />
            <el-table-column
              prop="amount"
              label="Amount"
              width="250"
              :formatter="(row) => '₹' + row.amount"
            />
            <el-table-column
              prop="paidAt"
              label="Paid On"
              width="212"
              :formatter="(row) => formatDate(row.paidAt)"
            />
          </el-table>

          <div v-else class="no-data">
            <p>No recent transactions found.</p>
          </div>
        </div>
      </div>

      <!-- Analytics -->
      <div class="section">
        <h2>Usage Analytics</h2>
        <div class="analytics-filter">
          <el-select v-model="selectedModule" placeholder="Select Module" class="filter-select">
            <el-option v-for="m in modules" :key="m" :label="m" :value="m" />
          </el-select>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
          />
          <el-button type="primary" @click="fetchAnalytics">Load Analytics</el-button>
        </div>

        <div class="chart-card" v-loading="analyticsLoading">
          <canvas v-if="analyticsData.length" id="analyticsChart" height="100"></canvas>
          <div v-else class="no-data">
            <p>No analytics data available.</p>
          </div>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="section">
        <h2>Quick Access</h2>
        <div class="quick-links">
          <router-link
            v-for="link in quickLinks"
            :key="link.label"
            :to="link.to"
            class="link-card"
          >
            <el-icon><i :class="link.icon"></i></el-icon>
            <span>{{ link.label }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../api/axios';
import { ElMessage } from 'element-plus';
import AdminLayout from '../../layouts/AdminLayout.vue';
import Chart from 'chart.js/auto';

const stats = ref({
  stats: { orgCount: 0, userCount: 0, activeSubs: 0, estimatedRevenueMonthly: 0 },
  revenue: { totalRevenue: 0, monthlyRevenue: 0, yearlyRevenue: 0, recentTransactions: [] },
});

const overviewStats = ref([
  { label: 'Total Businesses', value: 0 },
  { label: 'Total Users', value: 0 },
  { label: 'Active Subscriptions', value: 0 },
  { label: 'Est. Monthly Revenue', value: 0 },
]);

const revenueStats = ref([
  { label: 'Total Revenue', value: 0 },
  { label: 'Monthly Revenue', value: 0 },
  { label: 'Yearly Revenue', value: 0 },
]);

const modules = ['BOOKKEEPING', 'EXPENSE', 'PROFIT_LOSS', 'INVENTORY', 'BILLING', 'REPORTS', 'ANALYTICS'];
const selectedModule = ref('');
const dateRange = ref([]);
const analyticsData = ref([]);
const analyticsLoading = ref(false);
let chartInstance = null;
let revenueChart = null;

const formatDate = (date) => (date ? new Date(date).toLocaleString() : '—');

const fetchOverview = async () => {
  try {
    const res = await api.get('/admin/overview');
    stats.value = res.data;
    overviewStats.value = [
      { label: 'Total Businesses', value: res.data.stats.orgCount },
      { label: 'Total Users', value: res.data.stats.userCount },
      { label: 'Active Subscriptions', value: res.data.stats.activeSubs },
      { label: 'Est. Monthly Revenue', value: `₹${res.data.stats.estimatedRevenueMonthly}` },
    ];
    revenueStats.value = [
      { label: 'Total Revenue', value: res.data.revenue.totalRevenue },
      { label: 'Monthly Revenue', value: res.data.revenue.monthlyRevenue },
      { label: 'Yearly Revenue', value: res.data.revenue.yearlyRevenue },
    ];
    renderRevenueChart();
  } catch (err) {
    ElMessage.error('Failed to load dashboard stats');
  }
};

const renderRevenueChart = () => {
  const ctx = document.getElementById('revenueChart');
  if (!ctx || !stats.value.revenue.recentTransactions?.length) return;
  const grouped = {};
  stats.value.revenue.recentTransactions.forEach((t) => {
    const month = new Date(t.paidAt).toLocaleString('default', { month: 'short' });
    grouped[month] = (grouped[month] || 0) + t.amount;
  });

  const labels = Object.keys(grouped);
  const data = Object.values(grouped);

  if (revenueChart) revenueChart.destroy();
  revenueChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{ label: 'Revenue (₹)', data, borderWidth: 2, tension: 0.4 }],
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } },
    },
  });
};

const fetchAnalytics = async () => {
  if (!selectedModule.value) return ElMessage.warning('Please select a module');
  analyticsLoading.value = true;
  try {
    analyticsData.value = [
      { date: '2025-11-01', usage: 20 },
      { date: '2025-11-02', usage: 45 },
      { date: '2025-11-03', usage: 32 },
      { date: '2025-11-04', usage: 55 },
      { date: '2025-11-05', usage: 28 },
    ];
    renderAnalyticsChart();
  } finally {
    analyticsLoading.value = false;
  }
};

const renderAnalyticsChart = () => {
  const ctx = document.getElementById('analyticsChart');
  if (!ctx) return;
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: analyticsData.value.map((d) => d.date),
      datasets: [
        {
          label: `${selectedModule.value} Usage`,
          data: analyticsData.value.map((d) => d.usage),
          borderWidth: 2,
          tension: 0.3,
        },
      ],
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } },
  });
};

const quickLinks = [
  { label: 'Manage Subscription Plans', icon: 'el-icon-setting', to: '/superadmin/plans' },
  { label: 'Manage Captains', icon: 'el-icon-user', to: '/superadmin/captains' },
  { label: 'Manage Business Owners', icon: 'el-icon-office-building', to: '/superadmin/users' },
  { label: 'System Settings', icon: 'el-icon-s-tools', to: '/superadmin/settings' },
];

onMounted(() => {
  fetchOverview();
  setInterval(fetchOverview, 30000);
});
</script>

<style scoped>
.dashboard {
  padding: 40px;
  background: #fafafa;
  color: #111;
  font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.header {
  text-align: left;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 32px;
  font-weight: 600;
  color: #000;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 15px;
  color: #777;
  margin-top: 4px;
}

.section {
  margin-top: 60px;
}

.section h2 {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 20px;
  color: #222;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  text-align: center;
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.stat-card h3 {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  margin-bottom: 6px;
}

.stat-card p {
  font-size: 28px;
  font-weight: 600;
  color: #000;
}

.chart-card {
  background: #fff;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #888;
  font-size: 15px;
}

.quick-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.link-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  text-decoration: none;
  color: #111;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: all 0.2s ease;
}

.link-card:hover {
  background: #f5f5f7;
  transform: translateY(-2px);
}

.link-card i {
  font-size: 24px;
  color: #0071e3;
}

.link-card span {
  margin-top: 10px;
  font-weight: 500;
}

.analytics-filter {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
}

.apple-table {
  border-radius: 16px;
  overflow: hidden;
}

</style>
