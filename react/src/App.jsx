import { useEffect, useRef, useState } from 'react';
import { Napacitor } from '@napacitor/core';
import { Device } from '@napacitor/device';
import { Clipboard } from '@napacitor/clipboard';
import { Haptics, ImpactStyle, NotificationType } from '@napacitor/haptics';
import { Share } from '@napacitor/share';
import { Battery } from '@napacitor/battery';
import './App.css';

/** 错误提示条(插件抛出的 NapacitorException 在这里展示)。 */
function ErrorBar({ message }) {
  if (!message) return null;
  return <p className="error">⚠ {message}</p>;
}

/** 把插件调用包成安全调用:异常落入错误条而不是崩掉页面。 */
function useSafeCall() {
  const [error, setError] = useState('');
  const run = async (label, action) => {
    setError('');
    try {
      return await action();
    } catch (err) {
      setError(`${label}: ${err?.message ?? err}`);
      return undefined;
    }
  };
  return [run, <ErrorBar message={error} />];
}

function Card({ title, subtitle, children }) {
  return (
    <section className="card">
      <header>
        <h2>{title}</h2>
        {subtitle && <p className="subtitle">{subtitle}</p>}
      </header>
      {children}
    </section>
  );
}

function DeviceCard() {
  const [run, errorBar] = useSafeCall();
  const [info, setInfo] = useState(null);
  const [lang, setLang] = useState('');
  const [locale, setLocale] = useState('');

  const loadAll = () =>
    run('Device.getInfo', async () => {
      const [i, l, loc] = await Promise.all([
        Device.getInfo(),
        Device.getLanguageCode(),
        Device.getLocale(),
      ]);
      setInfo(i);
      setLang(l.value);
      setLocale(loc.value);
    });

  return (
    <Card title="Device" subtitle="getInfo / getLanguageCode / getLocale">
      <button onClick={loadAll}>读取设备信息</button>
      {info && (
        <dl className="kv">
          <dt>model</dt>
          <dd>{info.model}</dd>
          <dt>platform</dt>
          <dd>{info.platform}</dd>
          <dt>osVersion</dt>
          <dd>{info.osVersion}</dd>
          <dt>manufacturer</dt>
          <dd>{info.manufacturer}</dd>
          <dt>isVirtual</dt>
          <dd>{String(info.isVirtual)}</dd>
          <dt>language / locale</dt>
          <dd>
            {lang} / {locale}
          </dd>
        </dl>
      )}
      {errorBar}
    </Card>
  );
}

function ClipboardCard() {
  const [run, errorBar] = useSafeCall();
  const [text, setText] = useState('Hello Napacitor!');
  const [readBack, setReadBack] = useState('');
  const [copied, setCopied] = useState(false);

  const write = () =>
    run('Clipboard.write', async () => {
      await Clipboard.write({ string: text });
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });

  const read = () =>
    run('Clipboard.read', async () => {
      const r = await Clipboard.read();
      setReadBack(r.value);
    });

  return (
    <Card title="Clipboard" subtitle="write / read">
      <div className="row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="要复制的文本"
        />
        <button onClick={write}>{copied ? '已复制 ✓' : '写入剪贴板'}</button>
        <button className="ghost" onClick={read}>
          读取剪贴板
        </button>
      </div>
      {readBack && (
        <p className="result">
          剪贴板内容:<code>{readBack}</code>
        </p>
      )}
      {errorBar}
    </Card>
  );
}

function HapticsCard() {
  const [run, errorBar] = useSafeCall();
  return (
    <Card title="Haptics" subtitle="impact / notification / vibrate / selection">
      <div className="row">
        {Object.values(ImpactStyle).map((s) => (
          <button
            key={s}
            onClick={() =>
              run(`Haptics.impact(${s})`, () => Haptics.impact({ style: s }))
            }
          >
            impact {s}
          </button>
        ))}
      </div>
      <div className="row">
        {Object.values(NotificationType).map((t) => (
          <button
            key={t}
            className="ghost"
            onClick={() =>
              run(`Haptics.notification(${t})`, () =>
                Haptics.notification({ type: t }),
              )
            }
          >
            notification {t}
          </button>
        ))}
        <button
          className="ghost"
          onClick={() =>
            run('Haptics.vibrate', () => Haptics.vibrate({ duration: 300 }))
          }
        >
          vibrate 300ms
        </button>
        <button
          className="ghost"
          onClick={() => run('Haptics.selection', () => Haptics.selection())}
        >
          selection
        </button>
      </div>
      <p className="hint">触觉反馈在真机上有感;Windows/桌面端多数为 no-op。</p>
      {errorBar}
    </Card>
  );
}

function ShareCard() {
  const [run, errorBar] = useSafeCall();
  const [canShare, setCanShare] = useState(null);
  const [title, setTitle] = useState('Napacitor');
  const [text, setText] = useState('来自 Napacitor React Starter 的分享');
  const [url, setUrl] = useState('');

  const check = () =>
    run('Share.canShare', async () => {
      const r = await Share.canShare();
      setCanShare(r.canShare);
    });

  const share = () =>
    run('Share.share', () =>
      Share.share({ title, text, url: url || undefined, dialogTitle: '分享到…' }),
    );

  return (
    <Card title="Share" subtitle="canShare / share">
      <div className="stack">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="title" />
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="text" />
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="url(可选)" />
      </div>
      <div className="row">
        <button onClick={share}>系统分享</button>
        <button className="ghost" onClick={check}>
          canShare()
        </button>
      </div>
      {canShare !== null && (
        <p className="result">
          canShare = <code>{String(canShare)}</code>
        </p>
      )}
      {errorBar}
    </Card>
  );
}

function BatteryCard() {
  const [run, errorBar] = useSafeCall();
  const [info, setInfo] = useState(null);
  const [listening, setListening] = useState(false);
  const [events, setEvents] = useState(0);
  const handleRef = useRef(null);

  const refresh = () =>
    run('Battery.getBatteryInfo', async () => {
      setInfo(await Battery.getBatteryInfo());
    });

  const toggle = () =>
    run(
      listening ? 'Battery.removeListener' : 'Battery.addListener',
      async () => {
        if (listening) {
          await handleRef.current?.remove();
          handleRef.current = null;
          setListening(false);
        } else {
          handleRef.current = await Battery.addListener(
            'batteryStatusChange',
            (i) => {
              setInfo(i);
              setEvents((n) => n + 1);
            },
          );
          setListening(true);
        }
      },
    );

  // 组件卸载时移除监听(handle.remove 对应 Capacitor 的 PluginListenerHandle)
  useEffect(() => () => handleRef.current?.remove(), []);

  const level = Math.round((info?.batteryLevel ?? 0) * 100);

  return (
    <Card title="Battery" subtitle="getBatteryInfo / addListener('batteryStatusChange')">
      <div className="row">
        <button onClick={refresh}>读取电量</button>
        <button className={listening ? 'danger' : 'ghost'} onClick={toggle}>
          {listening ? `停止监听(已收 ${events} 次)` : '开始监听'}
        </button>
      </div>
      {info && (
        <div className="battery">
          <div className="battery-shell">
            <div
              className={'battery-level' + (info.isCharging ? ' charging' : '')}
              style={{ width: `${level}%` }}
            />
          </div>
          <span>
            {level}% {info.isCharging ? '⚡充电中' : '🔋电池供电'}
          </span>
        </div>
      )}
      {errorBar}
    </Card>
  );
}

export default function App() {
  const platform = Napacitor.getPlatform();
  const native = Napacitor.isNativePlatform();

  return (
    <main className="app">
      <header className="app-header">
        <img src="/napacitor.svg" className="logo" alt="Napacitor" />
        <div>
          <h1>Napacitor React Starter</h1>
          <p className="subtitle">Capacitor 式工作流,.NET MAUI Blazor 原生宿主</p>
        </div>
        <span className={'badge' + (native ? ' native' : '')}>
          {platform}
          {native ? ' · native' : ' · web'}
        </span>
      </header>

      <div className="grid">
        <DeviceCard />
        <ClipboardCard />
        <HapticsCard />
        <ShareCard />
        <BatteryCard />
      </div>

      <footer className="app-footer">
        core version <code>{Napacitor.version}</code> · bridge platform{' '}
        <code>{platform}</code>
      </footer>
    </main>
  );
}
