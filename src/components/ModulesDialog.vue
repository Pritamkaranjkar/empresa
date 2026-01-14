<script setup>
defineProps({
  open: Boolean,
  modules: {
    type: Array,
    default: () => []
  },
  planName: String
})

defineEmits(['close'])
</script>

<template>
  <Transition name="fade-scale">
    <div
      v-if="open"
      class="fixed inset-0 z-[4000] flex items-center justify-center px-4"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/50 backdrop-blur-xl"
        @click="$emit('close')"
      />

      <!-- Modal -->
      <div
        class="relative w-full max-w-md rounded-[28px] bg-white px-7 py-8 sm:px-9 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]"
      >
        <!-- Header -->
        <div class="mb-7 flex items-start justify-between">
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-black/40">
              Subscription
            </p>
            <h3
              class="mt-1 text-[22px] font-semibold tracking-tight text-black"
            >
              {{ planName }} Modules
            </h3>
          </div>

          <button
            @click="$emit('close')"
            class="flex h-8 w-8 items-center justify-center rounded-full text-black/40 hover:bg-black/5 hover:text-black transition"
          >
            ✕
          </button>
        </div>

        <!-- Modules -->
        <ul class="space-y-4">
          <li
            v-for="(m, i) in modules"
            :key="i"
            class="flex items-start gap-3 text-[15px] leading-relaxed text-black/70"
          >
            <svg
              class="mt-0.5 h-5 w-5 shrink-0 text-emerald-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <span>{{ m }}</span>
          </li>
        </ul>

        <!-- CTA -->
        <button
          class="mt-9 w-full rounded-full bg-black py-3.5 text-sm font-semibold tracking-wide text-white transition hover:bg-black/90 active:scale-[0.98]"
          @click="$emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Apple-like subtle motion */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.22s ease, transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.96) translateY(6px);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
</style>
