# Vue 3 + Typescript + Vite

vite [文档](https://cn.vitejs.dev/config/)
This template should help get you started developing with Vue 3 and Typescript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

单文件组件 `<script setup>` [文档](https://v3.cn.vuejs.org/api/sfc-script-setup.html)

## Recommended IDE Setup

## 开发环境

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

## Type Support For `.vue` Imports in TS

## 下载

https://v3.nuxtjs.org/getting-started/installation

Visual Studio Code

插件: Volar Extension

## 安装依赖包

pnpm config set registry https://mirrors.tencent.com/npm/
pnpm config get registry

```bash
pnpm i
```

## 开发

Start the development server on http://localhost:3000

```bash
nuxi dev -open
```

## 发布

```bash
yarn build
```

更多请参考 https://v3.nuxtjs.org/getting-started/commands

## Logo

https://fonts.google.com/specimen/Ubuntu+Mono

`/ui/SEA.ai.svg`
Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's `.vue` type support plugin by running `Volar: Switch TS Plugin on/off` from VSCode command palette.
