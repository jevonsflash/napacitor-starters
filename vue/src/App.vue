<script setup>
import { Napacitor } from '@napacitor/core';
import './App.css';
import DeviceCard from './components/DeviceCard.vue';
import ClipboardCard from './components/ClipboardCard.vue';
import HapticsCard from './components/HapticsCard.vue';
import ShareCard from './components/ShareCard.vue';
import BatteryCard from './components/BatteryCard.vue';

const platform = Napacitor.getPlatform();
const native = Napacitor.isNativePlatform();
</script>

<template>
  <main class="app">
    <header class="app-header">
      <img src="/napacitor.svg" class="logo" alt="Napacitor" />
      <div>
        <h1>Napacitor Vue Starter</h1>
        <p class="subtitle">Capacitor 式工作流,.NET MAUI Blazor 原生宿主</p>
      </div>
      <span class="badge" :class="{ native }">
        {{ platform }}{{ native ? ' · native' : ' · web' }}
      </span>
    </header>

    <div class="grid">
      <DeviceCard />
      <ClipboardCard />
      <HapticsCard />
      <ShareCard />
      <BatteryCard />
    </div>

    <footer class="app-footer">
      core version <code>{{ Napacitor.version }}</code> · bridge platform
      <code>{{ platform }}</code>
    </footer>
  </main>
</template>
