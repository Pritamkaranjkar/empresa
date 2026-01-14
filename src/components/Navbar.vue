<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import api from '@/api/axios'
import { ElMessage } from 'element-plus'

import {
  Document,
  Ship,
  UserFilled,
  Setting,
  User,
  CreditCard,
  Grid,
} from '@element-plus/icons-vue'

/* -------------------------------------------------------
   Core
------------------------------------------------------- */
const router = useRouter()
const auth = useAuthStore()

/* -------------------------------------------------------
   Role Checks
------------------------------------------------------- */
const isSuperAdmin = computed(() => auth.user?.role === 'SUPERADMIN')
const isCaptain = computed(() => auth.user?.role === 'CAPTAIN')
const isOwner = computed(() => auth.user?.role === 'OWNER')

/* -------------------------------------------------------
   Owner Details (ASYNC SAFE)
------------------------------------------------------- */
const details = ref({
  owner: null,
  organization: null,
  subscription: null,
})

const hasActiveSubscription = computed(
  () => details.value.subscription?.status === 'ACTIVE'
)

const fetchOwnerDetails = async () => {
  try {
    const res = await api.get('/owner/details')
    details.value = res.data || {}
  } catch (err) {
    console.error(err)
    ElMessage.error('Failed to fetch owner details')
  }
}

onMounted(() => {
  if (isOwner.value) {
    fetchOwnerDetails()
  }
})

/* -------------------------------------------------------
   Dashboard Route
------------------------------------------------------- */
const dashboardRoute = computed(() => {
  switch (auth.user?.role) {
    case 'SUPERADMIN':
      return '/superadmin/dashboard'
    case 'CAPTAIN':
      return '/captain/dashboard'
    case 'OWNER':
      return '/owner/dashboard'
    default:
      return '/'
  }
})

const goToDashboard = () => {
  router.push(dashboardRoute.value)
}

/* -------------------------------------------------------
   MENU CONFIG (DO NOT FILTER HERE)
------------------------------------------------------- */
const menuItems = [
  {
    label: 'Home',
    route: () => dashboardRoute.value,
    icon: Grid,
    visible: () => !!auth.user,
  },
  // SUPERADMIN
  {
    label: 'Plans',
    route: '/superadmin/plans',
    icon: Document,
    visible: () => isSuperAdmin.value,
  },
  {
    label: 'Captains',
    route: '/superadmin/captains',
    icon: Ship,
    visible: () => isSuperAdmin.value,
  },
  {
    label: 'Owners',
    route: '/superadmin/users',
    icon: UserFilled,
    visible: () => isSuperAdmin.value,
  },
  {
    label: 'Settings',
    route: '/superadmin/settings',
    icon: Setting,
    visible: () => isSuperAdmin.value,
  },

  // CAPTAIN
  {
    label: 'Owners',
    route: '/captain/owners',
    icon: User,
    visible: () => isCaptain.value,
  },

  // OWNER
  {
    label: 'Staff',
    route: '/owner/staff',
    icon: User,
    visible: () => isOwner.value,
  },
  {
    label: 'Subscription',
    route: '/owner/subscription',
    icon: CreditCard,
    visible: () => isOwner.value,
  },
  {
    label: 'Modules',
    route: '/owner/modules',
    icon: Grid,
    visible: () => isOwner.value && hasActiveSubscription.value,
  },
]

/* -------------------------------------------------------
   VISIBLE MENU (SAFE)
------------------------------------------------------- */
const visibleMenuItems = computed(() =>
  menuItems.filter(item => item.visible())
)

/* -------------------------------------------------------
   Mobile Drawer
------------------------------------------------------- */
const mobileOpen = ref(false)

const navigate = (route) => {
  const finalRoute = typeof route === 'function' ? route() : route
  router.push(finalRoute)
  mobileOpen.value = false
}

const logout = () => {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <!-- ================= NAVBAR ================= -->
  <nav class="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <!-- Brand -->
      <div
        class="text-xl font-semibold tracking-tight cursor-pointer"
        @click="goToDashboard"
      >
        EMPRESA
      </div>

      <!-- Desktop -->
      <div class="hidden md:flex items-center gap-6 text-sm">
        <button
          v-for="item in visibleMenuItems"
          :key="item.route"
          @click="navigate(item.route)"
          class="flex items-center gap-2 text-black/70 hover:text-black transition"
        >
          <component :is="item.icon" class="w-4 h-4" />
          {{ item.label }}
        </button>

        <button
          @click="logout"
          class="ml-4 rounded-full border border-black/10 px-4 py-1.5 hover:bg-black hover:text-white transition"
        >
          Logout
        </button>
      </div>

      <!-- Mobile Toggle -->
      <button class="md:hidden text-xl" @click="mobileOpen = !mobileOpen">
        ☰
      </button>
    </div>
  </nav>

  <!-- ================= MOBILE DRAWER ================= -->
  <transition name="fade">
    <div v-if="mobileOpen" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden">
      <div class="absolute right-0 top-0 h-full w-72 bg-white p-6">
        <div class="mb-6 text-lg font-semibold">Menu</div>

        <div class="space-y-4">
          <button
            v-for="item in visibleMenuItems"
            :key="item.route"
            @click="navigate(item.route)"
            class="flex items-center gap-3 text-black/80"
          >
            <component :is="item.icon" class="w-5 h-5" />
            {{ item.label }}
          </button>
        </div>

        <button
          @click="logout"
          class="mt-8 w-full rounded-full border border-black/10 py-2"
        >
          Logout
        </button>
      </div>
    </div>
  </transition>

  <div class="h-16"></div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
