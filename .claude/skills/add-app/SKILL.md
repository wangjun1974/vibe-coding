---
name: add-app
description: 在 win11 模拟器中新增一个 app，自动完成所有注册步骤
---

用户会提供：
- **app id**：英文小写，如 `paint`
- **中文名**：显示在任务栏和标题栏，如 `画图`
- **图标 emoji**：如 `🎨`
- **功能描述**（可选）：app 要实现什么

按以下顺序完成所有步骤，不要遗漏：

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

## 步骤 2：注册应用

在 `win11/src/appRegistry.ts` 中：

1. 顶部 import 新组件：
   ```ts
   import Paint from './components/apps/Paint';
   ```
2. 在 `APP_REGISTRY` 数组中添加完整条目：
   ```ts
   {
     id: '<id>',
     name: '<中文名>',
     icon: '<emoji>',
     component: <PascalCase>,
     width: <w>,
     height: <h>,
     minWidth: <mw>,
     minHeight: <mh>,
   },
   ```

`APP_REGISTRY` 是唯一注册点，会自动派生任务栏/开始菜单（`PINNED_APPS`）、窗口尺寸（`APP_DEFAULTS`）和组件映射（`APP_COMPONENTS`）。

## 步骤 3（可选）：添加桌面快捷方式

若需在桌面显示图标，在 `DESKTOP_SHORTCUTS` 数组中添加：

```ts
{ id: '<id>', appId: '<id>' },
```

别名入口（如「此电脑」打开 explorer）可覆盖 `name` 和 `icon`：

```ts
{ id: 'computer', appId: 'explorer', name: '此电脑', icon: '🖥️' },
```

## 完成后

告知用户已修改的文件（组件 + `appRegistry.ts`），并提示运行 `cd win11 && npm run dev` 查看效果。
