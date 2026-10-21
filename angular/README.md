# napacitor-angular-starter

Angular 21(standalone + signals + zoneless)单页应用,通过 [Napacitor](https://www.npmjs.com/package/@napacitor/core)(Capacitor 式工作流,.NET MAUI Blazor 原生宿主)运行在原生 App 中。

演示 5 个官方插件:**Device** / **Clipboard** / **Haptics** / **Share** / **Battery**(含事件监听)。

## 快速开始

```bash
npm install
npm run build            # 产出 dist/
npx nap add maui         # 生成 maui/ 宿主工程(首次含自动 copy/update)
npx nap run --target windows   # 或 android / ios / maccatalyst
```

`napacitor.config.json`(appId `com.example.napacitor`)已包含;如需自定义:

```bash
npx nap init com.yourcompany.appname "Your App Name"
```

## 日常开发

```bash
npm run dev              # 浏览器开发(ng serve;插件自动回退 web 实现)
npm run build            # Web 构建后需同步到宿主:npx nap sync
```

## 项目结构

```
src/
├── main.ts                        # 应用入口:bootstrapApplication 挂载 App
├── index.html                     # SPA 页面(<app-root>)
├── styles.css                     # 全局样式(与 react/vue starter 同一套卡片风格)
└── app/
    ├── app.ts / app.html          # 应用骨架:头部徽标、卡片网格、页脚
    ├── app.config.ts              # 启动 providers(zoneless 说明)
    ├── safe-call.ts               # createSafeCall:把插件调用包成安全调用,异常落入错误条
    ├── card.ts                    # 卡片容器(title/subtitle + ng-content)
    ├── error-bar.ts               # 错误提示条
    ├── device-card.ts             # Device:getInfo / getLanguageCode / getLocale
    ├── clipboard-card.ts          # Clipboard:write / read
    ├── haptics-card.ts            # Haptics:impact / notification / vibrate / selection
    ├── share-card.ts              # Share:canShare / share
    └── battery-card.ts            # Battery:getBatteryInfo / addListener('batteryStatusChange')
```

## Angular 版说明

- **zoneless(默认)**:Angular 21 起新应用默认 zoneless 变更检测,无 zone.js,构建产物仅单个 `main.js` 入口脚本 —— 与 Napacitor 宿主按 `napacitor.entries.json` 逐个 `await import` 的启动模型天然契合;组件状态全部用 `signal` 驱动(电池事件回调来自 C# 互操作、zoneless 下也能正确触发渲染)。
- **outputPath**:angular.json 将 outputPath 设为 `{ "base": "dist", "browser": "" }`,产物直接落在 `dist/`,`webDir` 与 react/vue starter 一致。
- **CJS 插件包**:@napacitor/* 为 CommonJS 包,已在 angular.json 的 `allowedCommonJsDependencies` 中放行(否则构建有优化警告)。

## 前置要求

- Node.js 20.19+(Angular 21 要求 `^20.19 || ^22.12 || >=24`;Angular 22+ 需 22.22.3+)
- .NET 10 SDK + MAUI 工作负载(`dotnet workload install maui`)
- 目标平台 SDK:Windows(Windows App SDK,随 MAUI 工作负载)/ Android(API 36 平台包)/ iOS(需 macOS)
