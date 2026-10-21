import { signal } from '@angular/core';

/**
 * 把插件调用包成安全调用:异常落入错误条而不是崩掉页面
 * (对应 React/Vue starter 的 useSafeCall;插件抛出的 NapacitorException
 * 会显示在 ErrorBar 里)。
 *
 * 用法:
 *   private readonly safe = createSafeCall();
 *   protected readonly error = this.safe.error;
 *   this.safe.run('Device.getInfo', async () => { ... });
 *   模板中:<app-error-bar [message]="error()" />
 */
export function createSafeCall() {
  const error = signal('');
  const run = async (
    label: string,
    action: () => Promise<unknown>,
  ): Promise<unknown> => {
    error.set('');
    try {
      return await action();
    } catch (err) {
      error.set(`${label}: ${err instanceof Error ? err.message : String(err)}`);
      return undefined;
    }
  };
  return { run, error };
}
