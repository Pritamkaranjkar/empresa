<template>
  <!-- Backdrop -->
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xl px-4"
    @click.self="$emit('close')"
  >
    <!-- Modal -->
    <div
      class="relative w-full max-w-md rounded-2xl bg-white
             shadow-[0_20px_60px_rgba(0,0,0,0.15)]
             border border-gray-200"
    >
      <!-- Header -->
      <div class="px-8 pt-8 pb-6 border-b border-gray-100">
        <div class="text-2xl font-semibold tracking-tight text-gray-900">
          Empresa
        </div>
        <p class="mt-2 text-sm text-gray-500">
          Create your account
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="submit" class="px-8 py-6 space-y-5">
        <input v-model="form.name" type="text" placeholder="Full name"
          class="input" required />

        <input v-model="form.email" type="email" placeholder="Email address"
          class="input" required />

        <input v-model="form.orgName" type="text" placeholder="Organization name"
          class="input" required />

        <div class="relative">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            class="input pr-11"
            required
          />

          <!-- Eye Toggle -->
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-700 transition"
            tabindex="-1"
          >
            <!-- Eye -->
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


        <!-- Terms -->
        <label class="flex gap-3 text-sm text-gray-600">
          <input v-model="form.acceptedTerms" type="checkbox" required />
          I agree to the
          <button type="button" @click="dialogVisible = true"
            class="underline font-medium">
            Terms & Conditions
          </button>
        </label>

        <button
          type="submit"
          :disabled="auth.loading || !form.acceptedTerms"
          class="w-full rounded-xl bg-black py-3 text-sm font-medium text-white
                 hover:bg-gray-900 transition disabled:opacity-50"
        >
          {{ auth.loading ? 'Creating…' : 'Create Account' }}
        </button>
      </form>

      <!-- Footer -->
      <div class="px-8 pb-8 text-center">
        <p class="text-xs text-gray-500">
          Already have an account?
          <button
            class="font-medium text-gray-900 hover:underline"
            @click="switchToLogin"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
    <!-- Terms Dialog -->
    <el-dialog
      v-model="dialogVisible"
      width="auto"
      align-center
      append-to-body
      class="rounded-2xl"
    >
      <Terms />
    </el-dialog>
  </div>

  <!-- Terms dialog stays EXACTLY SAME -->
</template>
<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../store/auth'
import Terms from '../pages/Terms.vue' // adjust path if needed

defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'open-login'])

const auth = useAuthStore()
const dialogVisible = ref(false)
const showPassword = ref(false)

const form = ref({
  name: '',
  email: '',
  password: '',
  orgName: '',
  acceptedTerms: false
})

const submit = async () => {
  await auth.register(form.value)
}

const switchToLogin = () => {
  emit('close')
  emit('open-login')
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  font-size: 14px;
}
.input:focus {
  outline: none;
  border-color: #9ca3af;
  box-shadow: 0 0 0 2px rgba(0,0,0,0.08);
}
</style>
