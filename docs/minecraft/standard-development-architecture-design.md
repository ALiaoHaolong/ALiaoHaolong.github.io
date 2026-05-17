---
title: 《Minecraft》模组开发——标准开发架构设计
date: 2026-05-14 16:00:00
permalink: /minecraft/standard-development-architecture-design
categories:
  - 开发笔记
tags:
  - Minecraft
  - 模组开发
  - 架构设计
  - 工程化
titleTag: 原创
top: true
sidebar: false
description: 从无法复刻的成功到标准开发架构——Minecraft 模组工程化实践记录。
coverImg: /articles/啊层层层_141930909.jpg

aside: false
pageClass: article-banner-light-text-with-shadow
---

## 背景

- 2020 年 10 月，制作 [MWD](https://gitee.com/AnNight/mwd-1.15.2)（Magic With Drinks）模组。
- 2023 年 1 月，制作 [Slots Checker](https://github.com/ALiaoHaolong/slots-checker) 模组。
- 2025 年 7 月，制作 [Biome Snapshot](https://github.com/ALiaoHaolong/biome-snapshot) 模组。
- 若干未发布的模组。

通过这些项目，我积累了扎实的 Java 基础。但它们都有一个共同的问题：无论是构建流程还是发布方式，都更像一个仅供学习的半成品，没有走向“正轨”。

**每一次的成功无法复刻，每一次几乎都在“从零开始”。**

这个问题的核心是 <u>可复用</u>——项目开发架构的可复用。

在学习软件工程时，我接触到了 ISO 标准的概念。我意识到：**标准，正是解决可复用的关键。**

为此，我尝试设计一套可复用的 **标准开发架构**。

受限于学业，这些事情在 2025 年 9 月按下了暂停键。

## 转机：一封邮件

2026 年 2 月 22 日，一封邮件飘到了我的邮箱。

:::info 模组版本升级
您好，我是一位我的世界JAVA版本的腐竹，看见您的模组Slots Checker，认为很有用，希望可以更新适配1.20.4版本的模组，谢谢！如果可以我会很感谢！（更新了麻烦把文件发我邮箱）

H 先生

2026.2.22
:::

_P.S. 出于尊重，发件人使用 "H 先生" 代称。_

当时的 Slots Checker 仅支持 Minecraft 1.18.2 版本。我向 H 先生确认了需求后，快速熟悉了之前的项目结构，为他开发了 1.19.2 版本的支持。

正是这次契机，让我重新拾起了那个被搁置的问题：**如何设计一套可复用的标准开发架构？**

### 总体思路

**什么叫好？**

“一个好的标准开发架构，应该是怎样的？”

我给自己定的标准是：**结构清晰、可复用性强、使用不繁琐，尽最大可能减少重复工作。**

**该怎么做？**

我将设计分为两个阶段：**单环境标准开发架构**和**多环境标准开发架构**。

:::tip 什么是“环境”？
**环境**指模组开发时针对的 Minecraft 版本。
- **单环境**：只针对单一 Minecraft 版本开发
- **多环境**：同时兼容多个 Minecraft 版本
:::

## 第一阶段：单环境标准开发架构

在 Slots Checker 模组中，我首先做了两件事：

1. **解耦构建与配置**：将构建脚本（build.gradle）与项目配置（gradle.properties）分离
2. **引入自动化发布**：集成 [Minotaur](https://github.com/modrinth/minotaur) 插件，实现自动构建并发布到 Modrinth

### 文档组织结构

在整理文档时，我设计了以下结构：

- **核心文档**：`Readme.en.md` 和 `Readme.zh-CN.md`（包含简介、内容、作者、许可证等）
- **平台文档**：
    - `Modrinth.md`：基于英文 Readme，将相对路径替换为绝对路径
    - `CurseForge.md`：在 Modrinth 文档基础上，移除标题和相关链接部分
- **更新日志**：`changelogs/` 目录下，以版本号为文件名的 Markdown 文件
- **其他资源**：技术文档、图标、许可证等

最终的项目结构如下：

```text
slots-checker/
├── docs/                    # 文档相关图片资源
├── changelogs/              # 版本更新日志
│   ├── 1.0.0.md
│   └── 2.0.0.md
├── gradle/wrapper/          # Gradle Wrapper
├── src/                     # 源代码
├── build.gradle             # 构建脚本、发布脚本
├── CurseForge.md
├── gradle.properties        # 项目配置
├── icon.png                 # 图标
├── LICENSE                  # 许可证
├── gradlew
├── gradlew.bat
├── Modrinth.md
├── Readme.en.md
├── Readme.zh-CN.md
└── 其他技术文档
```

## 第二阶段：多环境标准开发架构

### 初步方案

我设计的多环境兼容步骤如下：

1. 确定模组需要兼容的最低游戏版本，完成兼容性调整
2. 以该版本为基准，向更高版本逐个测试
3. 遇到不兼容的版本时，开启一条新分支进行兼容性调整
4. 完成调整后，回到步骤 2，直到覆盖所有目标版本

这套方法的思路清晰。虽然反复测试和构建耗费了许多时间，但我知道，这些是不可避免的成本。

### 问题浮现

当时 Slots Checker 已维护 4 个活跃分支（若将 Biome Snapshot 同样优化，至少会有 7 个分支需要维护）。各分支之间的状态如下：

* <mark style="--tk-mark-color: green;">不同</mark> 核心代码
* <mark style="--tk-mark-color: green;">不同</mark> 项目配置
* <mark>相同</mark> Readme 文档
* <mark>相同</mark> Modrinth 文档
* <mark>相同</mark> CurseForge 文档
* <mark>相同</mark> 其他技术文档
* <mark>相同</mark> 更新日志文档
* <mark>相同</mark> 文档图片资源
* <mark>相同</mark> 图标、许可证

**对于所有相同的部分，在任意一个分支中的改动，都需要手动同步到其他所有分支。**

显然，初步方案在文档管理上存在着巨大的问题。

### 解耦：代码与文档分离

在参观了大量开源项目后，我做出了一个决定：**将文档与代码解耦，建立独立的 `master` 分支。**

仓库 Wiki 中维护的各分支版本支持信息，也一同迁移到 `master` 分支。

**1. 解耦构建与发布**

受文档迁移的影响，我首先把各分支的构建与发布进行了分离。各开发分支仅保留核心代码与构建脚本，发布脚本则迁移到 `master` 分支。

为此，我开发了支持多兼容版本的发布脚本——[Mc Mod Dispatcher](https://github.com/ALiaoHaolong/mc-mod-dispatcher)。

**2. 文档站点的技术选型**

> 不应将目光局限于产品本身，如何向他人介绍，同样是一门学问。

迁移完成后，我开始考虑如何更好地呈现文档。

常见方案有：

- <mark style="--tk-mark-color: RoyalBlue;">自建网站</mark>：自由度最高，但耗时耗钱，不适合个人项目
- <mark style="--tk-mark-color: RoyalBlue;">GitBook</mark>：首个候选方案，但实际使用后发现，不购买 VIP 太多功能受限，尤其是多语言支持
- <mark style="--tk-mark-color: RoyalBlue;">GitHub Pages</mark>：GitHub 官方提供的静态网页托管服务，需要选择一个合适的静态网页框架

静态网站框架有很多：Hexo、Jekyll、VuePress 等。由于之前接触 Jekyll 的体验并不是很好，我想寻找一个基于我熟悉的技术栈的框架。

最终，我选择了 **VitePress**。

它基于 Vue3，使用 Vite 构建，支持 TypeScript——这些技术我都深度使用过。其丰富的插件生态也能满足我的各种需求。

## 最终架构

综上，我设计出了现在使用的标准开发架构：

| 分支          | 职责          |
|-------------|-------------|
| `master`    | 文档站点+发布脚本   |
| `v1` ~ `vn` | 各版本的代码+构建脚本 |

具体结构可参考 [Slots Checker](https://github.com/ALiaoHaolong/slots-checker) 和 [Biome Snapshot](https://github.com/ALiaoHaolong/biome-snapshot) 项目。

核心特点：

1. **文档站点**：包含介绍、相关链接、更新日志、分支介绍、技术文档等，内容完整，界面美观
2. **独立入口**：静态网页入口（package.json）和发布脚本入口（build.gradle）互不影响，且发布脚本可直接读取更新日志文件来发布版本
3. **分支专注**：开发分支除了核心代码，仅保留一个分支介绍 `README.md`，结构极其精简

## 后记

写下这篇博客时，我回头看了看我的仓库。从 2020 年的 MWD，到 2023 年的 Slots Checker，再到 2025 年的 Biome Snapshot——每个项目都让我学到了新东西，但每个项目也都在重复同样的麻烦：构建脚本要重找，文档要重新组织，稳定的多环境开发更是遥不可达。

说实话，这个过程有点让人沮丧。明明写过好几次的东西，换个版本就要再来一遍。

感谢那封意外的邮件，让我有机会重新审视之前的代码。也正是这次契机，让我下定决心把“标准架构”这件事做完。

这一做，就是两个月。

现在这套方案可能算不上多高明，但它是我反复打磨后的结果，切切实实解决了我最头痛的问题：文档再也不用在多个分支间手动同步，发布只需要一条命令，每个开发分支干净得只剩下代码本身，所有人都可以在同一个漂亮大方的网站上找到所需的信息。

如果你也在做 Minecraft 模组开发，希望这篇文章能帮你少走一些弯路❤。

---

P.S. 这篇文档在撰写过程中使用了 AI（DeepSeek）协助梳理语言表达和结构优化，所有技术决策和架构设计均出自本人。
