<template>
  <div class="relative flex">
    <!-- Sidebar -->
    <aside
      class="sidebar flex flex-col bg-white/60 backdrop-blur-xl border-r border-gray-200/60 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)] transition-all duration-300"
      :class="{ 'w-20': collapsed, 'w-64': !collapsed }"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between px-6 py-5 border-b border-gray-200/70 bg-gradient-to-b from-white/40 to-transparent"
      >
        <h1
          class="text-xl font-semibold tracking-tight text-gray-900 transition-all duration-300"
          :class="{ 'opacity-0 w-0': collapsed }"
        >
          Empresa
        </h1>
      </div>

      <!-- Navigation Section -->
      <div class="flex-1 overflow-y-auto scrollbar-hide px-2 mt-2">
        <el-menu
          class="bg-transparent border-none"
          router
          :default-active="$route.path"
          :collapse="collapsed"
          collapse-transition
        >
          <el-menu-item :index="dashboardRoute" class="menu-item">
            <component
              :is="DataBoard"
              class="menu-icon text-gray-500"
              :class="{ 'collapsed-icon': collapsed }"
            />
            <span v-if="!collapsed">Dashboard</span>
          </el-menu-item>

          <el-menu-item v-if="isSuperAdmin" index="/superadmin/plans" class="menu-item">
            <component :is="Document" class="menu-icon text-gray-500" :class="{ 'collapsed-icon': collapsed }" />
            <span v-if="!collapsed">Plans</span>
          </el-menu-item>

          <el-menu-item v-if="isSuperAdmin" index="/superadmin/captains" class="menu-item">
            <component :is="Ship" class="menu-icon text-gray-500" :class="{ 'collapsed-icon': collapsed }" />
            <span v-if="!collapsed">Captains</span>
          </el-menu-item>

          <el-menu-item v-if="isSuperAdmin" index="/superadmin/users" class="menu-item">
            <component :is="UserFilled" class="menu-icon text-gray-500" :class="{ 'collapsed-icon': collapsed }" />
            <span v-if="!collapsed">Owners</span>
          </el-menu-item>

          <el-menu-item v-if="isSuperAdmin" index="/superadmin/settings" class="menu-item">
            <component :is="Setting" class="menu-icon text-gray-500" :class="{ 'collapsed-icon': collapsed }" />
            <span v-if="!collapsed">Settings</span>
          </el-menu-item>

          <el-menu-item v-if="isCaptain" index="/captain/users" class="menu-item">
            <component :is="User" class="menu-icon text-gray-500" :class="{ 'collapsed-icon': collapsed }" />
            <span v-if="!collapsed">Owners</span>
          </el-menu-item>

          <el-menu-item v-if="isOwner" index="/owner/staff" class="menu-item">
            <component :is="User" class="menu-icon text-gray-500" :class="{ 'collapsed-icon': collapsed }" />
            <span v-if="!collapsed">Staff</span>
          </el-menu-item>

          <el-menu-item v-if="isOwner" index="/owner/subscription" class="menu-item">
            <component :is="CreditCard" class="menu-icon text-gray-500" :class="{ 'collapsed-icon': collapsed }" />
            <span v-if="!collapsed">Subscription</span>
          </el-menu-item>

          <el-menu-item v-if="hasActiveSubscription" index="/owner/modules" class="menu-item">
            <component :is="Grid" class="menu-icon text-gray-500" :class="{ 'collapsed-icon': collapsed }" />
            <span v-if="!collapsed">Modules</span>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- Footer Profile -->
      <div
        class="relative border-t border-gray-200/70 bg-gradient-to-t from-white/60 to-transparent px-4 py-4 flex items-center gap-3 cursor-pointer hover:bg-white/80 transition-all"
        @mouseenter="showProfile = true"
        @mouseleave="showProfile = false"
      >
        <component :is="Avatar" class="w-6 h-6 text-gray-600" />
        <span v-if="!collapsed" class="text-sm font-medium text-gray-800">{{ auth.user?.name || 'User' }}</span>

        <transition name="fade">
          <div
            v-show="showProfile"
            class="absolute left-full bottom-4 ml-3 w-64 bg-white/95 rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 backdrop-blur-md"
          >
            <h3 class="text-gray-900 font-semibold mb-2 flex items-center gap-2">
              <component :is="User" class="w-4 h-4 text-gray-500" /> Profile
            </h3>

            <div class="space-y-1 text-sm text-gray-700">
              <p><strong>Name:</strong> {{ auth.user?.name }}</p>
              <p><strong>Email:</strong> {{ auth.user?.email }}</p>
              <p class="capitalize"><strong>Role:</strong> {{ auth.user?.role?.toLowerCase() }}</p>
            </div>

            <div class="mt-4 text-right">
              <el-button size="small" type="danger" class="!text-xs !rounded-full" @click="logout">
                <component :is="SwitchButton" class="w-3 h-3 mr-1" /> Logout
              </el-button>
            </div>
          </div>
        </transition>
      </div>
    </aside>

    <!-- Collapse Button -->
    <button
      class="absolute top-5 -right-3 z-20 bg-white border border-gray-200 rounded-full shadow-lg p-1.5 hover:scale-105 hover:bg-gray-50 transition"
      @click="collapsed = !collapsed"
    >
      <component :is="collapsed ? ArrowRight : ArrowLeft" class="text-gray-500 w-4 h-4" />
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../store/auth';
import {
  ArrowLeft,
  ArrowRight,
  Setting,
  DataBoard,
  User,
  UserFilled,
  Avatar,
  SwitchButton,
  Document,
  Grid,
  CreditCard,
  Ship,
} from '@element-plus/icons-vue';
import api from '../api/axios';

const auth = useAuthStore();
const collapsed = ref(false);
const showProfile = ref(false);

const logout = () => {
  auth.logout();
  window.location.href = '/';
};

const isSuperAdmin = computed(() => auth.user?.role === 'SUPERADMIN');
const isCaptain = computed(() => auth.user?.role === 'CAPTAIN');
const isOwner = computed(() => auth.user?.role === 'OWNER');

const dashboardRoute = computed(() => {
  switch (auth.user?.role) {
    case 'SUPERADMIN':
      return '/superadmin/dashboard';
    case 'CAPTAIN':
      return '/captain/dashboard';
    case 'OWNER':
      return '/owner/dashboard';
    default:
      return '/';
  }
});

const details = ref({
  owner: null,
  organization: null,
  subscription: null,
});

const hasActiveSubscription = computed(() => {
  return details.value.subscription?.status === 'ACTIVE';
});

const fetchOwnerDetails = async () => {
  try {
    const res = await api.get('/owner/details');
    details.value = res.data || {};
  } catch (err) {
    console.error(err);
    ElMessage.error('Failed to fetch owner details');
  }
};
onMounted(() => {
  fetchOwnerDetails();
});
</script>

<style scoped>
.sidebar {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
}

/* Base style */
.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  border-radius: 12px;
  margin: 3px 8px;
  padding: 10px 14px !important;
  color: #4b5563;
  transition: all 0.25s ease;
}

.menu-item:hover {
  background-color: rgba(245, 245, 247, 0.8);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.04);
  transform: translateY(-1px);
  color: #111827;
}

.menu-item.is-active {
  background-color: rgba(240, 240, 240, 0.9);
  font-weight: 600;
  color: #000;
}

/* Default icon size */
.menu-icon {
  width: 20px;
  height: 20px;
  transition: all 0.25s ease;
}

/* Larger centered icon when collapsed */
.collapsed-icon {
  width: 28px !important;
  height: 28px !important;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Hide scrollbar */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Soft fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
