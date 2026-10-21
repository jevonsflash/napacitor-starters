import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Share } from '@napacitor/share';
import { Card } from './card';
import { ErrorBar } from './error-bar';
import { createSafeCall } from './safe-call';

@Component({
  selector: 'app-share-card',
  imports: [Card, ErrorBar, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-card title="Share" subtitle="canShare / share">
      <div class="stack">
        <input [(ngModel)]="title" placeholder="title" />
        <input [(ngModel)]="text" placeholder="text" />
        <input [(ngModel)]="url" placeholder="url(可选)" />
      </div>
      <div class="row">
        <button (click)="share()">系统分享</button>
        <button class="ghost" (click)="check()">canShare()</button>
      </div>
      @if (canShare() !== null) {
        <p class="result">
          canShare = <code>{{ toStr(canShare()) }}</code>
        </p>
      }
      <app-error-bar [message]="error()" />
    </app-card>
  `,
})
export class ShareCard {
  private readonly safe = createSafeCall();
  protected readonly error = this.safe.error;
  protected readonly canShare = signal<boolean | null>(null);
  protected readonly title = signal('Napacitor');
  protected readonly text = signal('来自 Napacitor Angular Starter 的分享');
  protected readonly url = signal('');

  protected check(): void {
    this.safe.run('Share.canShare', async () => {
      const r = await Share.canShare();
      this.canShare.set(r.canShare);
    });
  }

  protected share(): void {
    this.safe.run('Share.share', () =>
      Share.share({
        title: this.title(),
        text: this.text(),
        url: this.url() || undefined,
        dialogTitle: '分享到…',
      }));
  }

  protected toStr(value: boolean | null): string {
    return String(value);
  }
}
