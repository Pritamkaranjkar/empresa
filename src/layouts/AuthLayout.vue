<template>
  <div class="auth-layout">
    <div class="auth-box">
      <slot />
    </div>
  </div>
</template>

<style>
.auth-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f2f2f2;
}
.auth-box {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
</style>
