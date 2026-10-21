<script setup>
import { ref } from 'vue';
import { Clipboard } from '@napacitor/clipboard';
import AppCard from './AppCard.vue';
import ErrorBar from './ErrorBar.vue';
import { useSafeCall } from '../composables/useSafeCall';

const { run, error } = useSafeCall();
const text = ref('Hello Napacitor!');
const readBack = ref('');
const copied = ref(false);

const write = () =>
  run('Clipboard.write', async () => {
    await Clipboard.write({ string: text.value });
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
  });

const read = () =>
  run('Clipboard.read', async () => {
    const r = await Clipboard.read();
    readBack.value = r.value;
  });
</script>

<template>
  <AppCard title="Clipboard" subtitle="write / read">
    <div class="row">
      <input v-model="text" placeholder="要复制的文本" />
      <button @click="write">{{ copied ? '已复制 ✓' : '写入剪贴板' }}</button>
      <button class="ghost" @click="read">读取剪贴板</button>
    </div>
    <p v-if="readBack" class="result">
      剪贴板内容:<code>{{ readBack }}</code>
    </p>
    <ErrorBar :message="error" />
  </AppCard>
</template>
