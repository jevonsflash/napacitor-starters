import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Device } from '@napacitor/device';
import type { DeviceInfo } from '@napacitor/device';
import { Card } from './card';
import { ErrorBar } from './error-bar';
import { createSafeCall } from './safe-call';

@Component({
  selector: 'app-device-card',
  imports: [Card, ErrorBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-card title="Device" subtitle="getInfo / getLanguageCode / getLocale">
      <button (click)="loadAll()">读取设备信息</button>
      @if (info(); as i) {
        <dl class="kv">
          <dt>model</dt>
          <dd>{{ i.model }}</dd>
          <dt>platform</dt>
          <dd>{{ i.platform }}</dd>
          <dt>osVersion</dt>
          <dd>{{ i.osVersion }}</dd>
          <dt>manufacturer</dt>
          <dd>{{ i.manufacturer }}</dd>
          <dt>isVirtual</dt>
          <dd>{{ toStr(i.isVirtual) }}</dd>
          <dt>language / locale</dt>
          <dd>{{ lang() }} / {{ locale() }}</dd>
        </dl>
      }
      <app-error-bar [message]="error()" />
    </app-card>
  `,
})
export class DeviceCard {
  private readonly safe = createSafeCall();
  protected readonly error = this.safe.error;
  protected readonly info = signal<DeviceInfo | null>(null);
  protected readonly lang = signal('');
  protected readonly locale = signal('');

  protected loadAll(): void {
    this.safe.run('Device.getInfo', async () => {
      const [i, l, loc] = await Promise.all([
        Device.getInfo(),
        Device.getLanguageCode(),
        Device.getLocale(),
      ]);
      this.info.set(i);
      this.lang.set(l.value);
      this.locale.set(loc.value);
    });
  }

  protected toStr(value: boolean): string {
    return String(value);
  }
}
