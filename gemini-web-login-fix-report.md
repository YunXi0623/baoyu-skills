# baoyu-danger-gemini-web 登录问题修复记录

## 修复日期：2026-04-04

## 问题概述

在 Windows 环境下运行 `baoyu-danger-gemini-web` 技能的 `--login` 功能时，无法成功完成 Gemini Web 登录并获取 Cookie。

---

## 问题 1：Windows 下找不到 Chrome 可执行文件

**文件**: `scripts/gemini-webapi/utils/load-browser-cookies.ts` (第 125-129 行)

**原因**: Windows 的 Chrome 路径使用了双重转义，导致路径字符串不正确。

```typescript
// 修复前（错误）
'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe'
// TypeScript 解析后变成: C:\\Program Files\\... （带双反斜杠，路径无效）

// 修复后（正确）
'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
// TypeScript 解析后变成: C:\Program Files\... （正确路径）
```

**影响**: Windows 上自动检测不到 Chrome，无法启动浏览器进行登录。

---

## 问题 2：Windows 不支持 Unix 进程信号

**文件**: `scripts/gemini-webapi/utils/load-browser-cookies.ts` (第 263-272 行)

**原因**: 代码使用 `SIGTERM` 和 `SIGKILL` 信号终止 Chrome 进程，这两个信号在 Windows 上不被支持。

```typescript
// 修复前
chrome.kill('SIGTERM');
chrome.kill('SIGKILL');

// 修复后
if (process.platform === 'win32') {
  chrome.kill();  // Windows 使用 TerminateProcess
} else {
  chrome.kill('SIGTERM');  // Unix 使用信号
}
```

**影响**: Chrome 进程在 Windows 上无法被正确终止，可能导致残留进程。

---

## 问题 3：CDP 抓取 Cookie 后验证超时

**文件**: `scripts/gemini-webapi/utils/load-browser-cookies.ts` (第 234-254 行)

**原因**: CDP 成功通过 Chrome 抓取到了完整的 Cookie（包括关键的 `__Secure-1PSID` 和 `__Secure-1PSIDTS`），但 `is_gemini_session_ready` 函数用这些 Cookie 通过 `fetch` 去请求 `gemini.google.com/app` 验证有效性时失败了，因为 `fetch` 请求没走代理，无法访问 Google 服务。循环验证直到超时报错。

```typescript
// 修复前：必须通过网络验证才返回 Cookie
if (await is_gemini_session_ready(m, verbose)) {
  return m;
}

// 修复后：有关键 Cookie 时，网络验证失败也接受
if (m['__Secure-1PSID'] && m['__Secure-1PSIDTS']) {
  if (await is_gemini_session_ready(m, verbose)) {
    return m;
  }
  // 网络验证失败但关键 Cookie 已获取，直接信任
  if (verbose) logger.debug('Session validation via network failed, but key cookies found.');
  return m;
}
```

**影响**: 在需要代理的网络环境下，即使 Chrome 已经成功登录，Cookie 也无法保存。

---

## 问题 4：Bun 的 fetch 不走代理

**文件**: `scripts/main.ts` (入口文件)

**原因**: 用户的代理配置在 `~/.baoyu-skills/.env` 文件中（`HTTPS_PROXY=http://127.0.0.1:7890`），但存在两个问题：

1. 脚本没有加载 `.env` 文件的逻辑
2. **关键发现**: Bun 的 `fetch` 只在**进程启动时**读取 `HTTPS_PROXY` 环境变量，运行时通过 `process.env` 动态设置无效

**验证过程**:

```bash
# 启动前设置环境变量 → 成功
HTTPS_PROXY=http://127.0.0.1:7890 npx -y bun test.ts  # fetch status: 200

# 运行时通过代码设置 → 失败
process.env.HTTPS_PROXY = 'http://127.0.0.1:7890';
fetch('https://gemini.google.com/app')  # error: Unable to connect
```

**解决方案**: 在 `main.ts` 入口使用 re-exec 机制：

```typescript
// 1. 检测 .env 文件是否存在
// 2. 解析出代理等环境变量
// 3. 如果有代理变量但当前进程没有，用 Bun.spawn 重启自身并传入正确的环境变量
// 4. 用 __BAOYU_ENV_LOADED 标记防止无限重启

if (!process.env.__BAOYU_ENV_LOADED) {
  const envFile = findEnvFile();
  if (envFile) {
    const vars = parseEnvFile(envFile);
    const needReExec = ['HTTPS_PROXY', 'HTTP_PROXY'].some((k) => vars[k] && !process.env[k]);
    if (needReExec) {
      const merged = { ...process.env, ...vars, __BAOYU_ENV_LOADED: '1' };
      const child = Bun.spawn([process.execPath, ...process.argv.slice(1)], { env: merged, ... });
      const code = await child.exited;
      process.exit(code);
    }
  }
}
```

**影响**: 所有依赖代理访问 Google 的请求（登录、生成内容、刷新 Cookie 等）全部失败。

---

## 修复后的验证

```bash
# 登录测试 - 成功
npx -y bun skills/baoyu-danger-gemini-web/scripts/main.ts --login
# 输出: Cookie refreshed: C:\Users\18476\AppData\Roaming\baoyu-skills\gemini-web\cookies.json

# 文本生成测试 - 成功
npx -y bun skills/baoyu-danger-gemini-web/scripts/main.ts "Hello, just testing."
# 输出: Acknowledged.

# 图片生成测试 - 成功
npx -y bun skills/baoyu-danger-gemini-web/scripts/main.ts --prompt "A cute orange cat" --image test-cat.png
# 输出: test-cat.png (图片生成成功)
```

---

## 经验总结

| 经验 | 说明 |
|------|------|
| Windows 路径转义 | TypeScript 字符串中 `\\\\` 会变成 `\\`，Windows 路径只需要 `\\` 即一个反斜杠 |
| 跨平台进程管理 | Windows 不支持 Unix 信号，`kill()` 不带参数使用 `TerminateProcess` |
| 网络验证容错 | 在代理环境下，网络验证可能不通，应对已获取的关键数据做降级处理 |
| Bun fetch 代理 | Bun 只在启动时读取 `HTTPS_PROXY`，运行时设置 `process.env` 无效，需要 re-exec |
| .env 加载 | 项目中没有自动加载 `.env` 的机制，需要手动实现或用 Bun 的 `--env-file` 参数 |
