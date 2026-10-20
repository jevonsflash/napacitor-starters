/**
 * Napacitor 演示入口:window.Napacitor 由原生桥(napacitor-native-bridge.js)注入,
 * 此处直接 registerPlugin 取各插件的原生实现 —— JS ⇄ C# 全链路演示。
 */
const nap = window.Napacitor;
const Device = nap.registerPlugin('Device');
const Battery = nap.registerPlugin('Battery');
const Clipboard = nap.registerPlugin('Clipboard');
const Share = nap.registerPlugin('Share');
const Haptics = nap.registerPlugin('Haptics');

const $ = (id) => document.getElementById(id);
const setStatus = (msg) => { $('status').textContent = msg; };
const row = (k, v) => `<div class="row"><span>${k}</span><b>${v}</b></div>`;

function renderDevice(info, lang, locale) {
  $('device-info').innerHTML =
    row('platform', info.platform) +
    row('model', info.model) +
    row('manufacturer', info.manufacturer) +
    row('osVersion', info.osVersion) +
    row('isVirtual', String(info.isVirtual)) +
    row('languageCode', lang.value) +
    row('locale', locale.value);
}

function renderBattery(info) {
  const pct = Math.round((info.batteryLevel ?? 0) * 100);
  $('battery').innerHTML =
    row('batteryLevel', pct + '%') +
    row('isCharging', String(info.isCharging)) +
    '<div class="hint">电池状态经 batteryStatusChange 事件实时推送</div>';
}

async function main() {
  setStatus('运行时平台:' + nap.getPlatform());

  const [info, lang, locale] = await Promise.all([
    Device.getInfo(),
    Device.getLanguageCode(),
    Device.getLocale(),
  ]);
  renderDevice(info, lang, locale);

  const bat = await Battery.getBatteryInfo();
  renderBattery(bat);
  await Battery.addListener('batteryStatusChange', (data) => {
    renderBattery(data);
    setStatus('收到 batteryStatusChange 事件推送');
  });

  $('copy-btn').onclick = async () => {
    await Clipboard.write({
      string: '来自 Napacitor 的问候(' + new Date().toLocaleTimeString() + ')',
    });
    setStatus('已写入剪贴板');
  };
  $('read-btn').onclick = async () => {
    const { value } = await Clipboard.read();
    setStatus('剪贴板内容:' + value);
  };
  $('share-btn').onclick = async () => {
    const { canShare } = await Share.canShare();
    if (!canShare) {
      setStatus('当前平台不支持分享');
      return;
    }
    await Share.share({ title: 'Napacitor Demo', text: '用 Web 技术构建的原生应用' });
    setStatus('分享面板已弹出');
  };
  $('vibrate-btn').onclick = async () => {
    await Haptics.vibrate({ duration: 40 });
    setStatus('已触发震动(模拟器上为无操作)');
  };
}

main().catch((err) => setStatus('出错:' + (err && err.message)));
