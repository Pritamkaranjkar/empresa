<template>
  <transition name="apple-fade">
    <div
      v-if="show"
      class="fixed top-10 left-1/2 transform -translate-x-1/2 z-[9999]
             px-8 py-4 rounded-2xl text-center select-none
             bg-[#e5e5e5] border border-[#d1d1d1]
             shadow-[0_8px_24px_rgba(0,0,0,0.15)]
             min-w-[280px] max-w-[400px]"
    >
      <div class="flex items-center justify-center gap-3">
        <span
          :class="[
            'inline-block w-2.5 h-2.5 rounded-full',
            typeDot
          ]"
        ></span>
        <p class="text-black text-[16px] font-medium tracking-wide leading-snug">
          {{ message }}
        </p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: String,
  type: { type: String, default: 'success' },
  show: Boolean
})

const typeDot = computed(() => {
  switch (props.type) {
    case 'error':
      return 'bg-red-500'
    case 'info':
      return 'bg-blue-500'
    case 'warning':
      return 'bg-yellow-500'
    default:
      return 'bg-green-500'
  }
})
</script>

<style scoped>
.apple-fade-enter-active,
.apple-fade-leave-active {
  transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}

.apple-fade-enter-from {
  opacity: 0;
  transform: translate(-50%, -25px) scale(0.96);
}

.apple-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -15px) scale(0.96);
}
</style>
