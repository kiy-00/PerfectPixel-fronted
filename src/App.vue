<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <!-- 主容器，占据全宽 -->
  <div class="w-full">
    <!-- 页面头部 -->
    <header class="max-h-screen lg:flex lg:items-center lg:pr-8"></header>

    <!-- 路由视图 -->
    <RouterView />
  </div>
</template>

<style>
/* 基础样式 */
body {
  margin: 0;
  padding: 0;
  width: 100%;
}

header {
  line-height: 1.5;
  max-height: 100vh;
  width: 100%;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
