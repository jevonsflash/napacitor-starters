import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** 错误提示条:插件抛出的 NapacitorException 在这里展示。 */
@Component({
  selector: 'app-error-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if (message()) {
    <p class="error">⚠ {{ message() }}</p>
  }`,
})
export class ErrorBar {
  /** 错误信息,空串时不渲染。 */
  readonly message = input.required<string>();
}
