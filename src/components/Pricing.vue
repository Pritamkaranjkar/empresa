<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '../api/axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import ModulesDialog from '../components/ModulesDialog.vue'

const isLocalhost = window.location.hostname === 'localhost'

const isModulesOpen = ref(false)
const selectedModules = ref([])
const selectedPlanName = ref('')

const emit = defineEmits(['close', 'open-login'])

// defineEmits(['close'])
const props = defineProps({
  isOpen: Boolean
})

const plans = ref([])
const loading = ref(false)

const openModules = (plan) => {
  selectedModules.value = plan.moduleAccess || []
  selectedPlanName.value = plan.name
  isModulesOpen.value = true
}


const router = useRouter()
const authStore = useAuthStore()

const isLoggedIn = () => {
  return !!authStore.token
}

const handleSubscribe = (plan) => {
  // 🔒 Not logged in
  if (!isLoggedIn()) {
    // ✅ store selected plan temporarily
    localStorage.setItem(
      'selectedPlanId',
      plan._id || plan.name
    )

    // close pricing modal
    emit('close')

    // open login popup
    emit('open-login')

    return
  }

  // ✅ Logged in
  if (plan.name === 'Starter' || plan.name === 'Free') {
    router.push(`/${authStore.user.role.toLowerCase()}/dashboard`)
  } else {
    router.push({
      path: '/owner/subscription',
      query: { planId: plan._id }
    })
  }
}


const fetchPlans = async () => {
  try {
    loading.value = true
    const res = await api.get('/public/plans') // 👈 public plans API
    plans.value = res.data
    console.log('Plans fetched:', plans.value)
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const openMail = () => {
  const email = 'empresatechorg@gmail.com'
  const subject = encodeURIComponent('Empresa – Early Access')
  const body = encodeURIComponent(
    `Hello Empresa Team,\n\nI’m interested in early access.\n\nName:\nCompany:\nMessage:\n`
  )

  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
}

// watch(
//   () => props.isOpen,
//   (open) => {
//     if (open) fetchPlans()
//   }
// )
watch(
  () => props.isOpen,
  (open) => {
    if (open && isLocalhost) {
      fetchPlans()
    }
  }
)
</script>

<template>
  <Transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-3 sm:p-6"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/60 backdrop-blur-sm"
        @click="$emit('close')"
      ></div>

      <!-- Modal -->
      <div
        class="relative w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-black text-white shadow-2xl"
      >
        <!-- Close Button -->
        <button
          @click="$emit('close')"
          class="absolute right-4 top-4 sm:right-8 sm:top-8 z-10 rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 sm:h-6 sm:w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <!-- Content -->
        <div class="hide-modal-scroll max-h-[95vh] overflow-y-auto px-5 py-8 sm:p-16">
          <!-- Header -->
          <template v-if="isLocalhost">
          <div class="mb-12 sm:mb-16 text-center">
            <span
              class="mb-4 inline-block rounded-full bg-white/10 px-3 py-1 text-[10px] sm:text-xs font-semibold text-white/70"
            >
              New: Credit-Based Pricing
            </span>

            <h2
              class="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight"
            >
              Plans and Pricing
            </h2>

            <p
              class="mt-4 sm:mt-6 text-sm sm:text-lg text-white/50 max-w-2xl mx-auto"
            >
              Get started immediately for free. Upgrade for more credits and usage.
            </p>
          </div>

          <!-- Plans Grid -->
          <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            <div
              v-for="plan in plans"
              :key="plan.name"
              :class="[
                'relative flex flex-col rounded-3xl border p-6 sm:p-8 transition-all',
                plan.featured
                  ? 'border-emerald-500/50 bg-emerald-500/5'
                  : 'border-white/10 bg-white/[0.02]'
              ]"
            >
              <!-- Plan Header -->
              <div class="mb-6 sm:mb-8">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg sm:text-xl font-bold">
                    {{ plan.name }}
                  </h3>

                  <span
                    v-if="plan.featured"
                    class="rounded-full bg-emerald-500/20 px-2.5 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-400"
                  >
                    Recommended
                  </span>
                </div>

                <div class="mt-4 flex items-baseline">
                  <span class="text-3xl sm:text-4xl font-bold">
                    ₹{{ plan.priceMonthly }}
                  </span>
                  <span class="ml-1 text-white/50 text-sm">/month</span>
                </div>

                <p class="mt-2 text-sm text-white/50">
                  {{ plan.description }}
                </p>
              </div>

              <!-- Features -->
              <ul class="mb-8 flex-1 space-y-3 sm:space-y-4">
                <li
                  v-for="(feature, index) in plan.planDetails"
                  :key="index"
                  class="flex items-start gap-3 text-sm text-white/70"
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
              <button
                type="button"
                @click="openModules(plan)"
                class="mb-4 self-start text-[13px] font-medium tracking-tight text-white/70 hover:text-white transition"
              >
                View modules
              </button>
              <!-- CTA -->
              <button
                @click="handleSubscribe(plan)"
                :class="[
                  'w-full rounded-full py-3.5 sm:py-4 text-sm font-semibold transition-all active:scale-95',
                  plan.featured
                    ? 'bg-white text-black hover:bg-white/90'
                    : 'bg-white/10 text-white hover:bg-white/20'
                ]"
              >
                {{ plan.name === 'Starter' ? 'Start Building' : 'Upgrade to ' + plan.name }}
              </button>
            </div>
          </div>

          <!-- Enterprise -->
          <div
            class="mt-10 rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h3 class="text-lg sm:text-xl font-bold">Enterprise</h3>
              <p class="text-sm text-white/50">
                For large companies that require additional security and control.
              </p>
            </div>

            <button
              class="w-full sm:w-auto rounded-full border border-white/20 px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
            >
              Contact Sales
            </button>
          </div>
          </template>
          <template v-else>
            <div class="flex flex-col items-center justify-center text-center py-24 sm:py-32">
              <span class="mb-4 inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-semibold text-white/60 tracking-wider">
                COMING SOON
              </span>

              <h2 class="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
                Pricing launching soon
              </h2>

              <p class="text-white/50 max-w-md text-base sm:text-lg">
                We’re finalizing our pricing model.  
                Sign up now to get early access and updates.
              </p>

              <button
                class="mt-8 rounded-full bg-white text-black px-8 py-3 text-sm font-semibold hover:bg-white/90 transition"
                @click="openMail"
              >
                Join Early Access
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </Transition>
      <ModulesDialog
      :open="isModulesOpen"
      :modules="selectedModules"
      :plan-name="selectedPlanName"
      @close="isModulesOpen = false"
    />
</template>


<style scoped>
/* Hide scrollbar inside pricing modal only */
.hide-modal-scroll {
  scrollbar-width: none;       /* Firefox */
  -ms-overflow-style: none;    /* IE / Edge */
}

.hide-modal-scroll::-webkit-scrollbar {
  display: none;               /* Chrome / Safari */
}

.modal-enter-active, .modal-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}
</style>
