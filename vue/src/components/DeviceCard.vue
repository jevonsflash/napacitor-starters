<script setup>
import { ref } from 'vue';
import { Device } from '@napacitor/device';
import AppCard from './AppCard.vue';
import ErrorBar from './ErrorBar.vue';
import { useSafeCall } from '../composables/useSafeCall';

const { run, error } = useSafeCall();
const info = ref(null);
const lang = ref('');
const locale = ref('');

const loadAll = () =>
  run('Device.getInfo', async () => {
    const [i, l, loc] = await Promise.all([
      Device.getInfo(),
      Device.getLanguageCode(),
      Device.getLocale(),
    ]);
    info.value = i;
    lang.value = l.value;
    locale.value = loc.value;
  });
</script>

<template>
  <AppCard title="Device" subtitle="getInfo / getLanguageCode / getLocale">
    <button @click="loadAll">读取设备信息</button>
    <dl v-if="info" class="kv">
      <dt>model</dt>
      <dd>{{ info.model }}</dd>
      <dt>platform</dt>
      <dd>{{ info.platform }}</dd>
      <dt>osVersion</dt>
      <dd>{{ info.osVersion }}</dd>
      <dt>manufacturer</dt>
      <dd>{{ info.manufacturer }}</dd>
      <dt>isVirtual</dt>
      <dd>{{ String(info.isVirtual) }}</dd>
      <dt>language / locale</dt>
      <dd>{{ lang }} / {{ locale }}</dd>
    </dl>
    <ErrorBar :message="error" />
  </AppCard>
</template>
