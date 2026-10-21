import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    // Angular 21 起默认 zoneless 变更检测:无 zone.js → 构建产物仅单个 main.js
    // 入口脚本,与 Napacitor 宿主按 napacitor.entries.json 逐个 await import 的
    // 启动模型天然契合(组件状态全部走 signal,无需 zone 驱动)。
    provideBrowserGlobalErrorListeners(),
  ],
};
