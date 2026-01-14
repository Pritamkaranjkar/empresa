import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';

// --- Public Pages ---
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import Terms from '../pages/Terms.vue';
import NotFound from '../pages/Shared/NotFound.vue';

// --- Dashboards ---
import SuperAdminDashboard from '../pages/Dashboard/SuperAdminDashboard.vue';
import CaptainDashboard from '../pages/Dashboard/CaptainDashboard.vue';
import OwnerDashboard from '../pages/Dashboard/OwnerDashboard.vue';
import StaffDashboard from '../pages/Dashboard/StaffDashboard.vue';

// --- SuperAdmin Pages ---
import SubscriptionPlans from '../pages/Admin/SubscriptionPlans.vue';
import Captains from '../pages/Admin/Captains.vue';
import Users from '../pages/Admin/Users.vue';
import SystemSettings from '../pages/Admin/SystemSettings.vue';

// --- Owner Pages ---
import StaffManagement from '../pages/Owner/StaffManagement.vue';
import Subscription from '../pages/Owner/Subscription.vue';
import Modules from '../pages/Owner/Modules.vue';

import CaptainsUsers  from '../pages/Captain/BusinessOwnerManagement.vue';

import profile from '@/components/Profile.vue';

import bookkeeping from '../pages/Modules/Bookkeeping.vue';
import billing from '../pages/Modules/Billing/Billing.vue';
// --- Lazy fallback (for optimization)
const lazy = (view) => () => import(`../pages/${view}.vue`);

const routes = [
  // Public routes
  { path: '/', component: Home, meta: { public: true } },
  { path: '/login', component: Login, meta: { public: true } },
  { path: '/register', component: Register, meta: { public: true } },
  { path: '/terms', component: Terms, meta: { public: true } },

  // ==============================
  // 🔱 SUPER ADMIN ROUTES
  // ==============================
  {
    path: '/superadmin/dashboard',
    component: SuperAdminDashboard,
    meta: { role: 'SUPERADMIN', title: 'Super Admin Dashboard' },
  },
  {
    path: '/superadmin/plans',
    component: SubscriptionPlans,
    meta: { role: 'SUPERADMIN', title: 'Subscription Plans' },
  },
  {
    path: '/superadmin/captains',
    component: Captains,
    meta: { role: 'SUPERADMIN', title: 'Captain Management' },
  },
  {
    path: '/superadmin/users',
    component: Users,
    meta: { role: 'SUPERADMIN', title: 'Business Owners' },
  },
  {
    path: '/superadmin/settings',
    component: SystemSettings,
    meta: { role: 'SUPERADMIN', title: 'System Settings' },
  },

  // ==============================
  // ⚓ CAPTAIN ROUTES
  // ==============================
  {
    path: '/captain/dashboard',
    component: CaptainDashboard,
    meta: { role: 'CAPTAIN', title: 'Captain Dashboard' },
  },
  {
    path: '/captain/owners',
    component: CaptainsUsers,
    meta: { role: 'CAPTAIN', title: 'Manage Business Owners' },
  },

  // ==============================
  // 👑 OWNER ROUTES
  // ==============================
  {
    path: '/owner/dashboard',
    component: OwnerDashboard,
    meta: { role: 'OWNER', title: 'Business Owner Dashboard' },
  },
  {
    path: '/owner/staff',
    component: StaffManagement,
    meta: { role: 'OWNER', title: 'Staff Management' },
  },
  {
    path: '/owner/subscription',
    component: Subscription,
    meta: { role: 'OWNER', title: 'Subscription Details' },
  },
  {
    path: '/owner/modules',
    component: Modules,
    meta: { role: 'OWNER', title: 'Modules Access' },
  },

  // ==============================
  // 👷 STAFF ROUTES
  // ==============================
  {
    path: '/staff/dashboard',
    component: StaffDashboard,
    meta: { role: 'STAFF', title: 'Staff Dashboard' },
  },

  {
    path: '/profile',
    component: profile,
    meta: { title: 'User Profile' },
  },

  {
    path: '/bookkeeping',
    component: bookkeeping,
    meta: { title: 'Bookeeping Module' },
  },

  {
    path: '/billing',
    component: billing,
    meta: { title: 'Billing Module' },
  },

  // Fallback
  { path: '/:pathMatch(.*)*', component: NotFound, meta: { public: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ==================================
// 🧠 ROUTE GUARD — Role-based Auth
// ==================================
router.beforeEach((to, _, next) => {
  const auth = useAuthStore();

  // Public pages — always allowed
  if (to.meta.public) return next();

  // Not logged in → redirect to login
  if (!auth.token) return next('/login');

  // Role mismatch → redirect to their dashboard
  if (to.meta.role && auth.user && to.meta.role !== auth.user.role) {
    return next(`/${auth.user.role.toLowerCase()}/dashboard`);
  }

  // Optional: set document title dynamically
  document.title = to.meta.title
    ? `Empresa | ${to.meta.title}`
    : 'Empresa SaaS Platform';

  next();
});

export default router;
