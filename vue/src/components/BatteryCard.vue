<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import { Battery } from '@napacitor/battery';
import AppCard from './AppCard.vue';
import ErrorBar from './ErrorBar.vue';
import { useSafeCall } from '../composables/useSafeCall';

const { run, error } = useSafeCall();
const info = ref(null);
const listening = ref(false);
const events = ref(0);
// PluginListenerHandle 不参与渲染,普通变量即可(对应 React 版的 useRef)
let handle = null;

const refresh = () =>
  run('Battery.getBatteryInfo', async () => {
    info.value = await Battery.getBatteryInfo();
  });

const toggle = () =>
  run(
    listening.value ? 'Battery.removeListener' : 'Battery.addListener',
    async () => {
      if (listening.value) {
        await handle?.remove();
        handle = null;
        listening.value = false;
      } else {
        handle = await Battery.addListener('batteryStatusChange', (i) => {
          info.value = i;
          events.value++;
        });
        listening.value = true;
      }
    },
  );

// 组件卸载时移除监听(handle.remove 对应 Capacitor 的 PluginListenerHandle)
onBeforeUnmount(() => handle?.remove());

const level = computed(() => Math.round((info.value?.batteryLevel ?? 0) * 100));
</script>

<template>
  <AppCard title="Battery" subtitle="getBatteryInfo / addListener('batteryStatusChange')">
    <div class="row">
      <button @click="refresh">读取电量</button>
      <button :class="listening ? 'danger' : 'ghost'" @click="toggle">
        {{ listening ? `停止监听(已收 ${events} 次)` : '开始监听' }}
      </button>
    </div>
    <div v-if="info" class="battery">
      <div class="battery-shell">
        <div
          class="battery-level"
          :class="{ charging: info.isCharging }"
          :style="{ width: level + '%' }"
        />
      </div>
      <span>
        {{ level }}% {{ info.isCharging ? '⚡充电中' : '🔋电池供电' }}
      </span>
    </div>
    <ErrorBar :message="error" />
  </AppCard>
</template>
