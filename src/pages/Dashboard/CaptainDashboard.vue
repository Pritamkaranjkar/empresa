<template>
  <CaptainLayout>
    <div class="dashboard">
      <h2>Captain Dashboard</h2>

      <!-- Overview Stats -->
      <el-row :gutter="20" class="stats-row">
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <h3>Total Organizations</h3>
            <p class="stat">{{ stats.orgCount }}</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <h3>Business Owners</h3>
            <p class="stat">{{ stats.userCount }}</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <h3>Active Subscriptions</h3>
            <p class="stat">{{ stats.activeSubs }}</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <h3>Monthly Revenue</h3>
            <p class="stat">₹{{ stats.revenueMonthly }}</p>
          </el-card>
        </el-col>
      </el-row>

      <!-- Analytics Summary -->
      <el-row :gutter="20" class="stats-row">
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <h3>Module Usage (30 Days)</h3>
            <p class="stat">{{ stats.moduleUsage }}</p>
          </el-card>
        </el-col>
      </el-row>

      <!-- Quick Links -->
      <div class="quick-links">
        <h3>Quick Access</h3>
        <el-row :gutter="20">
          <el-col :span="8">
            <router-link to="/captain/owners">
              <el-card class="link-card" shadow="hover">
                <el-icon><i class="el-icon-user"></i></el-icon>
                <div>Manage Business Owners</div>
              </el-card>
            </router-link>
          </el-col>
          <el-col :span="8">
            <router-link to="/captain/organizations">
              <el-card class="link-card" shadow="hover">
                <el-icon><i class="el-icon-office-building"></i></el-icon>
                <div>View Organizations</div>
              </el-card>
            </router-link>
          </el-col>
          <el-col :span="8">
            <router-link to="/captain/analytics">
              <el-card class="link-card" shadow="hover">
                <el-icon><i class="el-icon-data-analysis"></i></el-icon>
                <div>Analytics & Reports</div>
              </el-card>
            </router-link>
          </el-col>
        </el-row>
      </div>
    </div>
  </CaptainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import api from '../../api/axios';
import CaptainLayout from '../../layouts/CaptainLayout.vue';

// reactive state for overview + analytics
const stats = ref({
  orgCount: 0,
  userCount: 0,
  activeSubs: 0,
  revenueMonthly: 0,
  moduleUsage: 0
});

// ✅ Fetch captain overview stats
const fetchOverview = async () => {
  try {
    const res = await api.get('/captain/overview');
    stats.value.orgCount = res.data.orgCount || 0;
    stats.value.userCount = res.data.userCount || 0;
    stats.value.activeSubs = res.data.activeSubs || 0;
    stats.value.revenueMonthly = res.data.revenueMonthly || 0;
  } catch (err) {
    console.error(err);
    ElMessage.error('Failed to load captain overview stats');
  }
};

// ✅ Fetch analytics summary
const fetchAnalytics = async () => {
  try {
    const res = await api.get('/captain/analytics', {
      params: { range: '30d' }
    });
    stats.value.moduleUsage = res.data?.usageCount || 0;
  } catch (err) {
    console.warn('Analytics unavailable');
  }
};

onMounted(() => {
  fetchOverview();
  fetchAnalytics();
});
</script>

<style scoped>
.dashboard {
  padding: 10px 20px;
}

.stats-row {
  margin-top: 20px;
}

.stat-card {
  text-align: center;
  border-radius: 8px;
}

.stat {
  font-size: 24px;
  font-weight: bold;
  color: var(--el-color-primary);
  margin-top: 10px;
}

.quick-links {
  margin-top: 40px;
}

.link-card {
  text-align: center;
  padding: 30px 0;
  border-radius: 8px;
  transition: 0.2s ease;
  cursor: pointer;
}

.link-card:hover {
  transform: translateY(-3px);
}

.link-card div {
  margin-top: 10px;
  font-weight: 600;
}
</style>
