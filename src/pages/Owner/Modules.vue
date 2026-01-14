<template>
  <OwnerLayout>

    <!-- 🔥 Top Loader -->
    <div
      v-if="loading"
      class="fixed top-0 left-0 right-0 z-[9999] h-[3px] overflow-hidden"
    >
      <div class="h-full w-full bg-black animate-loader"></div>
    </div>

    <!-- ⏳ Full Page Loader -->
    <div
      v-if="loading"
      class="min-h-screen flex items-center justify-center bg-white"
    >
      <div class="flex flex-col items-center gap-4">
        <span
          class="h-10 w-10 rounded-full border-2 border-black/20 border-t-black animate-spin"
        ></span>
        <p class="text-sm text-gray-400 tracking-wide">
          Loading modules…
        </p>
      </div>
    </div>

    <!-- ✅ Actual Content -->
    <div v-else class="modules-access">
      <div class="page-header">
        <h2 class="page-title">Modules Access</h2>
        <p class="page-subtitle">
          Access the tools and features available in your current plan.
        </p>
      </div>

      <!-- Empty State -->
      <el-empty
        v-if="modules.length === 0"
        description="You currently don't have access to any modules."
        class="empty-state"
      />

      <!-- Module Cards -->
      <div v-else class="modules">
        <router-link
          v-for="m in modules"
          :key="m.name"
          :to="`/${m.name.toLowerCase().replace(/ & /g, '').replace(/\s+/g, '')}`"
          class="module-card"
        >
          <div class="module-content">
            <h3 class="module-title">{{ m.name }}</h3>
            <p class="module-desc">{{ m.desc }}</p>
          </div>
        </router-link>
      </div>
    </div>

  </OwnerLayout>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import api from '../../api/axios'
import OwnerLayout from '../../layouts/OwnerLayout.vue'

/* -----------------------
   STATE
----------------------- */
const loading = ref(true)
const modules = ref([])

/* -----------------------
   API
----------------------- */
const fetchAccessibleModules = async () => {
  const res = await api.get('/owner/details')
  const plan = res.data?.subscription?.plan
  const accessibleModules = plan?.moduleAccess || []

  const allModules = [
    { name: 'Bookkeeping', desc: 'Manage your accounting records and ledgers efficiently.' },
    { name: 'Expense', desc: 'Track, categorize, and control your business expenses.' },
    { name: 'Profit & Loss', desc: 'Monitor overall profitability and analyze income vs expenses.' },
    { name: 'Inventory', desc: 'Manage your products, stock levels, and supply tracking.' },
    { name: 'Billing', desc: 'Generate, send, and manage invoices for clients and vendors.' },
    { name: 'Reports', desc: 'Generate detailed financial and operational performance reports.' },
    { name: 'Analytics', desc: 'Visualize data insights and KPIs using charts and analytics.' },
  ]

  modules.value = allModules.filter(m =>
    accessibleModules.includes(
      m.name.replace(/ & /g, '_').toUpperCase()
    )
  )
}

/* -----------------------
   LIFECYCLE
----------------------- */
onMounted(async () => {
  loading.value = true
  try {
    await fetchAccessibleModules()
  } catch (err) {
    console.error(err)
    ElMessage.error('Failed to load module access')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.modules-access {
  max-width: auto;
  margin: 0 auto;
  padding: clamp(20px, 5vw, 90px);
  text-align: left;
  background-color: #fff;
}

.page-header {
  margin-bottom: 40px;
}

.page-title {
  font-size: 2.4rem;
  font-weight: 600;
  color: #000;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.page-subtitle {
  color: #6e6e73;
  font-size: 1rem;
}

.modules {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 25px;
  margin-top: 30px;
}

.module-card {
  background: #fafafa;
  border-radius: 18px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  padding: 28px 24px;
  text-align: left;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.module-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  background: #fff;
}

.module-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 6px;
}

.module-desc {
  font-size: 0.95rem;
  color: #6e6e73;
  line-height: 1.5;
}

.empty-state {
  margin-top: 60px;
}

@media (max-width: 768px) {
  .modules-access {
    padding: 40px 16px;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .modules {
    grid-template-columns: 1fr;
  }
}
@keyframes loader {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0); }
  100% { transform: translateX(100%); }
}

.animate-loader {
  animation: loader 1.1s ease-in-out infinite;
}

</style>
