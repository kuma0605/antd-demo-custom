# 配置 Git Commit Message 规范

> 使用 commitlint 规范 commit message 格式，统一团队提交信息风格。

## 📋 目录

- [功能说明](#功能说明)
- [安装依赖](#安装依赖)
- [配置文件](#配置文件)
- [Commit 类型说明](#commit-类型说明)
- [使用示例](#使用示例)
- [常见问题](#常见问题)

## 功能说明

配置完成后，当你执行 `git commit` 时，会自动：

1. ✅ **检查 commit message 格式**：确保符合规范
2. ✅ **阻止不规范提交**：如果格式不正确，会阻止提交
3. ✅ **统一团队规范**：所有成员使用相同的提交格式

## 安装依赖

### 安装 commitlint

```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional
```

或者使用 npm：

```bash
npm install -D @commitlint/cli @commitlint/config-conventional
```

## 配置文件

### 1. 创建 commitlint 配置

创建 `commitlint.config.js` 文件：

```javascript
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // type 类型定义，表示 git 提交的 type 必须在以下类型范围内
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能 feature
        'fix', // 修复 bug
        'docs', // 文档注释
        'style', // 代码格式(不影响代码运行的变动)
        'refactor', // 重构(既不增加新功能，也不是修复bug)
        'perf', // 性能优化
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回退
        'build', // 打包
        'ci', // CI 配置文件和脚本的变更
      ],
    ],
    // subject 大小写不做校验
    'subject-case': [0],
  },
}
```

### 2. 创建 commit-msg Hook

创建 `.husky/commit-msg` 文件：

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit ${1}
```

**重要：** 确保文件有执行权限：

```bash
chmod +x .husky/commit-msg
```

## Commit 类型说明

### 标准格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

| Type       | 说明                   | 示例                            |
| ---------- | ---------------------- | ------------------------------- |
| `feat`     | 新功能                 | `feat: 添加用户登录功能`        |
| `fix`      | 修复 bug               | `fix: 修复登录页面验证问题`     |
| `docs`     | 文档更新               | `docs: 更新 README 说明`        |
| `style`    | 代码格式（不影响功能） | `style: 格式化代码`             |
| `refactor` | 重构代码               | `refactor: 重构用户服务模块`    |
| `perf`     | 性能优化               | `perf: 优化列表渲染性能`        |
| `test`     | 测试相关               | `test: 添加用户登录测试`        |
| `chore`    | 构建/工具变动          | `chore: 更新依赖版本`           |
| `revert`   | 回退提交               | `revert: 回退 feat: 添加新功能` |
| `build`    | 构建相关               | `build: 更新构建配置`           |
| `ci`       | CI 配置                | `ci: 添加 GitHub Actions`       |

### Scope（可选）

表示影响范围，例如：

- `feat(user): 添加用户注册功能`
- `fix(router): 修复路由跳转问题`
- `refactor(api): 重构 API 接口`

### Subject

简短描述，不超过 50 个字符：

- ✅ 使用中文或英文
- ✅ 首字母小写
- ✅ 结尾不加句号
- ❌ 不要使用过去式

## 使用示例

### ✅ 正确的 Commit Message

```bash
# 新功能
git commit -m "feat: 添加用户登录功能"

# 修复 bug
git commit -m "fix: 修复登录页面验证问题"

# 文档更新
git commit -m "docs: 更新 API 文档"

# 代码重构
git commit -m "refactor: 重构用户服务模块"

# 性能优化
git commit -m "perf: 优化列表渲染性能"

# 带 scope
git commit -m "feat(user): 添加用户注册功能"
git commit -m "fix(router): 修复路由跳转问题"
```

### ❌ 错误的 Commit Message

```bash
# 缺少 type
git commit -m "添加新功能"  # ❌ 错误

# type 不在允许列表中
git commit -m "update: 更新代码"  # ❌ 错误，应该是 chore

# 格式不正确
git commit -m "添加新功能"  # ❌ 错误，缺少 type
```

### 多行 Commit Message

```bash
git commit -m "feat: 添加用户登录功能

- 实现用户名密码登录
- 添加记住密码功能
- 添加登录状态持久化"
```

## 常见问题

### Q1: commit-msg hook 没有执行？

**检查清单：**

1. ✅ 确认 `.husky/commit-msg` 文件存在
2. ✅ 确认文件有执行权限：`chmod +x .husky/commit-msg`
3. ✅ 确认已运行 `pnpm install` 或 `npm install`
4. ✅ 确认 commitlint 已安装：`pnpm list @commitlint/cli`

### Q2: 如何跳过 commitlint 检查？

如果需要跳过检查（紧急情况）：

```bash
git commit --no-verify -m "紧急修复"
```

⚠️ **注意：** 只在紧急情况下使用，不要养成习惯。

### Q3: 如何修改允许的 type 类型？

编辑 `commitlint.config.js` 文件，修改 `type-enum` 规则中的类型列表。

### Q4: 如何自定义规则？

在 `commitlint.config.js` 中添加更多规则：

```javascript
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'docs']],
    'subject-max-length': [2, 'always', 50], // subject 最大长度
    'subject-min-length': [2, 'always', 10], // subject 最小长度
  },
}
```

### Q5: 团队如何统一规范？

1. **提交配置文件**：确保 `commitlint.config.js` 和 `.husky/commit-msg` 都提交到 Git
2. **文档说明**：在 README 中说明 commit message 规范
3. **代码审查**：在 PR 中检查 commit message 格式

## 完整配置示例

### commitlint.config.js

```javascript
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'revert',
        'build',
        'ci',
      ],
    ],
    'subject-case': [0],
  },
}
```

### .husky/commit-msg

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit ${1}
```

### package.json

```json
{
  "devDependencies": {
    "@commitlint/cli": "^19.6.0",
    "@commitlint/config-conventional": "^19.6.0",
    "husky": "^9.1.7"
  }
}
```

## 总结

通过配置 commitlint，你可以：

- ✅ 统一 commit message 格式
- ✅ 提高代码可读性
- ✅ 便于生成 changelog
- ✅ 提升团队协作效率

**推荐工作流：**

1. 编写代码
2. `git add .`
3. `git commit -m "feat: 新功能描述"`
4. commitlint 自动检查格式 ✅
5. 如果格式正确，提交成功

---

**相关资源：**

- [commitlint 官方文档](https://commitlint.js.org/)
- [Conventional Commits 规范](https://www.conventionalcommits.org/)
- [Husky 官方文档](https://typicode.github.io/husky/)
