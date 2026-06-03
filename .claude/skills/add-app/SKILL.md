---
name: add-app
description: 在 win11 模拟器中新增一个 app，自动完成所有注册步骤
---

用户会提供：
- **app id**：英文小写，如 `paint`
- **中文名**：显示在任务栏和标题栏，如 `画图`
- **图标 emoji**：如 `🎨`
- **功能描述**（可选）：app 要实现什么

按以下顺序完成所有 4 个步骤，不要遗漏：

## 步骤 1：创建组件

新建 `win11/src/components/apps/<PascalCase>.tsx`。

组件规范：
- 默认导出一个 React 函数组件，名称为 PascalCase（如 `Paint`）
- 不引入任何新的 npm 包
- 不调用 `useWindowStore`，app 内容与窗口系统解耦
- 根元素使用 className `<id>-app`（如 `paint-app`）
- 内联样式优先，或复用 `index.css` 中已有的类
- 中文界面，与现有 app 风格一致

参考现有 app 的结构（`Notepad.tsx`、`Calculator.tsx` 等）。

## 步骤 2：注册默认尺寸

在 `win11/src/store/windowStore.ts` 的 `APP_DEFAULTS` 中添加：

```ts
<id>: { width: <w>, height: <h>, minWidth: <mw>, minHeight: <mh> },
```

根据功能合理设置尺寸，参考其他 app。

## 步骤 3：注册组件映射

在 `win11/src/components/Window.tsx` 中：

1. 顶部 import 新组件：
   ```ts
   import <PascalCase> from './apps/<PascalCase>';
   ```
2. 在 `APPS` record 中添加：
   ```ts
   <id>: <PascalCase>,
   ```

## 步骤 4：添加应用入口

在 `win11/src/appRegistry.ts` 的 `PINNED_APPS` 数组中添加：

```ts
{ id: '<id>', name: '<中文名>', icon: '<emoji>' },
```

此列表同时用于任务栏固定应用和开始菜单「已固定」区块。

## 完成后

告知用户已修改的 4 个文件（组件、`windowStore.ts`、`Window.tsx`、`appRegistry.ts`），并提示运行 `cd win11 && npm run dev` 查看效果。
