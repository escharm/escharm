# Story 工具开发计划

## 项目概述

Story 是一个类似于 Vite 的开发工具，专注于以下核心功能：

1. 提供开发服务器
2. 展示项目中的所有文件
3. 对于 TSX/JSX 文件，自动展示其默认导出的组件

## 开发阶段

### 阶段一：基础架构搭建

- [ x ] 基于 fastify 实现 HTTP 服务器
- [ x ] 使用 vite 启动 HTTP 服务器
- [ x ] 配置开发环境（TypeScript、ESLint、Prettier 等）

### 阶段二：开发服务器实现

- [ x ] 支持静态资源服务
- [ x ] 实现动态组件加载
