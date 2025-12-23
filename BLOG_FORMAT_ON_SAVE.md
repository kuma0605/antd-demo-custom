# 配置 VS Code / Cursor 保存时自动格式化代码

> 一键配置，让 `Ctrl+S` (Windows/Linux) 或 `Cmd+S` (Mac) 保存时自动格式化代码，提升开发效率。

## 📋 目录

- [功能说明](#功能说明)
- [安装依赖](#安装依赖)
- [配置文件](#配置文件)
- [VS Code 设置](#vs-code-设置)
- [使用说明](#使用说明)
- [常见问题](#常见问题)

## 功能说明

配置完成后，当你按下 `Ctrl+S` (Windows/Linux) 或 `Cmd+S` (Mac) 保存文件时，编辑器会自动：

1. ✅ **格式化代码**：使用 Prettier 自动格式化代码风格
2. ✅ **修复 ESLint 错误**：自动修复可修复的 ESLint 问题
3. ✅ **统一代码风格**：确保团队代码风格一致

## 安装依赖

### 1. 安装 Prettier 和 ESLint 配置

```bash
pnpm add -D prettier eslint-config-prettier
```

或者使用 npm：

```bash
npm install -D prettier eslint-config-prettier
```

### 2. 安装 VS Code 扩展（必需）

在 VS Code 或 Cursor 中安装以下扩展：

- **Prettier - Code formatter** (`esbenp.prettier-vscode`)
- **ESLint** (`dbaeumer.vscode-eslint`)

安装方式：

1. 按 `Ctrl+Shift+X` (Windows/Linux) 或 `Cmd+Shift+X` (Mac) 打开扩展面板
2. 搜索 "Prettier" 和 "ESLint"
3. 点击安装

## 配置文件

### 1. 创建 Prettier 配置文件

创建 `.prettierrc` 文件：

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

**配置说明：**

- `semi: false` - 不使用分号
- `singleQuote: true` - 使用单引号
- `tabWidth: 2` - 缩进 2 个空格
- `trailingComma: "es5"` - 在 ES5 兼容的地方添加尾随逗号
- `printWidth: 100` - 每行最大 100 个字符
- `arrowParens: "avoid"` - 箭头函数参数只有一个时省略括号
- `endOfLine: "lf"` - 使用 LF 换行符（Unix 风格）

### 2. 创建 Prettier 忽略文件

创建 `.prettierignore` 文件：

```
# Dependencies
node_modules
pnpm-lock.yaml
package-lock.json
yarn.lock

# Build outputs
dist
build
.tanstack

# Generated files
routeTree.gen.ts
*.gen.ts

# Logs
*.log

# Environment
.env
.env.local

# IDE
.vscode
.idea

# OS
.DS_Store
Thumbs.db
```

### 3. 更新 ESLint 配置

在 `eslint.config.js` 中添加 Prettier 配置（避免冲突）：

```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettier, // 必须放在最后，覆盖其他配置
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
```

### 4. 更新 package.json 脚本

在 `package.json` 中添加格式化脚本：

```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,scss,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,json,css,scss,md}\"",
    "lint:fix": "eslint . --fix"
  }
}
```

## VS Code 设置

### 创建项目级设置

在项目根目录创建 `.vscode/settings.json` 文件：

```json
{
  // 保存时自动格式化
  "editor.formatOnSave": true,

  // 保存时自动修复 ESLint 错误
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },

  // 默认格式化工具
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  // 为特定文件类型指定格式化工具
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  // Prettier 配置
  "prettier.requireConfig": true,

  // 文件保存时自动格式化（关闭自动保存，手动保存时格式化）
  "files.autoSave": "off"
}
```

### 配置说明

- `editor.formatOnSave: true` - 保存时自动格式化
- `editor.codeActionsOnSave` - 保存时执行代码操作（修复 ESLint 错误）
- `editor.defaultFormatter` - 默认使用 Prettier 格式化
- `prettier.requireConfig: true` - 要求项目中有 Prettier 配置文件才格式化

## 使用说明

### 1. 自动格式化

配置完成后，每次保存文件（`Ctrl+S` / `Cmd+S`）时，代码会自动格式化。

**示例：**

保存前：

```typescript
const user = { name: 'Dylan', age: 25 }
function greet(user) {
  return `Hello,${user.name}`
}
```

保存后（自动格式化）：

```typescript
const user = { name: 'Dylan', age: 25 }
function greet(user) {
  return `Hello, ${user.name}`
}
```

### 2. 手动格式化

如果需要手动格式化整个项目：

```bash
# 格式化所有文件
pnpm format

# 检查格式（不修改文件）
pnpm format:check

# 修复 ESLint 错误
pnpm lint:fix
```

### 3. 格式化特定文件

在 VS Code 中：

1. 右键点击文件
2. 选择 "Format Document" 或按 `Shift+Alt+F` (Windows/Linux) / `Shift+Option+F` (Mac)

## 常见问题

### Q1: 保存时没有自动格式化？

**检查清单：**

1. ✅ 确认已安装 Prettier 扩展
2. ✅ 确认 `.vscode/settings.json` 文件存在且配置正确
3. ✅ 确认项目根目录有 `.prettierrc` 文件
4. ✅ 重启 VS Code / Cursor

### Q2: Prettier 和 ESLint 冲突？

确保：

1. 安装了 `eslint-config-prettier`
2. 在 `eslint.config.js` 中，`prettier` 配置放在 `extends` 数组的**最后**

### Q3: 某些文件不想格式化？

在 `.prettierignore` 文件中添加要忽略的文件或目录。

### Q4: 如何自定义格式化规则？

修改 `.prettierrc` 文件中的配置项。所有配置选项参考：[Prettier 官方文档](https://prettier.io/docs/en/options.html)

### Q5: 团队如何统一配置？

1. 将 `.prettierrc` 和 `.vscode/settings.json` 提交到 Git
2. 团队成员拉取代码后，配置会自动生效
3. 确保所有成员都安装了 Prettier 扩展

## 总结

通过以上配置，你可以实现：

- ✅ 保存时自动格式化代码
- ✅ 自动修复 ESLint 错误
- ✅ 统一团队代码风格
- ✅ 提升开发效率

**推荐工作流：**

1. 编写代码
2. 按 `Ctrl+S` / `Cmd+S` 保存
3. 代码自动格式化 ✅

---

**相关资源：**

- [Prettier 官方文档](https://prettier.io/)
- [ESLint 官方文档](https://eslint.org/)
- [VS Code 设置文档](https://code.visualstudio.com/docs/getstarted/settings)
