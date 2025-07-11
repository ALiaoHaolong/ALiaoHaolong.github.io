---
layout:     post
title:      "本地博客开发环境配置"
date:       2025-07-10 16:00:00
author:     "廖浩龙"
header-img: "img/in-post/post-bg-hello-blog.jpg"
tags:
    - 日常
    - 博客
---

## 本地环境

### 设备规格

* 处理器	Intel(R) Core(TM) i7-9700F CPU @ 3.00GHz   3.00 GHz
* 机带 RAM	32.0 GB
* 系统类型	64 位操作系统, 基于 x64 的处理器

### Windows 规格

* 版本	Windows 11 专业版
* 版本号	24H2

## 博客开发环境配置

### 1. 安装基础依赖

首先需要安装以下基础软件：

* Ruby (Jekyll 是基于 Ruby 的静态网站生成器)
* Bundler (Ruby 的依赖管理工具)
* Node.js (用于 Grunt 任务运行器)

对于 Windows 用户：

1. 下载 Ruby 安装包: [RubyInstaller](https://rubyinstaller.org/)
2. 安装时勾选 "Add Ruby executables to your PATH"
3. 安装完成后打开命令提示符，运行:
   ```text
   gem install bundler jekyll
   ```
4. 安装 Node.js: [Node.js 官网](https://nodejs.org/)

### 2. 安装项目依赖

1. 进入你的项目目录 
2. 安装 Ruby 依赖:
   ```text
   bundle install
   ```
3. 安装 Node.js 依赖:
   ```text
   npm install
   ```
### 3. 运行本地服务器
1. 启动 Jekyll 服务:
   ```text
   bundle exec jekyll serve
   ```
   或者使用 npm 脚本:
   ```text
   npm start
   ```
2. 浏览器访问: http://localhost:4000