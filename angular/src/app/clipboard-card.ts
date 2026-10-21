import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Clipboard } from '@napacitor/clipboard';
import { Card } from './card';
import { ErrorBar } from './error-bar';
import { createSafeCall } from './safe-call';

@Component({
  selector: 'app-clipboard-card',
  imports: [Card, ErrorBar, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-card title="Clipboard" subtitle="write / read">
      <div class="row">
        <input [(ngModel)]="text" placeholder="要复制的文本" />
        <button (click)="write()">{{ copied() ? '已复制 ✓' : '写入剪贴板' }}</button>
        <button class="ghost" (click)="read()">读取剪贴板</button>
      </div>
      @if (readBack()) {
        <p class="result">
          剪贴板内容:<code>{{ readBack() }}</code>
        </p>
      }
      <app-error-bar [message]="error()" />
    </app-card>
  `,
})
export class ClipboardCard {
  private readonly safe = createSafeCall();
  protected readonly error = this.safe.error;
  protected readonly text = signal('Hello Napacitor!');
  protected readonly readBack = signal('');
  protected readonly copied = signal(false);

  protected write(): void {
    this.safe.run('Clipboard.write', async () => {
      await Clipboard.write({ string: this.text() });
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    });
  }

  protected read(): void {
    this.safe.run('Clipboard.read', async () => {
      const r = await Clipboard.read();
      this.readBack.set(r.value);
    });
  }
}
