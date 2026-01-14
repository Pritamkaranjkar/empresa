<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl shadow-xl w-[90%] max-w-sm p-6 text-center">
        <h2 class="text-lg font-semibold text-gray-800 mb-3">⚠️ {{ title }}</h2>
        <p class="text-gray-600 mb-6">{{ message }}</p>

        <div class="flex justify-center gap-4">
          <button
            @click="$emit('cancel')"
            class="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            @click="$emit('confirm')"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  visible: Boolean,
  title: { type: String, default: 'Confirm Delete' },
  message: { type: String, default: 'Are you sure you want to delete this item?' }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
