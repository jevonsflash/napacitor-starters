<script setup>
import { Haptics, ImpactStyle, NotificationType } from '@napacitor/haptics';
import AppCard from './AppCard.vue';
import ErrorBar from './ErrorBar.vue';
import { useSafeCall } from '../composables/useSafeCall';

const { run, error } = useSafeCall();
const impactStyles = Object.values(ImpactStyle);
const notificationTypes = Object.values(NotificationType);
</script>

<template>
  <AppCard title="Haptics" subtitle="impact / notification / vibrate / selection">
    <div class="row">
      <button
        v-for="s in impactStyles"
        :key="s"
        @click="run(`Haptics.impact(${s})`, () => Haptics.impact({ style: s }))"
      >
        impact {{ s }}
      </button>
    </div>
    <div class="row">
      <button
        v-for="t in notificationTypes"
        :key="t"
        class="ghost"
        @click="run(`Haptics.notification(${t})`, () => Haptics.notification({ type: t }))"
      >
        notification {{ t }}
      </button>
      <button
        class="ghost"
        @click="run('Haptics.vibrate', () => Haptics.vibrate({ duration: 300 }))"
      >
        vibrate 300ms
      </button>
      <button class="ghost" @click="run('Haptics.selection', () => Haptics.selection())">
        selection
      </button>
    </div>
    <p class="hint">触觉反馈在真机上有感;Windows/桌面端多数为 no-op。</p>
    <ErrorBar :message="error" />
  </AppCard>
</template>
