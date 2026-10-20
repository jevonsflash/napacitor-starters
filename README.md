# Napacitor Starters

[Napacitor](https://github.com/jevonsflash/Napacitor) 是一个复刻 [Capacitor](https://capacitorjs.com/) 工作流的跨平台运行时：**用 Web 技术(HTML/CSS/JS)写应用，打包成真正的原生 App**。与 Capacitor 用 iOS/Android 原生壳不同，Napacitor 的原生层是 **.NET MAUI Blazor**，因此同一份 Web 代码可以跑在 macOS、iOS、Windows、Android 上。

本仓库是官方最小示例 `h5/`：一个**纯静态网页**(没有前端构建步骤)，调用全部内置插件的 API，完整走一遍 nap 工作流，最终在你自己的 Mac 上跑起一个原生窗口应用。

跑起来之后你会看到：

- 一张**设备信息卡**：platform / model / osVersion / 语言与地区(来自 `Device` 插件)
- 一张**电池卡**：电量百分比与充电状态，且随系统实时刷新(来自 `Battery` 插件的事件推送)
- 四个按钮：**写入/读取剪贴板**(`Clipboard`)、**分享文本**(`Share`，弹出系统分享面板)、**震动**(`Haptics`)

---

## 目录

1. [环境准备](#一环境准备把工具装好)
2. [五分钟跑起来](#二五分钟跑起来从零到原生窗口)
3. [运行日志怎么看](#三运行日志怎么看判断应用是否正常)
4. [日常改代码的迭代流程](#四日常改代码的迭代流程)
5. [项目结构说明](#五项目结构说明每个文件是干什么的)
6. [nap 命令速查表](#六nap-命令速查表)
7. [常见问题排查(FAQ)](#七常见问题排查faq)

---

## 一、环境准备：把工具装好

整个链路需要 4 样东西：**Node.js**(跑 nap 命令)、**.NET SDK + iOS/MacCatalyst 工作负载**(编译原生层)、**Xcode**(提供 Apple 平台编译工具链)、以及一台 **macOS 电脑**(Intel 或 Apple Silicon 均可)。

> 磁盘提醒：Xcode 本体约 15GB+，.NET 工作负载还需若干 GB，请确保至少 30GB 可用空间。

### 1. 安装 Node.js(建议 18 或更新版本)

两种方式任选其一：

```bash
# 方式 A:Homebrew(没装 brew 的话见 https://brew.sh)
brew install node

# 方式 B:去官网 https://nodejs.org 下载 LTS 安装包,双击安装
```

验证：

```bash
node -v        # 预期输出类似 v22.x.x
npm -v         # 预期输出类似 10.x.x
```

### 2. 安装 .NET SDK 10

```bash
# 方式 A:Homebrew
brew install --cask dotnet-sdk

# 方式 B:去官网 https://dotnet.microsoft.com/download/dotnet/10.0
# 下载 macOS 安装包(注意选对自己芯片的版本:Apple Silicon 选 Arm64,老 Mac 选 x64),双击安装
```

验证：

```bash
dotnet --version    # 预期输出 10.0.xxx
```

### 3. 安装 iOS / Mac Catalyst 工作负载

.NET 编译 Apple 平台需要额外的工作负载(pack)，下载体积较大，请耐心等待：

```bash
dotnet workload install ios maccatalyst
```

验证(记下这里显示的 Pack 版本，后面构建会用到)：

```bash
dotnet workload list
# 预期看到类似:
# 已安装的工作负载:
# ios              26.x.xxx/net10.0
# maccatalyst      26.x.xxx/net10.0
```

### 4. 安装 Xcode

1. 打开 Mac 上的 **App Store**，搜索 **Xcode**，安装(时间较长)；
2. 安装完成后**打开一次 Xcode**，同意许可协议并等它完成组件安装；
3. 验证：

```bash
xcodebuild -version    # 预期输出类似 Xcode 26.x
```

> Xcode 大版本号最好与上面 `dotnet workload list` 里的 Pack 大版本一致(例如都是 26)。不一致也没关系，见 [FAQ 第 2 条](#2-构建时报-需要-xcode-27x-或-workload-相关错误)。

### 5.(可选)安装 VS Code

编辑代码用任何编辑器都行，推荐 [Visual Studio Code](https://code.visualstudio.com/)。

---

## 二、五分钟跑起来：从零到原生窗口

以下命令全部在**终端(Terminal)**里执行。先进入示例项目目录：

```bash
cd napacitor-starters/h5
```

### Step 1:安装 npm 依赖

```bash
npm install --legacy-peer-deps
```

> **为什么带 `--legacy-peer-deps`?** 当前插件包声明的 peerDependency 是 `^0.1.0`，不含 beta 预发布版本，npm 会按冲突拒绝安装。加这个参数告诉 npm 跳过严格检查，实际运行完全正常。

预期最后输出 `added N packages`、`found 0 vulnerabilities`。

### Step 2:生成 MAUI 原生宿主工程

```bash
npx nap add maui
```

这一步从模板生成 `maui/` 目录——一个完整的 .NET MAUI 工程，它是你的网页的"原生壳"。预期输出(节选)：

```
添加 MAUI 平台(模板 → maui/)
✓ 宿主工程已生成:/.../h5/maui
复制 Web 构建产物(src/ → wwwroot/)
宿主化改造 index.html
  入口脚本(1):./app.js
生成 napacitor.build.props
  接入的 Napacitor 工程(6):
    @napacitor/maui ...
    @napacitor/battery ...
    ...
```

> **注意**：如果仓库里已经有 `maui/` 目录，这条命令会报错拒绝(防止覆盖你的修改)。此时直接跳到 Step 3。确实想重新生成时，先 `rm -rf maui` 再执行本步。

### Step 3:执行 nap sync

```bash
npx nap sync
```

nap 按 `napacitor.config.json` 里的 `webDir` 读取 Web 资源——本示例是纯静态页面、没有构建步骤，**源码即产物**，所以 `webDir` 直接指向 `src/`(用 Vite 之类的前端工程时，把它指向构建输出目录如 `dist/` 即可)。这一步做了三件事：把 `src/` 内容拷进宿主的 `maui/wwwroot/`；把 `index.html` 里本地 `<script>` 标签摘除并登记到入口清单 `napacitor.entries.json`(运行时由原生桥按序导入)；重新生成 `maui/napacitor.build.props`(把 node_modules 里各插件的 C# 工程接入宿主)。预期结尾输出：

```
✓ sync 完成:wwwroot 已更新,napacitor.build.props 已重新生成
```

### Step 4:构建 macOS 程序

```bash
dotnet build maui/App.csproj -f net10.0-maccatalyst26.0 -c Debug
```

这里 `-f` 指定的是**目标框架(TargetFramework)**:`net10.0-maccatalyst26.0` = ".NET 10 + Mac Catalyst 平台 + 平台版本 26"。数字 26 对应 Xcode/workload 的大版本——**请根据[环境准备](#一环境准备把工具装好)第 3 小节 `dotnet workload list` 显示的 Pack 大版本调整这个数字**(装的是 27.x pack 就写 `net10.0-maccatalyst27.0`，并同时把 `maui/App.csproj` 里 `<TargetFrameworks>` 的两处后缀改成一致的版本)。

首次构建要还原大量 NuGet 包，耗时几分钟属正常。预期结尾输出：

```
已成功生成。
    1 个警告(或 0 个警告)
    0 个错误
```

> 有一个 `CS0618 Application.MainPage 已过时` 警告来自模板自身，不影响运行，可以忽略。

### Step 5:运行！

```bash
open "maui/bin/Debug/net10.0-maccatalyst26.0/maccatalyst-x64/Napacitor Demo.app"
```

> **注意路径里的引号不能省**：应用名 `Napacitor Demo.app` 中间有空格，不加引号终端会把路径拆开导致报"找不到文件"。

一个原生窗口弹出，标题 **Napacitor Demo**：设备信息卡、电池卡、四个按钮都在里面——点"分享文本"会弹出 macOS 系统分享面板，点"写入剪贴板"后去其他 App 粘贴试试。

至此，你的 Web 页面已经是一个原生 macOS 应用了。🎉

---

## 三、运行日志怎么看(判断应用是否正常)

双击/open 启动看不到内部日志。想确认 Napacitor 运行时是否健康，直接运行 app 内部的可执行文件，日志会打印在终端：

```bash
"maui/bin/Debug/net10.0-maccatalyst26.0/maccatalyst-x64/Napacitor Demo.app/Contents/MacOS/App"
```

正常启动会依次输出四阶段日志(这就是"Web 已被原生接管"的证据)：

```
[Napacitor] ① 插件发现完成:Haptics,Device,Battery,Clipboard,Share   ← C# 侧找到全部插件
[Napacitor] ② 原生桥注入完成                                          ← JS 与 C# 的通信桥装好了
[Napacitor] ③ 应用配置加载完成                                        ← 读取 napacitor.config.json
[Napacitor] ④ 入口清单:./app.js
[Napacitor] ④ 已导入入口脚本 ./app.js                                  ← 你的代码开始执行
NapacitorRuntime.StartAsync 完成
```

看到 ①~④ 全部完成且没有 `JSException`，说明全链路正常。此时按 `Ctrl+C` 结束终端进程(窗口会一起关闭)，之后仍可用 `open` 正常启动。

---

## 四、日常改代码的迭代流程

改了 `src/` 里的网页代码后，要让原生 App 用上新代码，重复"sync → 构建 → 运行"：

```bash
cd napacitor-starters/h5

npx nap sync                                # 1. 把 src/ 的最新内容同步进宿主工程
dotnet build maui/App.csproj -f net10.0-maccatalyst26.0 -c Debug   # 2. 重新构建(增量,很快)
open "maui/bin/Debug/net10.0-maccatalyst26.0/maccatalyst-x64/Napacitor Demo.app"   # 3. 运行
```

> 忘跑第 1 步是最常见的"改了没生效"的原因——原生 App 里跑的是 `maui/wwwroot/` 的拷贝，不是 `src/` 本尊。

**改 JS/HTML 不需要动 C#**；只有调整插件依赖(增删 `@napacitor/*` 包)后才需要重新 `npx nap sync`(它会把新插件的 C# 工程接入 `napacitor.build.props`)。

---

## 五、项目结构说明：每个文件是干什么的

```
napacitor-starters/
└── h5/                          # 示例应用(Napacitor 项目根)
    ├── src/                     # ★ 你的 Web 源码(改这里;webDir 直接指向它,源码即产物)
    │   ├── index.html           #   页面结构:两张信息卡 + 四个按钮
    │   └── app.js               #   页面逻辑:注册插件、渲染数据、绑定按钮
    ├── maui/                    # 原生宿主工程(nap add maui 生成,一般不用手改)
    │   ├── App.csproj           #   工程定义:TargetFrameworks、应用名、图标等
    │   ├── MauiProgram.cs       #   MAUI 启动配置
    │   ├── wwwroot/             #   nap copy/sync 把 src/ 拷到这里打包进 App
    │   ├── napacitor.build.props#   nap sync 生成:把各插件的 C# 工程接入本工程
    │   └── Platforms/           #   各平台专属文件(iOS/MacCatalyst/Android/Windows)
    │       └── MacCatalyst/Info.plist   # macOS 版的打包信息(权限、版本等)
    ├── napacitor.config.json    # Napacitor 配置:appId、应用名、webDir
    ├── package.json             # npm 依赖与脚本
    └── node_modules/            # 依赖本体(含各插件的 JS 与 C# 部分,不入库)
```

几个关键概念：

- **webDir**(`napacitor.config.json` 里的 `"src"`):告诉 nap 去哪个目录拿 Web 产物。本示例是纯静态页面、没有构建步骤，**源码即产物**，所以直接指向 `src/`，改完源码 `nap sync` 即生效；用 Vite 之类的前端工程时，先 `npm run build` 产出 `dist/`，把 webDir 指向它即可。
- **宿主**：`maui/` 这个 .NET MAUI 工程。它创建一个 WebView 窗口、加载 `wwwroot/` 里的页面，并在页面里注入原生桥，让 JS 能调用 C#。
- **原生桥**：一段运行时注入的 JS(`window.Napacitor` 全局对象)。`app.js` 第一行 `const nap = window.Napacitor;` 拿到的就是它；`nap.registerPlugin('Device')` 之后调用的每个方法，实际都跨语言转发给了 C# 插件实现。

---

## 六、nap 命令速查表

所有命令在 `h5/` 目录下用 `npx nap <命令>` 执行(全局装了 CLI 的话可省略 npx)。

| 命令 | 作用 | 备注 |
| --- | --- | --- |
| `nap init [appId] [appName] --web-dir <dir>` | 新建应用，生成 `napacitor.config.json` | 做自己的应用时用 |
| `nap add maui` | 从模板生成 `maui/` 宿主工程 | 目录已存在会报错；重来需先 `rm -rf maui` |
| `nap copy` | 把 webDir 内容拷进 `maui/wwwroot/` 并宿主化 index.html | 只同步 Web 部分 |
| `nap sync` | copy + 重新生成 `napacitor.build.props` | **日常最常用**，改代码后跑它 |
| `nap open maui` | 用系统默认方式打开宿主工程 | 装了 VS/VS Code 时方便跳进去调试 |
| `nap run --target maccatalyst` | 一条命令构建并运行(dotnet build -t:Run) | 目标可选 `windows/android/ios/maccatalyst`；如与自定义 TFM 不兼容，用本文的"手动构建 + open"方式即可 |
| `nap list` | 列出已安装的 `@napacitor/*` 包 | |

---

## 七、常见问题排查(FAQ)

### 1. `npm install` 报 peer dependency 冲突(ERESOLVE)

错误特征:`Could not resolve peer dependency @napacitor/core@^0.1.0`。

**解法**：加参数安装 `npm install --legacy-peer-deps`(见 Step 1 的解释)。装完 `npm ls` 显示 core 为 `invalid` 属预期现象，不影响构建运行。

### 2. 构建时报"需要 Xcode 27.x"或 workload 相关错误

错误特征:`error NETSDK1056` / `指定的 .NET iOS 27.x 需要 Xcode 27.1` 之类。

根因是 **csproj 的 TargetFramework 版本号与你装的 workload Pack / Xcode 大版本不匹配**(版本化 TFM 末尾的数字必须与已装 Pack 大版本一致)。

**解法(二选一)**：

- **对齐 TFM(推荐，不动工具链)**：查看 `dotnet workload list` 里 Pack 的大版本(设为 N)，把 `maui/App.csproj` 里 `<TargetFrameworks>` 改成 `net10.0-iosN.0;net10.0-maccatalystN.0`，构建命令的 `-f` 同步改成 `net10.0-maccatalystN.0`。模板已内置 `ValidateXcodeVersion=false`，Xcode 小版本差异会被跳过。
- **对齐工具链**：升级 Xcode 到与 Pack 匹配的大版本，或 `sudo dotnet workload install ios maccatalyst` 安装与 Xcode 匹配的 Pack 版本。

### 3. 构建报 SupportedOSPlatformVersion / LSMinimumSystemVersion 错误

错误特征:`The SupportedOSPlatformVersion '15.0' is not supported` 或 plist 与 csproj 值不匹配的报错。

**解法**(本仓库已完成，重新生成宿主后需重做)：

1. `maui/App.csproj` 中 maccatalyst 的 `<SupportedOSPlatformVersion>` 设为 `17.0` 或更高；
2. 删除 `maui/Platforms/MacCatalyst/Info.plist` 里的 `<key>LSMinimumSystemVersion</key>` 及其 `<string>` 值(该键由 csproj 自动生成，手写反而冲突)。

### 4. `nap add maui` 报目录已存在

模板拒绝覆盖已有工程。确认 `maui/` 里的手工修改(如 FAQ 2/3 的适配)不再需要后：

```bash
rm -rf maui
npx nap add maui
```

> 重新生成后，FAQ 2/3 的适配项(版本化 TFM、平台版本、删 plist 键)需要重新做一遍。

### 5. `nap sync` / `nap copy` 报 webDir 不存在或缺少 index.html

nap 要求 `webDir` 指向的目录存在且包含 `index.html`。本示例的 `src/` 天然满足；如果你把 webDir 改成了别的目录(如 `dist/`)，记得先跑一次前端构建(如 `npm run build`)再执行 nap 命令。

### 6. 改了 `src/` 里的代码，App 里没变化

原生 App 打包的是 `maui/wwwroot/` 的拷贝。请完整执行[第四节](#四日常改代码的迭代流程)的三步，尤其是第一步 `npx nap sync`——少了它，改动永远不会进入宿主工程。

### 7. `open` 报"找不到文件"

十有八九是路径没加引号——应用名 `Napacitor Demo.app` 带空格。照抄本文命令的引号即可；若改了 `-f` 的版本号，注意 `open` 的路径里也有同样的版本号要一起改。

### 8. iOS 模拟器跑不起来

本示例的 macOS(Mac Catalyst)路径在任何 Intel/Apple Silicon Mac 上都能跑。但**很老的 Intel Mac(如 2014~2015 年款、集成显卡)可能无法承载 iOS 26 模拟器运行时的渲染栈**，表现为模拟器启动后黑屏、系统 App 也打不开——这是硬件限制，不是项目问题。这类机器请用本文的 macOS 路径验证。

构建 iOS 版(供新机器使用)：

```bash
dotnet build maui/App.csproj -f net10.0-ios26.0 -c Debug
```

### 9. 怎么升级 Napacitor 包到最新版

当前 npm 的 `latest` 标签可能落后于最新 beta。查看全部版本后安装指定版：

```bash
npm view @napacitor/maui versions --json     # 看可用版本
npm install @napacitor/maui@0.1.2-beta.3 --legacy-peer-deps
npm view @napacitor/cli version               # 单独查最新正式版
```

升级后记得 `npx nap sync` 让新版的 C# 工程接入宿主，再重新构建。

---

## 下一步

- 打开 `src/app.js`，改改按钮文案或加一个自己的插件调用，跑一遍[迭代流程](#四日常改代码的迭代流程)感受热更新般的循环(构建是增量的，几秒就完)；
- 用 `nap init` 创建你自己的应用，把 `webDir` 指向你前端项目的构建输出；
- 更多能力(插件列表、自定义插件、各平台细节)见 [Napacitor 主仓库](https://github.com/jevonsflash/Napacitor)。
