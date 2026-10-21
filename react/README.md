# napacitor-react-starter

React + Vite 单页应用,通过 [Napacitor](https://www.npmjs.com/package/@napacitor/core)(Capacitor 式工作流,.NET MAUI Blazor 原生宿主)运行在原生 App 中。

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
npm run dev              # 浏览器开发(插件自动回退 web 实现)
npm run build            # Web 构建后需同步到宿主:npx nap sync
```

## 前置要求

- Node.js 18+(推荐 20+)
- .NET 10 SDK + MAUI 工作负载(`dotnet workload install maui`)
- 目标平台 SDK:Windows(Windows App SDK,随 MAUI 工作负载)/ Android(API 36 平台包)/ iOS(需 macOS)