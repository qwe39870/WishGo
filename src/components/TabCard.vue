<template>
  <RouterLink
    :to="to"
    class="block bg-white border border-pink-200 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:border-pink-400"
  >
    <h3 class="text-lg font-semibold text-pink-500 mb-2">{{ title }}</h3>
    <p class="text-gray-600 text-sm">{{ desc }}</p>
    <span class="block mt-4 text-pink-400 text-sm font-medium hover:underline">
      前往查看 →
    </span>
  </RouterLink>
</template>

<script setup>
defineProps({
  title: String,
  desc: String,
  to: String
})
</script>

<style scoped>
/* 可視需要額外加點卡片 hover 動畫或圖案 */
</style>
