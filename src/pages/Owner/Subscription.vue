<template>
  <OwnerLayout>
    <!-- 🔥 TOP LOADER -->
    <div
      v-if="pageLoading"
      class="fixed top-0 left-0 right-0 z-[9999] h-[3px] overflow-hidden"
    >
      <div class="h-full w-full bg-black animate-loader"></div>
    </div>

    <!-- ⏳ FULL PAGE LOADER -->
    <div
      v-if="pageLoading"
      class="min-h-screen flex items-center justify-center bg-white"
    >
      <div class="flex flex-col items-center gap-4">
        <span
          class="h-10 w-10 rounded-full border-2 border-black/20 border-t-black animate-spin"
        ></span>
        <p class="text-sm text-gray-400 tracking-wide">
          Loading subscription…
        </p>
      </div>
    </div>

    <!-- ✅ ACTUAL PAGE -->
    <div v-else class="subscription-page">

      
      <!-- Header -->
      <div class="dashboard-header">
        <h1 class="welcome">
          {{ greeting }}, <span class="username">{{ username }}</span>
        </h1>

        <h2>Subscription Management</h2>

        <p class="subtitle">
          Your subscription details at a glance — beautifully simplified.
        </p>
      </div>
      <!-- ✅ Current Subscription -->
      <el-card
        v-if="currentSub"
        shadow="never"
        class="rounded-[28px] border border-black/5 bg-white px-7 py-8 sm:px-9 transition-all duration-300 hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.15)]"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-6">
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-widest text-black/40 mb-1">
              Current Plan
            </p>
            <h3 class="text-2xl font-semibold tracking-tight text-[#1D1D1F]">
              {{ currentSub.plan?.name || 'Unknown Plan' }}
            </h3>
          </div>

          <!-- Status -->
          <span
            class="px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-wide"
            :class="{
              'bg-green-500/10 text-green-600': currentSub.status === 'ACTIVE',
              'bg-yellow-500/10 text-yellow-600': currentSub.status === 'PENDING',
              'bg-red-500/10 text-red-600': ['CANCELLED','INACTIVE','EXPIRED'].includes(currentSub.status),
            }"
          >
            {{ currentSub.status }}
          </span>
        </div>

        <!-- Content -->
        <div class="space-y-6">
          <!-- Renewal -->
          <p class="text-sm text-black/50">
            Renewal Date ·
            <span class="font-medium text-black/70">
              {{ formatDate(currentSub.renewalDate) }}
            </span>
          </p>

          <!-- Modules -->
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-widest text-black/40 mb-3">
              Modules Included
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="m in currentSub.plan?.moduleAccess"
                :key="m"
                class="px-4 py-1.5 rounded-full bg-[#F5F5F7] text-[12px] font-medium text-black/70"
              >
                {{ m }}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-8 flex flex-wrap gap-3">
          <!-- ACTIVE -->
          <template v-if="currentSub.status === 'ACTIVE'">
            <button
              @click="openUpgradeDialog"
              class="px-6 py-3 rounded-full bg-black text-white text-sm font-medium hover:scale-105 active:scale-95 transition-all"
            >
              Upgrade Plan
            </button>

            <button
              @click="cancelSubscription"
              class="px-6 py-3 rounded-full border border-black/10 text-sm font-medium text-black/60 hover:bg-black/5 transition"
            >
              Cancel Subscription
            </button>
          </template>

          <!-- PENDING -->
          <template v-else-if="currentSub.status === 'PENDING'">
            <button
              @click="openResubscribeDialog"
              class="px-6 py-3 rounded-full bg-black text-white text-sm font-medium hover:scale-105 transition"
            >
              Continue Subscription
            </button>
          </template>

          <!-- CANCELLED / INACTIVE / EXPIRED -->
          <template v-else>
            <button
              @click="openResubscribeDialog"
              class="px-6 py-3 rounded-full bg-black text-white text-sm font-medium hover:scale-105 transition"
            >
              Re-Subscribe
            </button>
          </template>
        </div>
      </el-card>


      <!-- ✅ No Subscription -->
      <el-card v-else class="no-sub-card !p-0 sm:p-0" shadow="hover">
        <!-- Header -->
        <div class="px-5 sm:px-8 pt-8 sm:pt-10 pb-6 text-center sm:text-left">
          <h2 class="text-xl sm:text-2xl font-semibold text-black">
            No Active Subscription
          </h2>
          <p class="mt-1 text-sm text-black/60">
            Choose a plan that fits your needs.
          </p>
        </div>

        <!-- Plans -->
        <div class="px-4 sm:px-8 pb-10">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="plan in plans.filter(p => p.name !== 'Starter')"
              :key="plan.name"
              :class="[
                'relative flex flex-col rounded-3xl border bg-white p-5 sm:p-7 transition',
                plan.featured
                  ? 'border-emerald-500/40'
                  : 'border-black/10'
              ]"
            >
              <!-- Plan Header -->
              <div class="mb-6">
                <div class="flex items-center justify-between">
                  <h3 class="text-base sm:text-lg font-semibold text-black">
                    {{ plan.name }}
                  </h3>

                  <span
                    v-if="plan.featured"
                    class="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-600"
                  >
                    Recommended
                  </span>
                </div>

                <div class="mt-4 flex items-end">
                  <span class="text-3xl sm:text-4xl font-bold text-black">
                    ₹{{ plan.priceMonthly }}
                  </span>
                  <span class="ml-1 text-xs sm:text-sm text-black/50">
                    /month
                  </span>
                </div>

                <p class="mt-2 text-sm text-black/60">
                  {{ plan.description }}
                </p>
              </div>

              <!-- Features -->
              <ul class="flex-1 space-y-3">
                <li
                  v-for="(feature, index) in plan.planDetails"
                  :key="index"
                  class="flex items-start gap-3 text-sm text-black/70"
                >
                  <svg
                    class="mt-1 h-4 w-4 shrink-0 text-emerald-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {{ feature }}
                </li>
              </ul>

              <!-- View Modules -->
              <button
                type="button"
                @click="openModules(plan)"
                class="mt-6 mb-4 self-start text-sm font-medium text-black/60 underline-offset-4 hover:text-black hover:underline transition"
              >
                View modules
              </button>

              <!-- CTA -->
              <button
                @click="subscribe(plan._id)"
                :class="[
                  'w-full rounded-full py-3 sm:py-3.5 text-sm font-semibold transition active:scale-95',
                  plan.featured
                    ? 'bg-black text-white hover:bg-black/90'
                    : 'bg-black/5 text-black hover:bg-black/10'
                ]"
              >
                Upgrade to {{ plan.name }}
              </button>
            </div>
          </div>

          <!-- Enterprise -->
          <div
            class="mt-10 rounded-3xl border border-black/10 bg-white p-6 sm:p-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="text-center sm:text-left">
              <h3 class="text-lg sm:text-xl font-semibold text-black">
                Enterprise
              </h3>
              <p class="mt-1 text-sm text-black/60">
                For large companies that require additional security and control.
              </p>
            </div>

            <button
              class="w-full sm:w-auto rounded-full border border-black/20 px-6 py-3 text-sm font-semibold text-black transition hover:bg-black/5"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </el-card>

      

      <!-- ✅ Upgrade Dialog -->
      <el-dialog
        v-model="showUpgradeDialog"
        :fullscreen="true"
        :close-on-click-modal="true"
        align-center
        destroy-on-close
        class="rounded-[32px] !p-0 border border-black/5"
      >
        <!-- Header -->
        <div class="px-8 sm:px-12 pt-10 pb-6 border-b border-black/5 text-left">
          <p class="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2">
            Subscription
          </p>

          <h2 class="text-3xl sm:text-4xl font-semibold tracking-tight text-black mb-2">
            Upgrade Your Plan
          </h2>

          <p class="text-sm sm:text-base text-black/50 font-light max-w-xl">
            Choose a plan that fits your growth — simple, flexible, and powerful.
          </p>
        </div>

        <!-- Plans Grid (SAME AS PRICING) -->
        <div class="px-6 sm:px-10 py-10">
          <div class="mx-auto max-w-[1320px]">
            <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              <div
                v-for="plan in visiblePlans.filter(p => p.name !== 'Starter')"
                :key="plan._id"
                :class="[
                  'relative flex flex-col rounded-3xl border p-6 sm:p-8 transition-all bg-white',
                  plan.featured
                    ? 'border-emerald-500/40'
                    : 'border-black/10'
                ]"
              >
                <!-- Plan Header -->
                <div class="mb-6 sm:mb-8">
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg sm:text-xl font-bold text-black">
                      {{ plan.name }}
                    </h3>

                    <span
                      v-if="plan.featured"
                      class="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-600"
                    >
                      Recommended
                    </span>
                  </div>

                  <div class="mt-4 flex items-baseline">
                    <span class="text-3xl sm:text-4xl font-bold text-black">
                      ₹{{ plan.priceMonthly }}
                    </span>
                    <span class="ml-1 text-sm text-black/50">/month</span>
                  </div>

                  <p class="mt-2 text-sm text-black/60 text-left">
                    {{ plan.description }}
                  </p>
                </div>

                <!-- Features -->
                <ul class="mb-8 flex-1 space-y-3 sm:space-y-4">
                  <li
                    v-for="(feature, index) in plan.planDetails"
                    :key="index"
                    class="flex items-start gap-3 text-sm text-black/70"
                  >
                    <svg
                      class="mt-1 h-4 w-4 shrink-0 text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {{ feature }}
                  </li>
                </ul>

                <!-- Modules -->
                <button
                  type="button"
                  @click="openModules(plan)"
                  class="mb-4 self-start text-sm font-medium text-black/60 underline-offset-4 hover:text-black hover:underline transition"
                >
                  View modules
                </button>

                <!-- CTA -->
                <button
                  @click="upgradePlan(plan._id)"
                  :class="[
                    'w-full rounded-full py-3.5 sm:py-4 text-sm font-semibold transition-all active:scale-95',
                    plan.featured
                      ? 'bg-black text-white hover:bg-black/90'
                      : 'bg-black/5 text-black hover:bg-black/10'
                  ]"
                >
                  {{ showResubscribeDialog ? 'Re-Subscribe' : 'Upgrade to ' + plan.name }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>

      <!-- ✅ Re-Subscribe Dialog -->
      <el-dialog
        v-model="showResubscribeDialog"
        :fullscreen="true"
        :close-on-click-modal="true"
        align-center
        destroy-on-close
        class="rounded-[32px] !p-0 border border-black/5"
      >
        <!-- Header -->
        <div class="px-8 sm:px-12 pt-10 pb-6 border-b border-black/5 text-left">
          <p class="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2">
            Renew Subscription
          </p>

          <h2 class="text-3xl sm:text-4xl font-semibold tracking-tight text-black mb-2">
            Renew Your Plan
          </h2>

          <p class="text-sm sm:text-base text-black/50 font-light max-w-xl">
            Choose a plan that fits your growth — simple, flexible, and powerful.
          </p>
        </div>

        <!-- Plans Grid (SAME AS PRICING) -->
        <div class="px-6 sm:px-10 py-10">
          <div class="mx-auto max-w-[1320px]">
            <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              <div
                v-for="plan in plans.filter(p => p.name !== 'Starter')"
                :key="plan._id"
                :class="[
                  'relative flex flex-col rounded-3xl border p-6 sm:p-8 transition-all bg-white',
                  plan.featured
                    ? 'border-emerald-500/40'
                    : 'border-black/10'
                ]"
              >
                <!-- Plan Header -->
                <div class="mb-6 sm:mb-8">
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg sm:text-xl font-bold text-black">
                      {{ plan.name }}
                    </h3>

                    <span
                      v-if="plan.featured"
                      class="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-600"
                    >
                      Recommended
                    </span>
                  </div>

                  <div class="mt-4 flex items-baseline">
                    <span class="text-3xl sm:text-4xl font-bold text-black">
                      ₹{{ plan.priceMonthly }}
                    </span>
                    <span class="ml-1 text-sm text-black/50">/month</span>
                  </div>

                  <p class="mt-2 text-sm text-black/60 text-left">
                    {{ plan.description }}
                  </p>
                </div>

                <!-- Features -->
                <ul class="mb-8 flex-1 space-y-3 sm:space-y-4">
                  <li
                    v-for="(feature, index) in plan.planDetails"
                    :key="index"
                    class="flex items-start gap-3 text-sm text-black/70"
                  >
                    <svg
                      class="mt-1 h-4 w-4 shrink-0 text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {{ feature }}
                  </li>
                </ul>

                <!-- Modules -->
                <button
                  type="button"
                  @click="openModules(plan)"
                  class="mb-4 self-start text-sm font-medium text-black/60 underline-offset-4 hover:text-black hover:underline transition"
                >
                  View modules
                </button>

                <!-- CTA -->
                <button
                  @click="upgradePlan(plan._id)"
                  :class="[
                    'w-full rounded-full py-3.5 sm:py-4 text-sm font-semibold transition-all active:scale-95',
                    plan.featured
                      ? 'bg-black text-white hover:bg-black/90'
                      : 'bg-black/5 text-black hover:bg-black/10'
                  ]"
                >
                  {{ showResubscribeDialog ? 'Re-Subscribe' : 'Upgrade to ' + plan.name }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
    <ModulesDialog
      :open="isModulesOpen"
      :modules="selectedModules"
      :plan-name="selectedPlanName"
      @close="isModulesOpen = false"
    />
  </OwnerLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import api from '../../api/axios';
import OwnerLayout from '../../layouts/OwnerLayout.vue';
import ModulesDialog from '../../components/ModulesDialog.vue'
import { useAuthStore } from '../../store/auth'

const auth = useAuthStore()
const pageLoading = ref(true)

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
})

const username = computed(() => auth.user?.name || 'there')
const isModulesOpen = ref(false)
const selectedModules = ref([])
const selectedPlanName = ref('')

const openModules = (plan) => {
  selectedModules.value = plan.moduleAccess || []
  selectedPlanName.value = plan.name
  isModulesOpen.value = true
}

const currentSub = ref(null);
const plans = ref([]);
const showUpgradeDialog = ref(false);
const showResubscribeDialog = ref(false);

// ✅ Format date helper
const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : '—');

// ✅ Fetch current subscription + organization
const fetchDetails = async () => {
  try {
    const res = await api.get('/owner/details');
    currentSub.value = res.data.subscription || null;
  } catch (err) {
    console.error(err);
    ElMessage.error('Failed to fetch subscription details');
  }
};

// ✅ Fetch all available plans
const fetchPlans = async () => {
  try {
    const res = await api.get('/owner/plans');
    plans.value = res.data || [];
  } catch (err) {
    console.error(err);
    ElMessage.error('Failed to fetch plans');
  }
};

// ✅ Subscribe to a new plan
const subscribe = async (planId) => {
  try {
    await ElMessageBox.confirm('Proceed to subscribe to this plan?', 'Confirm', {
      type: 'info',
      confirmButtonText: 'Subscribe',
      cancelButtonText: 'Cancel',
    });

    const res = await api.post('/owner/subscribe', { planId, billingCycle: 'monthly' });
    const { order, subscription } = res.data;

    if (!order) throw new Error('Order creation failed');

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Empresa SaaS Platform',
      description: `Subscription for ${subscription.planId}`,
      order_id: order.id,
      handler: async function (response) {
        try {
          await api.post('/owner/verify-payment', {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          ElMessage.success('Payment successful! Subscription activated.');
          fetchDetails();
        } catch (err) {
          console.error('Verification error:', err);
          ElMessage.error('Payment verification failed');
        }
      },
      theme: { color: '#007bff' },
    };

    const razorpay = new Razorpay(options);
    razorpay.open();
  } catch (err) {
    if (err !== 'cancel') {
      console.error(err);
      ElMessage.error(err.response?.data?.error || 'Subscription failed');
    }
  }
};

// ✅ Upgrade Plan (Razorpay Checkout integrated)
const openUpgradeDialog = () => {
  showUpgradeDialog.value = true;
};

const openResubscribeDialog = () => {
  showResubscribeDialog.value = true;
};

const upgradePlan = async (planId) => {
  try {
     // ✅ Dynamically detect context
    const isResubscribe = showResubscribeDialog.value;

    const title = isResubscribe ? 'Confirm Re-Subscription' : 'Confirm Upgrade';
    const message = isResubscribe
      ? 'Are you sure you want to re-subscribe to this plan?'
      : 'Are you sure you want to upgrade to this new plan?';
    const confirmText = isResubscribe ? 'Re-Subscribe' : 'Upgrade';

    // ✅ Custom confirmation popup
    await ElMessageBox.confirm(message, title, {
      type: isResubscribe ? 'info' : 'warning',
      confirmButtonText: confirmText,
      cancelButtonText: 'Cancel',
    });

    const res = await api.post('/owner/upgrade', {
      newPlanId: planId,
      billingCycle: 'monthly',
    });

    const { order, newSubscription } = res.data;
    if (!order) throw new Error('Upgrade order creation failed');

    // ✅ Open Razorpay payment popup for upgrade
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Empresa SaaS Platform',
      description: `Upgrade to ${newSubscription.planId}`,
      order_id: order.id,
      handler: async function (response) {
        try {
          await api.post('/owner/verify-payment', {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          ElMessage.success('Upgrade successful! Your new plan is active.');
          fetchDetails();
        } catch (err) {
          console.error('Upgrade verification error:', err);
          ElMessage.error('Upgrade verification failed');
        }
      },
      theme: { color: '#007bff' },
    };

    const razorpay = new Razorpay(options);
    razorpay.open();

    showUpgradeDialog.value = false;
    showResubscribeDialog.value = false;
  } catch (err) {
    if (err !== 'cancel') {
      console.error(err);
      ElMessage.error(err.response?.data?.error || 'Upgrade failed');
    }
  }
};

// ✅ Cancel Subscription
const cancelSubscription = async () => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to cancel your subscription?',
      'Warning',
      { confirmButtonText: 'Yes, Cancel', cancelButtonText: 'No', type: 'warning' }
    );

    await api.post('/owner/cancel', { immediate: false });
    ElMessage.success('Subscription cancelled successfully');
    fetchDetails();
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error(err.response?.data?.error || 'Failed to cancel subscription');
    }
  }
};
const currentPlanId = computed(() =>
  currentSub.value?.plan?._id || currentSub.value?.planId || null
)

const visiblePlans = computed(() =>
  plans.value.filter(p =>
    p.name !== 'Starter' &&
    p._id !== currentPlanId.value
  )
)


onMounted(async () => {
  pageLoading.value = true
  try {
    // 🚀 Fetch everything in parallel
    await Promise.all([
      fetchDetails(),
      fetchPlans()
    ])
  } catch (err) {
    console.error(err)
    ElMessage.error('Failed to load subscription page')
  } finally {
    pageLoading.value = false
  }
})

</script>

<style scoped>
.welcome {
  /* font-size: 0.95rem; */
  /* font-weight: 500; */
  color: #6b7280;
  margin-bottom: 6px;
  letter-spacing: -0.01em;
}

.username {
  color: #111827;
  font-weight: 600;
}
@media (max-width: 768px) {
  .welcome {
    font-size: 0.85rem;
  }
  .dashboard-header h2 {
    font-size: 1.5rem;
  }
}
.dashboard-header {
  margin-bottom: 40px;
}

.dashboard-header h2 {
  font-size: 2rem;
  font-weight: 600;
  color: #111827;
  letter-spacing: -0.02em;
}

.moduless {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
  padding: 10px 0;
}

.modules-tag {
  background: #f5f5f7;
  color: #1d1d1f;
  font-weight: 500;
  font-size: 13px;
  border-radius: 10px;
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  transition: all 0.25s ease;
  letter-spacing: 0.2px;
}

.modules-tag:hover {
  background: #eaeaea;
  color: #000;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}
.subscription-page {
  padding: clamp(20px, 5vw, 90px);
}
.current-card, .no-sub-card {
  margin-top: 20px;
  padding: 20px;
}
.modules {
  margin-top: 10px;
  justify-content: flex-start;
}
.actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
.plan-card {
  text-align: center;
  padding: 15px;
  border-radius: 8px;
}
.price {
  font-size: 18px;
  font-weight: bold;
  color: var(--el-color-primary);
  margin-bottom: 5px;
}

.apple-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.apple-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.07);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.plan-name {
  font-size: 1.4rem;
  font-weight: 600;
  color: #111;
  letter-spacing: 0.3px;
}

.status-tag {
  font-size: 0.85rem;
  padding: 4px 10px;
  border-radius: 8px;
  text-transform: capitalize;
}

.card-content {
  margin-bottom: 24px;
  color: #444;
  line-height: 1.6;
}

.renewal {
  font-size: 0.95rem;
  color: #555;
}

.modules-section {
  margin-top: 16px;
}

.modules-title {
  font-weight: 500;
  margin-bottom: 8px;
  color: #222;
}

.modules {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.module-tag {
  background: #f5f5f7;
  color: #333;
  border-radius: 8px;
  font-size: 0.85rem;
  padding: 4px 10px;
}

.card-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.apple-btn {
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.25s ease;
}

.apple-btn.primary {
  background: #0071e3;
  color: white;
  border: none;
}

.apple-btn.primary:hover {
  background: #005bb5;
}

.apple-btn.danger {
  background: #e5484d;
  color: white;
  border: none;
}

.apple-btn.danger:hover {
  background: #c43c42;
}

.apple-btn.success {
  background: #00a86b;
  color: white;
  border: none;
}

.apple-btn.success:hover {
  background: #008f5c;
}

.apple-btn.neutral {
  background: #f2f2f2;
  color: #555;
  border: none;
}

/* Dialog container */
.apple-dialog .el-dialog__body {
  padding: 24px 32px 28px;
  background: #fff;
  border-radius: 16px;
}

.dialog-header {
  text-align: center;
  margin-bottom: 28px;
}

.dialog-title {
  font-size: 1.6rem;
  font-weight: 600;
  color: #111;
  margin-bottom: 6px;
}

.dialog-subtitle {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* Plans Grid */
.plan-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

/* Plan Card */
.apple-plan-card {
  background: #fafafa;
  border-radius: 14px;
  padding: 22px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  text-align: center;
  transition: all 0.3s ease;
}

.apple-plan-card:hover {
  background: #fff;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.06);
  transform: translateY(-3px);
}

.plan-header {
  margin-bottom: 12px;
}

.plan-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #111;
  margin-bottom: 6px;
}

.price {
  font-size: 1rem;
  font-weight: 500;
  color: #0071e3;
}

.staff-limit {
  font-size: 0.9rem;
  color: #444;
  margin-bottom: 14px;
}

.modules {
  display: flex;
  flex-wrap: wrap;
  /* justify-content: center; */
  gap: 6px;
  margin-bottom: 16px;
}

.module-tag {
  background: #f5f5f7;
  color: #333;
  border-radius: 8px;
  font-size: 0.8rem;
  padding: 4px 10px;
}

/* Upgrade Button */
.apple-btn {
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.25s ease;
  width: auto;
  border: none;
}

.apple-btn.full {
  width: 100%;
}

.apple-btn.primary {
  background: #0071e3;
  color: white;
}

.apple-btn.primary:hover {
  background: #005bb5;
}

/* Overall Container */
.no-sub-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 50px 60px;
  border: 1px solid #eaeaea;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  text-align: center;
}

/* Header Text */
.no-sub-header {
  margin-bottom: 40px;
}

.no-sub-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #111;
  margin-bottom: 8px;
}

.no-sub-subtitle {
  font-size: 1rem;
  color: #666;
  margin: 0;
}

/* Plans Grid */
.plans-container {
  max-width: 1000px;
  margin: 0 auto;
}

.plan-col {
  display: flex;
  justify-content: center;
}

/* Plan Card */
.plan-card {
  background: #fafafa;
  border-radius: 14px;
  border: 1px solid #ebebeb;
  padding: 28px 20px;
  transition: all 0.25s ease;
  text-align: center;
  width: 100%;
}

.plan-card:hover {
  background: #fff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  transform: translateY(-4px);
}

/* Plan Header */
.plan-header {
  margin-bottom: 12px;
}

.plan-name {
  font-size: 1.3rem;
  font-weight: 600;
  color: #111;
  margin: 0;
}

.plan-price {
  color: #0071e3;
  font-size: 1rem;
  font-weight: 500;
  margin-top: 4px;
}

/* Staff Limit */
.plan-limit {
  color: #444;
  font-size: 0.9rem;
  margin: 14px 0 16px;
}

/* Modules */
.modules {
  display: flex;
  flex-wrap: wrap;
  /* justify-content: center; */
  gap: 8px;
  margin-bottom: 22px;
}

.module-tag {
  background: #f5f5f7;
  border-radius: 8px;
  color: #333;
  font-size: 0.8rem;
  padding: 4px 10px;
  border: none;
}

/* Subscribe Button */
.subscribe-btn {
  width: 100%;
  background: #000000;
  border: none;
  color: #fff;
  font-weight: 500;
  padding: 10px 0;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.25s ease;
}

.subscribe-btn:hover {
  background: #c8cfd7;
}
/* ===== Plans Grid ===== */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 28px;
  max-width: 1100px;
  margin: 0 auto;
}

/* ===== Plan Card ===== */
.owner-plan-card {
  background: #fbfbfb;
  border-radius: 24px;
  padding: 28px;
  border: 1px solid #eaeaea;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.owner-plan-card:hover {
  background: #fff;
  transform: translateY(-4px);
  box-shadow: 0 18px 45px rgba(0,0,0,0.08);
}

/* Featured */
.owner-plan-card.featured {
  border-color: #000000;
  box-shadow: 0 0 0 1px rgba(0,113,227,0.15);
}

/* Header */
.plan-top {
  margin-bottom: 18px;
}

.plan-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge {
  background: rgba(0,113,227,0.1);
  color: #000000;
  font-size: 10px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  text-transform: uppercase;
}

/* Price */
.plan-price {
  font-size: 1.9rem;
  font-weight: 700;
  color: #111;
  margin-top: 10px;
}

.plan-price span {
  font-size: 0.85rem;
  color: #666;
}

/* Description */
.plan-desc {
  font-size: 0.9rem;
  color: #666;
  margin-top: 8px;
}

/* Features */
.plan-features {
  list-style: none;
  padding: 0;
  margin: 20px 0 26px;
  flex: 1;
}

.plan-features li {
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 10px;
}

.plan-features li.muted {
  color: #777;
  font-size: 0.85rem;
}

/* CTA */
.plan-cta {
  width: 100%;
  border-radius: 999px;
  background: #000000;
  color: #fff;
  font-weight: 600;
  padding: 12px 0;
  border: none;
  transition: all 0.25s ease;
}

.plan-cta:hover {
  background: #005bb5;
  transform: translateY(-1px);
}

/* Dialog variant */
.dialog-plan-card {
  border-radius: 22px;
  padding: 26px;
  border: 1px solid #eee;
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
