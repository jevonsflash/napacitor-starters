<script setup>
import { ref } from 'vue';
import { Share } from '@napacitor/share';
import AppCard from './AppCard.vue';
import ErrorBar from './ErrorBar.vue';
import { useSafeCall } from '../composables/useSafeCall';

const { run, error } = useSafeCall();
const canShare = ref(null);
const title = ref('Napacitor');
const text = ref('来自 Napacitor Vue Starter 的分享');
const url = ref('');

const check = () =>
  run('Share.canShare', async () => {
    const r = await Share.canShare();
    canShare.value = r.canShare;
  });

const share = () =>
  run('Share.share', () =>
    Share.share({
      title: title.value,
      text: text.value,
      url: url.value || undefined,
      dialogTitle: '分享到…',
    }),
  );
</script>

<template>
  <AppCard title="Share" subtitle="canShare / share">
    <div class="stack">
      <input v-model="title" placeholder="title" />
      <input v-model="text" placeholder="text" />
      <input v-model="url" placeholder="url(可选)" />
    </div>
    <div class="row">
      <button @click="share">系统分享</button>
      <button class="ghost" @click="check">canShare()</button>
    </div>
    <p v-if="canShare !== null" class="result">
      canShare = <code>{{ String(canShare) }}</code>
    </p>
    <ErrorBar :message="error" />
  </AppCard>
</template>
