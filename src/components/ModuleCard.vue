<template>
  <el-card class="module-card" shadow="hover">
    <h3>{{ module.name }}</h3>
    <p>{{ module.desc }}</p>
  </el-card>
</template>

<script setup>
defineProps({ module: Object });
</script>

<style>
.module-card { width: 200px; text-align: center; }
</style>
