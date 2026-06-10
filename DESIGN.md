# AI Chat 项目前端原型与交互规格说明书

## 1. 视觉风格与全局主题 (Design Tokens)

- **设计风格：** Modern Minimalist (现代极简) + Cyber-Chic。整体界面呈现无边界感（Border-free feel），多使用细腻的阴影和微弱的渐变。
- **色彩矩阵：**
- **Dark Mode (主打/默认)：** 背景色 `#0B0F19`（深邃蓝黑）；卡片与侧边栏 `#161B26`；激活态/高亮色 `#3B82F6`（科技蓝）与 `#8B5CF6`（AI 紫）的渐变。
- **Light Mode (备选)：** 背景色 `#F8FAFC`（纯净灰白）；卡片 `#FFFFFF`。

- **质感元素：** \* 对弹窗和浮层使用 **KUMO UI** 的毛玻璃特效（`backdrop-blur-md bg-opacity-70`）。
- 边框使用极细的半透明线（`border-slate-800/50`）。

---

## 2. 网页整体布局结构 (Layout)

系统采用经典的**双栏式响应式结构**：

```
+--------------------------------------------------------+
|  侧   | [Header] 模型切换 / 状态                           |
|  边   |------------------------------------------------|
|  栏   |                                                |
|       | [Chat Area] 聊天历史视窗 (滚动区)                |
| (His- |                                                |
|  tory |                                                |
|  &    |------------------------------------------------|
|  Set- | [Input Area] 浮动输入框 (支持多行/工具栏)        |
|  ting)|                                                |
+--------------------------------------------------------+

```

---

## 3. 核心功能组件、按钮与交互详解

### 3.1 侧边栏组件 (Sidebar) — `Width: 260px`

- **功能点：** 历史会话管理、用户设置入口、本地存储容量状态。
- **UI 元素与按钮：**
- **[+ 新建对话] 按钮：** 顶部居中。高亮渐变色块，带 `+` 悬浮放大动画。点击触发路由跳转至 `/`。
- **[会话列表] (List)：**
- 单条会话卡片：包含 `图标(ChatIcon)` + `会话标题(单行截断)` + `[更多]悬浮按钮`。
- **交互：** \* 点击卡片路由跳转至 `/chat/:id`，Zustand 同步更新 `activeChatId`。
- 悬浮时显示 `[重命名]` 和 `[删除]` 按钮。删除时调用 **KUMO UI 的确认弹窗 (Dialog)**。

- **[底部工具栏]：**
- **[API Key 配置] 按钮：** 点击唤起 **KUMO UI 的 Modal (弹窗)**，允许用户输入并在本地加密存储自己的 Key。
- **[暗黑/明亮模式切换] 开关：** KUMO UI 的 Switch 组件，一键切换全局 Tailwind 的 `.dark` 类名。

### 3.2 顶部状态栏组件 (Header) — `Height: 64px`

- **功能点：** 当前模型控制、连接状态指示、侧边栏折叠。
- **UI 元素与按钮：**
- **[侧边栏折叠] 按钮：** 汉堡菜单图标，点击通过 Zustand 改变 `isSidebarOpen` 状态，侧边栏以 `transition-all` 动效收缩/展开。
- **[模型选择] 下拉菜单 (Dropdown)：** 采用 **KUMO UI 的 Select 组件**。
- 内容：展示当前可用模型（如 `DeepSeek-V3`, `GPT-4o`, `Claude-3.5-Sonnet`），带模型专属彩色 Badge。

- **[连接状态 Indicator]：** 一个小绿点/小蓝点，展示当前网络与 API 的就绪状态（基于 TanStack Query 的状态推导）。

### 3.3 聊天历史视窗 (Chat Area) — `Flex-1, Overflow-y-auto`

- **功能点：** 流式文本渲染、代码高亮、一键复制、自动滚动。
- **UI 元素与交互：**
- **[欢迎使用界面] (当 `activeChatId` 为空时显示)：**
- 居中大 Logo，配合一句话引言。
- 提供 3 个 **[预设提示词卡片]**（例如：“帮我写一个 React 钩子”、“解释什么是跨域”）。点击直接将文本填入输入框并自动发送。

- **[对话气泡] (Message Bubble)：**
- **用户气泡：** 右侧对齐，深灰色背景，纯文本。
- **AI 气泡：** 左侧对齐，透明背景或极淡背景，头像使用 **KUMO UI Avatar**。

- **[AI 输出状态交互]：**
- **正在输入状态 (Streaming)：** 最后一个字展示闪烁的阻尼光标（打字机特效）。
- **代码块 (Codeblock)：** 顶部带灰色工具条，左侧显示语言标签（如 `TYPESCRIPT`），右侧放置 **[Copy 复制] 按钮**（点击后切换为对勾图标，2秒后恢复）。

- **[视窗底部控制]：** \* 当用户向上滚动、AI 正在输出时，右下角悬浮显示 **[↓ 滚动至底部] 快捷按钮**（带未读消息数提示）。

### 3.4 底部输入框区域 (Input Area) — `Sticky/Absolute Bottom`

- **功能点：** 多行文本自适应输入、发送控制、快捷清空。
- **UI 元素与按钮：**
- **[输入框主体]：** 采用类似 ChatGPT 的**大药丸/圆角矩形悬浮框**（`shadow-2xl backdrop-blur-lg bg-slate-900/80`）。
- **[Textarea]：** 支持 `Shift + Enter` 换行，高度随内容自动撑开（上限 200px 出现滚动条）。
- **[动作工具栏] (位于输入框内底部或顶部)：**
- 左侧：**[清除当前对话] 按钮**（垃圾桶图标，清空当前上下文）。
- 右侧：**[发送/停止] 核心按钮**：
- _状态 A (静止/有文本)：_ 向上箭头图标，点击或回车触发发送，Zustand 捕获状态，TanStack Query 更新缓存。
- _状态 B (AI 正在流式输出)：_ 方块停止图标（Stop），点击立刻中止 `fetch` 的 `ReadableStream` 读取。

---

## 4. 前端状态与数据流逻辑映射 (供代码实现参考)

- **React Router:** 驱动整个界面的 URL 状态（`/` 激活欢迎页；`/chat/123` 激活特定聊天视窗）。
- **Zustand (Global State):**

```typescript
interface ChatState {
  isSidebarOpen: boolean;
  currentModel: string;
  apiKey: string;
  isStreaming: boolean; // 是否正在打字
  stopStreaming: () => void; // 中止流的方法
}
```

- **TanStack Query (Server State):**
- `useQuery(["chatHistory"])`: 用于驱动侧边栏历史会话列表的加载与缓存。
- `useMutation`: 用于在用户删除会话时，自动乐观更新（Optimistic Updates）侧边栏 UI。

## Command for UI Generation:

> "Please generate a highly polished React UI layout based on the functional markdown description above. Prioritize using Tailwind CSS semantic classes for a borderless, dark-themed cyber aesthetic, and mock the interactive state elements (like modas, dropdowns, and switches) as defined in the KUMO UI component specifications."
