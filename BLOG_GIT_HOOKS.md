# 配置 Git Hooks：使用 Husky + lint-staged 自动代码检查

> 在提交代码前自动运行 ESLint 和 Prettier，确保提交的代码符合规范。

## 📋 目录

- [功能说明](#功能说明)
- [安装依赖](#安装依赖)
- [配置文件](#配置文件)
- [初始化 Husky](#初始化-husky)
- [使用说明](#使用说明)
- [工作原理](#工作原理)
- [常见问题](#常见问题)

## 功能说明

配置完成后，当你执行 `git commit` 时，会自动：

1. ✅ **运行 lint-staged**：只检查暂存区（staged）的文件
2. ✅ **自动修复 ESLint 错误**：修复可自动修复的问题
3. ✅ **自动格式化代码**：使用 Prettier 格式化代码
4. ✅ **阻止不规范提交**：如果有无法自动修复的错误，会阻止提交

## 安装依赖

### 1. 安装 Husky 和 lint-staged

```bash
pnpm add -D husky lint-staged
```

或者使用 npm：

```bash
npm install -D husky lint-staged
```

### 2. 更新 package.json

在 `package.json` 的 `scripts` 中添加 `prepare` 脚本：

```json
{
  "scripts": {
    "prepare": "husky"
  }
}
```

**说明：** `prepare` 脚本会在 `npm install` 或 `pnpm install` 后自动运行，初始化 Husky。

## 配置文件

### 1. 创建 lint-staged 配置

创建 `.lintstagedrc.json` 文件：

```json
{
  "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
  "*.{json,css,scss,md}": ["prettier --write"]
}
```

**配置说明：**

- `*.{ts,tsx,js,jsx}`：对 TypeScript/JavaScript 文件运行 ESLint 修复和 Prettier 格式化
- `*.{json,css,scss,md}`：对 JSON、CSS、Markdown 文件运行 Prettier 格式化

### 2. 初始化 Husky

运行以下命令初始化 Husky：

```bash
npx husky init
```

或者手动创建 `.husky` 目录：

```bash
mkdir -p .husky
```

### 3. 创建 pre-commit Hook

创建 `.husky/pre-commit` 文件：

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

**重要：** 确保文件有执行权限：

```bash
chmod +x .husky/pre-commit
```

## 初始化 Husky

### 方法 1：使用 husky init（推荐）

```bash
npx husky init
```

这个命令会：

- 创建 `.husky` 目录
- 创建 `_` 目录（Husky 内部文件）
- 添加 `prepare` 脚本到 `package.json`（如果还没有）

### 方法 2：手动初始化

如果 `husky init` 失败，可以手动创建：

```bash
# 创建 .husky 目录
mkdir -p .husky

# 创建 pre-commit hook
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
EOF

# 添加执行权限
chmod +x .husky/pre-commit
```

## 使用说明

### 1. 正常提交流程

配置完成后，正常的提交流程：

```bash
# 1. 添加文件到暂存区
git add .

# 2. 提交（会自动运行 lint-staged）
git commit -m "feat: 添加新功能"
```

**执行过程：**

1. 运行 `lint-staged`
2. 对暂存区的文件运行 ESLint 和 Prettier
3. 如果有无法修复的错误，提交会被阻止
4. 如果所有检查通过，提交成功

### 2. 跳过 Git Hooks（不推荐）

如果需要跳过 Git Hooks（紧急情况）：

```bash
git commit --no-verify -m "紧急修复"
```

⚠️ **注意：** 只在紧急情况下使用，不要养成习惯。

### 3. 手动运行 lint-staged

可以手动运行 lint-staged 检查：

```bash
npx lint-staged
```

## 工作原理

### 工作流程

```
git commit
    ↓
触发 pre-commit hook
    ↓
运行 lint-staged
    ↓
检查暂存区文件
    ↓
运行 ESLint --fix
    ↓
运行 Prettier --write
    ↓
如果有错误 → 阻止提交
如果通过 → 继续提交
```

### lint-staged 的优势

1. **只检查暂存区文件**：提高效率，不检查整个项目
2. **自动修复**：修复可修复的问题，减少手动操作
3. **并行处理**：可以同时处理多个文件

## 常见问题

### Q1: pre-commit hook 没有执行？

**检查清单：**

1. ✅ 确认 `.husky/pre-commit` 文件存在
2. ✅ 确认文件有执行权限：`chmod +x .husky/pre-commit`
3. ✅ 确认已运行 `pnpm install` 或 `npm install`（会运行 `prepare` 脚本）
4. ✅ 确认 `package.json` 中有 `prepare: "husky"` 脚本

### Q2: lint-staged 没有运行？

**检查清单：**

1. ✅ 确认 `.lintstagedrc.json` 文件存在
2. ✅ 确认有文件在暂存区（`git add` 后）
3. ✅ 确认 lint-staged 已安装：`pnpm list lint-staged`

### Q3: 如何修改 lint-staged 配置？

编辑 `.lintstagedrc.json` 文件，修改匹配规则和命令。

**示例：** 添加对 Vue 文件的支持：

```json
{
  "*.{ts,tsx,js,jsx,vue}": ["eslint --fix", "prettier --write"]
}
```

### Q4: 如何添加更多 Git Hooks？

可以创建其他 hook 文件，例如：

- `.husky/pre-push`：推送前检查
- `.husky/commit-msg`：检查 commit message 格式

**示例：pre-push hook**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# 运行测试
pnpm test

# 运行类型检查
pnpm type-check
```

### Q5: 如何配置 commit message 规范？

可以使用 `commit-msg` hook 配合 `commitlint`：

```bash
# 安装 commitlint
pnpm add -D @commitlint/cli @commitlint/config-conventional

# 创建 .husky/commit-msg
cat > .husky/commit-msg << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit ${1}
EOF

chmod +x .husky/commit-msg
```

### Q6: 团队协作注意事项

1. **提交配置文件**：确保 `.husky` 目录和配置文件都提交到 Git
2. **统一依赖版本**：使用 `pnpm-lock.yaml` 或 `package-lock.json` 锁定版本
3. **文档说明**：在 README 中说明 Git Hooks 的使用

## 完整配置示例

### package.json

```json
{
  "scripts": {
    "prepare": "husky",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,scss,md}\""
  },
  "devDependencies": {
    "husky": "^9.1.7",
    "lint-staged": "^15.2.11",
    "eslint": "^9.39.1",
    "prettier": "^3.4.2"
  }
}
```

### .lintstagedrc.json

```json
{
  "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
  "*.{json,css,scss,md}": ["prettier --write"]
}
```

### .husky/pre-commit

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

## 总结

通过配置 Husky + lint-staged，你可以：

- ✅ 自动检查代码质量
- ✅ 自动修复可修复的问题
- ✅ 自动格式化代码
- ✅ 防止不规范代码进入仓库
- ✅ 提升团队代码质量

**推荐工作流：**

1. 编写代码
2. `git add .`
3. `git commit -m "feat: 新功能"`
4. Git Hooks 自动检查和格式化 ✅
5. 提交成功

---

**相关资源：**

- [Husky 官方文档](https://typicode.github.io/husky/)
- [lint-staged 官方文档](https://github.com/lint-staged/lint-staged)
- [Git Hooks 文档](https://git-scm.com/docs/githooks)
