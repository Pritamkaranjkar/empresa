<template>
  <OwnerLayout>
    <!-- Top Loader -->
    <div
      v-if="loading"
      class="fixed top-0 left-0 right-0 z-[9999] h-[3px] overflow-hidden bg-transparent"
    >
      <div class="h-full w-full animate-loader bg-black"></div>
    </div>
    <!-- Skeleton / Loader -->
<div
  v-if="loading"
  class="min-h-screen flex items-center justify-center bg-white"
>
  <div class="flex flex-col items-center gap-4">
    <span class="h-10 w-10 rounded-full border-2 border-black/20 border-t-black animate-spin"></span>
    <p class="text-sm text-gray-400 tracking-wide">Loading dashboard…</p>
  </div>
</div>

<!-- Actual Dashboard -->
<div
  v-else
  class="dashboard min-h-screen bg-white"
>

      <!-- Header Section -->
      <header class="dashboard-header animate-in fade-in slide-in-from-top-4 duration-1000">
        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p class="greeting text-sm font-medium text-gray-400 uppercase tracking-widest mb-2">
              {{ greeting }}, <span class="text-black">{{ username }}</span>
            </p>
            <h1 class="title text-4xl md:text-5xl font-semibold tracking-tight text-black leading-tight">
              Business Owner Dashboard
            </h1>
            <p class="subtitle text-lg text-gray-500 mt-4 max-w-2xl leading-relaxed">
              Your business at a glance — beautifully simplified with precision and clarity.
            </p>
          </div>
        </div>
      </header>

      <!-- Stats Grid -->
      <div class="stats-grid grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
        <div class="premium-card group">
          <div class="card-content">
            <h3 class="card-label">Active Plan</h3>
            <div class="flex items-baseline gap-2 mt-4">
              <p class="stat-value">{{ details.subscription?.plan?.name || 'Not Subscribed' }}</p>
              <div v-if="details.subscription" class="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
            <p class="card-footer mt-2">Current tier</p>
          </div>
        </div>

        <div class="premium-card group">
          <div class="card-content">
            <h3 class="card-label">Staff Members</h3>
            <p class="stat-value mt-4">{{ staffCount }}</p>
            <p class="card-footer mt-2">Active personnel</p>
          </div>
        </div>

        <div class="premium-card group">
          <div class="card-content">
            <h3 class="card-label">Status</h3>
            <p class="stat-value mt-4">{{ details.subscription?.status || 'N/A' }}</p>
            <p class="card-footer mt-2">Account health</p>
          </div>
        </div>
      </div>

      <!-- Subscription Details Section -->
      <section v-if="details.subscription" class="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
        <div class="flex items-center justify-between mb-8">
          <h3 class="section-title text-2xl font-semibold tracking-tight">Subscription Details</h3>
          <div class="h-px flex-1 bg-gray-100 ml-8"></div>
        </div>

        <div class="premium-card overflow-hidden">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div class="p-8">
              <p class="detail-label text-xs uppercase tracking-widest text-gray-400 mb-2">Plan Name</p>
              <p class="detail-value text-lg font-medium">{{ details.subscription?.plan?.name }}</p>
            </div>
            <div class="p-8">
              <p class="detail-label text-xs uppercase tracking-widest text-gray-400 mb-2">Monthly Price</p>
              <p class="detail-value text-lg font-medium">₹{{ details.subscription?.plan?.priceMonthly }}</p>
            </div>
            <div class="p-8">
              <p class="detail-label text-xs uppercase tracking-widest text-gray-400 mb-2">Start Date</p>
              <p class="detail-value text-lg font-medium">{{ formatDate(details.subscription?.startDate) }}</p>
            </div>
            <div class="p-8">
              <p class="detail-label text-xs uppercase tracking-widest text-gray-400 mb-2">Renewal Date</p>
              <p class="detail-value text-lg font-medium">{{ formatDate(details.subscription?.renewalDate) }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Empty State / No Subscription -->
      <section v-else class="mt-16 text-center py-20 px-6 rounded-3xl border border-dashed border-gray-200 bg-gray-50/50 animate-in zoom-in-95 duration-1000">
        <div class="max-w-md mx-auto">
          <h3 class="text-xl font-semibold mb-3">No Active Subscription</h3>
          <p class="text-gray-500 mb-8 leading-relaxed">
            Choose a plan to unlock advanced modules and comprehensive staff management tools tailored for your business.
          </p>
          <router-link to="/owner/subscription">
            <div class="flex justify-center">
              <button class="px-6 py-3 rounded-xl bg-black text-white font-medium transition-all hover:bg-black/90 active:scale-95">
                View Subscription Plans
              </button>
            </div>
          </router-link>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="mt-16 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
        <div class="flex items-center justify-between mb-8">
          <h3 class="section-title text-2xl font-semibold tracking-tight">Quick Access</h3>
          <div class="h-px flex-1 bg-gray-100 ml-8"></div>
        </div>

        <div class="flex flex-wrap gap-4">
          <router-link to="/owner/staff" class="flex-1 min-w-[200px]">
            <button class="btn-premium secondary w-full">
              Manage Staff
            </button>
          </router-link>

          <router-link to="/owner/subscription" class="flex-1 min-w-[200px]">
            <button class="btn-premium secondary w-full">
              Subscription
            </button>
          </router-link>

          <router-link
            v-if="details.subscription?.status === 'ACTIVE'"
            to="/owner/modules"
            class="flex-1 min-w-[200px]"
          >
            <button class="btn-premium secondary w-full">
              Modules Access
            </button>
          </router-link>

          <button
            v-else
            disabled
            class="btn-premium disabled w-full flex-1 min-w-[200px]"
          >
            Modules Access (Unavailable)
          </button>
        </div>
      </section>
    </div>
  </OwnerLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useWindowSize } from '@vueuse/core'
import api from '../../api/axios'
import OwnerLayout from '../../layouts/OwnerLayout.vue'
import { useAuthStore } from '../../store/auth'

const auth = useAuthStore()
const loading = ref(true)

const details = ref({
  owner: null,
  organization: null,
  subscription: null
})

const staffCount = ref(0)

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
})

const username = computed(() => auth.user?.name || 'there')

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString() : '—'

const fetchOwnerDetails = async () => {
  try {
    const res = await api.get('/owner/details')
    details.value = res.data || {}
  } catch (err) {
    console.error(err)
    ElMessage.error('Failed to fetch owner details')
  }
}

const fetchStaff = async () => {
  try {
    const res = await api.get('/owner/staff')
    staffCount.value = Array.isArray(res.data) ? res.data.length : 0
  } catch {
    staffCount.value = 0
  }
}

onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      fetchOwnerDetails(),
      fetchStaff()
    ])
  } catch (err) {
    console.error(err)
    ElMessage.error('Failed to load dashboard')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
  html, body {
    margin: 0;
    padding: 0;
    background-color: #f9f9f9;
  }
/* Typography & Layout */
.dashboard {
  padding: 32px 40px 80px;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Premium Cards */
.premium-card {
  position: relative;
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.premium-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.1);
}

.card-content {
  padding: 32px;
}

.card-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #888;
  font-weight: 500;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 600;
  color: #000;
  letter-spacing: -0.03em;
}

.card-footer {
  font-size: 0.875rem;
  color: #999;
}

/* Buttons */
.btn-premium {
  padding: 14px 28px;
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.btn-premium.primary {
  background: #000;
  color: #fff;
  border: 1px solid #000;
}

.btn-premium.primary:hover {
  background: #222;
  transform: scale(1.02);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.btn-premium.secondary {
  background: #fff;
  color: #000;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.btn-premium.secondary:hover {
  background: #fafafa;
  border-color: rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.btn-premium.disabled {
  background: #f5f5f5;
  color: #ccc;
  border: 1px solid #eee;
  cursor: not-allowed;
}

/* Transitions */
.animate-in {
  animation-fill-mode: both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Mobile Adjustments */
@media (max-width: 768px) {
  .dashboard {
    padding: 40px 20px;
  }
  
  .title {
    font-size: 2.25rem;
  }
  
  .stat-value {
    font-size: 2rem;
  }
  
  .premium-card {
    border-radius: 20px;
  }
  
  .card-content {
    padding: 24px;
  }
}
@keyframes loader {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0); }
  100% { transform: translateX(100%); }
}

.animate-loader {
  animation: loader 1.2s ease-in-out infinite;
}

</style>
