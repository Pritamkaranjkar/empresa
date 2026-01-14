<template>
  <div class="p-8 bg-white min-h-screen">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">👤 User Profile</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
      <div><strong>Name:</strong> {{ auth.user?.name }}</div>
      <div><strong>Email:</strong> {{ auth.user?.email }}</div>
      <div><strong>Role:</strong> {{ auth.user?.role }}</div>
      <div><strong>Created At:</strong> {{ formatDate(auth.user?.createdAt) }}</div>
    </div>

    <div class="mt-10">
      <el-button type="danger" @click="logout">Logout</el-button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../store/auth';
const auth = useAuthStore();

const logout = () => {
  auth.logout();
  window.location.href = '/'; // redirect after logout
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString();
};
</script>

<style scoped>
div {
  font-family: 'Inter', sans-serif;
}
</style>
