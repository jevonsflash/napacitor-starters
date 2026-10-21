import { ref } from 'vue';

/**
 * 把插件调用包成安全调用:异常落入错误条而不是崩掉页面。
 * (插件抛出的 NapacitorException 会显示在 ErrorBar 里)
 *
 * 用法:
 *   const { run, error } = useSafeCall();
 *   await run('Device.getInfo', async () => { ... });
 *   模板中:<ErrorBar :message="error" />
 */
export function useSafeCall() {
  const error = ref('');

  const run = async (label, action) => {
    error.value = '';
    try {
      return await action();
    } catch (err) {
      error.value = `${label}: ${err?.message ?? err}`;
      return undefined;
    }
  };

  return { run, error };
}
