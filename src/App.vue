<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from './store/auth'
import { useRoute } from 'vue-router'
import Loader from './components/Loader.vue'
import Toast from './components/Toast.vue'
import { toast } from '../src/store/toast'

const auth = useAuthStore()
const route = useRoute()
const loading = ref(true)

onMounted(async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken')
    if (refreshToken) {
      // await auth.refreshToken()
    } else {
      console.log('No refresh token found — skipping silent login')
    }
  } catch (err) {
    console.warn('Silent refresh failed:', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div id="app">
    <Loader v-if="loading" />
    <router-view v-else />
    <Toast :message="toast.message" :type="toast.type" :show="toast.show" />
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background-color: #fafafa;
  color: #333;
}
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
