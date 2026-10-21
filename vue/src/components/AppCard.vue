<script setup>
defineProps({
  /** 卡片标题(插件名) */
  title: { type: String, required: true },
  /** 副标题(演示的 API 列表) */
  subtitle: { type: String, default: '' },
});
</script>

<template>
  <section class="card">
    <header>
      <h2>{{ title }}</h2>
      <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
    </header>
    <slot />
  </section>
</template>
