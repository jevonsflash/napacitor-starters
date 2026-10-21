import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  signal,
} from '@angular/core';
import { Battery } from '@napacitor/battery';
import type { BatteryInfo } from '@napacitor/battery';
import type { PluginListenerHandle } from '@napacitor/core';
import { Card } from './card';
import { ErrorBar } from './error-bar';
import { createSafeCall } from './safe-call';

@Component({
  selector: 'app-battery-card',
  imports: [Card, ErrorBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-card
      title="Battery"
      subtitle="getBatteryInfo / addListener('batteryStatusChange')"
    >
      <div class="row">
        <button (click)="refresh()">读取电量</button>
        <button [class]="listening() ? 'danger' : 'ghost'" (click)="toggle()">
          {{ listening() ? '停止监听(已收 ' + events() + ' 次)' : '开始监听' }}
        </button>
      </div>
      @if (info(); as i) {
        <div class="battery">
          <div class="battery-shell">
            <div
              class="battery-level"
              [class.charging]="i.isCharging"
              [style.width.%]="level()"
            ></div>
          </div>
          <span>{{ level() }}% {{ i.isCharging ? '⚡充电中' : '🔋电池供电' }}</span>
        </div>
      }
      <app-error-bar [message]="error()" />
    </app-card>
  `,
})
export class BatteryCard implements OnDestroy {
  private readonly safe = createSafeCall();
  protected readonly error = this.safe.error;
  protected readonly info = signal<BatteryInfo | null>(null);
  protected readonly listening = signal(false);
  protected readonly events = signal(0);
  /** PluginListenerHandle 不参与渲染,普通属性即可(对应 React 版的 useRef)。 */
  private handle: PluginListenerHandle | null = null;

  protected readonly level = computed(() =>
    Math.round((this.info()?.batteryLevel ?? 0) * 100));

  protected refresh(): void {
    this.safe.run('Battery.getBatteryInfo', async () => {
      this.info.set(await Battery.getBatteryInfo());
    });
  }

  protected toggle(): void {
    this.safe.run(
      this.listening() ? 'Battery.removeListener' : 'Battery.addListener',
      async () => {
        if (this.listening()) {
          await this.handle?.remove();
          this.handle = null;
          this.listening.set(false);
        } else {
          this.handle = await Battery.addListener(
            'batteryStatusChange',
            (i: BatteryInfo) => {
              this.info.set(i);
              this.events.set(this.events() + 1);
            },
          );
          this.listening.set(true);
        }
      },
    );
  }

  /** 组件销毁时移除监听(handle.remove 对应 Capacitor 的 PluginListenerHandle)。 */
  ngOnDestroy(): void {
    void this.handle?.remove();
  }
}
