<script setup>
defineProps({
  /** 错误信息,空串时不渲染 */
  message: { type: String, default: '' },
});
</script>

<template>
  <p v-if="message" class="error">⚠ {{ message }}</p>
</template>
