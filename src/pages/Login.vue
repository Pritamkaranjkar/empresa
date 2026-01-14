<template>
  <!-- Backdrop -->
 <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xl px-4"
    @click.self="$emit('close')"
  >

    <!-- Modal -->
    <div
      class="relative w-full max-w-md rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-200"
    >
      <!-- Header -->
      <div class="px-8 pt-8 pb-6 border-b border-gray-100">
        <router-link
          to="/"
          class="block text-2xl font-semibold tracking-tight text-gray-900"
        >
          Empresa
        </router-link>
        <p class="mt-2 text-sm text-gray-500">
          Sign in to continue
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="submit" class="px-8 py-6 space-y-5">
        <!-- Email -->
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            v-model="email"
            type="email"
            autocomplete="username"
            placeholder="name@company.com"
            class="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition"
            required
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">
            Password
          </label>

          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="••••••••"
              class="w-full rounded-xl border border-gray-300 px-4 py-3 pr-11 text-gray-900 placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition"
              required
            />

            <!-- Eye Button -->
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-700 transition"
              tabindex="-1"
            >
              <!-- Eye Open -->
              <svg
                v-if="!showPassword"
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>

              <!-- Eye Off -->
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 3l18 18M10.584 10.586A2 2 0 0012 14a2 2 0 001.414-.586M9.88 9.88A3 3 0 0115 12m4.542 0C18.268 16.057 14.478 19 10 19a9.77 9.77 0 01-4.772-1.243M6.227 6.227C7.772 5.468 9.854 5 12 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-1.357 2.568"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Error -->
        <p
          v-if="errorMessage"
          class="text-sm text-red-600 font-medium text-center"
        >
          {{ errorMessage }}
        </p>

        <!-- Forgot -->
        <div class="text-right">
          <a
            href="#"
            class="text-xs font-medium text-gray-600 hover:text-gray-900 transition"
          >
            Forgot password?
          </a>
        </div>

        <!-- Button -->
        <button
          type="submit"
          :disabled="auth.loading"
          class="w-full rounded-xl bg-black py-3 text-sm font-medium text-white
                 hover:bg-gray-900 active:scale-[0.99]
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-all"
        >
          {{ auth.loading ? 'Signing in…' : 'Sign In' }}
        </button>
      </form>

      <!-- Footer -->
      <div class="px-8 pb-8 text-center">
        <p class="text-xs text-gray-500">
          Don’t have an account?
          <button
            class="font-medium text-gray-900 hover:underline"
            @click="switchToRegister"
          >
            Create one
          </button>
        </p>

        <p class="mt-4 text-[11px] text-gray-400 leading-relaxed">
          By continuing, you agree to our
          <a class="underline hover:text-gray-600" href="#">Terms</a>
          &
          <a class="underline hover:text-gray-600" href="#">Privacy Policy</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store/auth';

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const auth = useAuthStore();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const emit = defineEmits(['close', 'open-register'])

const switchToRegister = () => {
  emit('close')
  emit('open-register')
}
const showPassword = ref(false)

const submit = async () => {
  errorMessage.value = '';
  if (!email.value || !password.value) return;

  try {
    await auth.login(email.value, password.value);

    const planId = localStorage.getItem('selectedPlanId');

    if (planId) {
      // localStorage.removeItem('selectedPlanId');
      emit('close');

      router.push({
        path: '/owner/subscription',
        query: { planId }
      });
    }
  } catch (err) {
    if (err.response && err.response.status === 400) {
      errorMessage.value = 'Credentials not correct.';
    } else if (err.response && err.response.status === 401) {
      errorMessage.value = 'Invalid email or password.';
    } else {
      errorMessage.value = 'Something went wrong. Please try again.';
    }
  }
};
</script>
