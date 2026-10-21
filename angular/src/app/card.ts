import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** 卡片容器:title/subtitle + 内容投影(对应 React/Vue starter 的 Card 组件)。 */
@Component({
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <header>
        <h2>{{ title() }}</h2>
        @if (subtitle()) {
          <p class="subtitle">{{ subtitle() }}</p>
        }
      </header>
      <ng-content />
    </section>
  `,
})
export class Card {
  /** 卡片标题(插件名)。 */
  readonly title = input.required<string>();
  /** 副标题(演示的 API 列表)。 */
  readonly subtitle = input('');
}
