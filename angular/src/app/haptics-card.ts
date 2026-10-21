import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Haptics, ImpactStyle, NotificationType } from '@napacitor/haptics';
import { Card } from './card';
import { ErrorBar } from './error-bar';
import { createSafeCall } from './safe-call';

@Component({
  selector: 'app-haptics-card',
  imports: [Card, ErrorBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-card title="Haptics" subtitle="impact / notification / vibrate / selection">
      <div class="row">
        @for (s of impactStyles; track s) {
          <button (click)="impact(s)">impact {{ s }}</button>
        }
      </div>
      <div class="row">
        @for (t of notificationTypes; track t) {
          <button class="ghost" (click)="notification(t)">notification {{ t }}</button>
        }
        <button class="ghost" (click)="vibrate()">vibrate 300ms</button>
        <button class="ghost" (click)="selection()">selection</button>
      </div>
      <p class="hint">触觉反馈在真机上有感;Windows/桌面端多数为 no-op。</p>
      <app-error-bar [message]="error()" />
    </app-card>
  `,
})
export class HapticsCard {
  private readonly safe = createSafeCall();
  protected readonly error = this.safe.error;
  protected readonly impactStyles = Object.values(ImpactStyle);
  protected readonly notificationTypes = Object.values(NotificationType);

  protected impact(style: string): void {
    this.safe.run(`Haptics.impact(${style})`, () =>
      Haptics.impact({ style: style as ImpactStyle }));
  }

  protected notification(type: string): void {
    this.safe.run(`Haptics.notification(${type})`, () =>
      Haptics.notification({ type: type as NotificationType }));
  }

  protected vibrate(): void {
    this.safe.run('Haptics.vibrate', () => Haptics.vibrate({ duration: 300 }));
  }

  protected selection(): void {
    this.safe.run('Haptics.selection', () => Haptics.selection());
  }
}
