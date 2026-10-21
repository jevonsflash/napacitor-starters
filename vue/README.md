# napacitor-vue-starter

Vue 3 + Vite 单页应用,通过 [Napacitor](https://www.npmjs.com/package/@napacitor/core)(Capacitor 式工作流,.NET MAUI Blazor 原生宿主)运行在原生 App 中。

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

## 项目结构

```
src/
├── main.js                    # 应用入口:createApp 挂载到 #app
├── App.vue                    # 应用骨架:头部徽标、卡片网格、页脚
├── App.css / index.css        # 全局样式
├── composables/
│   └── useSafeCall.js         # 把插件调用包成安全调用,异常落入错误条
└── components/
    ├── AppCard.vue            # 卡片容器(title/subtitle + slot)
    ├── ErrorBar.vue           # 错误提示条
    ├── DeviceCard.vue         # Device:getInfo / getLanguageCode / getLocale
    ├── ClipboardCard.vue      # Clipboard:write / read
    ├── HapticsCard.vue        # Haptics:impact / notification / vibrate / selection
    ├── ShareCard.vue          # Share:canShare / share
    └── BatteryCard.vue        # Battery:getBatteryInfo / addListener('batteryStatusChange')
```

## 前置要求

- Node.js 18+(推荐 20+)
- .NET 10 SDK + MAUI 工作负载(`dotnet workload install maui`)
- 目标平台 SDK:Windows(Windows App SDK,随 MAUI 工作负载)/ Android(API 36 平台包)/ iOS(需 macOS)
