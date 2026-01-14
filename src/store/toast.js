// src/stores/toast.js
import { reactive } from 'vue'

export const toast = reactive({
  show: false,
  message: '',
  type: 'success'
})

export function showToast(message, type = 'success') {
  toast.message = message
  toast.type = type
  toast.show = true

  // Auto-hide after 3 seconds
  setTimeout(() => {
    toast.show = false
  }, 5000)
}
