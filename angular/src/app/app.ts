import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Napacitor } from '@napacitor/core';
import { BatteryCard } from './battery-card';
import { ClipboardCard } from './clipboard-card';
import { DeviceCard } from './device-card';
import { HapticsCard } from './haptics-card';
import { ShareCard } from './share-card';

@Component({
  selector: 'app-root',
  imports: [DeviceCard, ClipboardCard, HapticsCard, ShareCard, BatteryCard],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly platform = Napacitor.getPlatform();
  protected readonly native = Napacitor.isNativePlatform();
  protected readonly coreVersion = Napacitor.version;
}
