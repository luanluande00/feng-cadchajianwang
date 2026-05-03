# CAD插件商城 - 实施计划

## 项目信息
- **项目名称**: CyberCAD Marketplace
- **技术栈**: Next.js 14 + React + TypeScript + Prisma + PostgreSQL
- **风格**: 赛博朋克
- **部署**: Vercel

---

## 实施步骤

### 第一阶段：项目初始化与环境搭建

#### 1.1 创建Next.js项目
```bash
npx create-next-app@latest . --typescript --tailwind --app --eslint --src-dir --import-alias "@/*"
```

#### 1.2 安装必要依赖
- `prisma` - 数据库ORM
- `@prisma/client` - Prisma客户端
- `bcryptjs` - 密码加密
- `jsonwebtoken` - JWT认证
- `zod` - 数据验证
- `zustand` - 状态管理
- `framer-motion` - 动画库
- `lucide-react` - 图标库
- `nodemailer` - 邮件发送
- `resend` - 邮件服务（可选）

#### 1.3 初始化Prisma
```bash
npx prisma init
```

#### 1.4 配置环境变量
创建 `.env` 和 `.env.example` 文件

#### 1.5 配置ESLint和Prettier
- 安装 `prettier`
- 配置 `.prettierrc`

---

### 第二阶段：数据库设计与认证系统

#### 2.1 创建数据库模型
- 编辑 `prisma/schema.prisma`
- 定义 User, Plugin, Download, Transaction, PaymentOrder 模型
- 执行 `npx prisma generate`
- 执行 `npx prisma db push`

#### 2.2 创建数据库连接
- 创建 `src/lib/prisma.ts`
- 实现单例模式避免连接池溢出

#### 2.3 实现用户注册
- 创建 `src/app/api/auth/register/route.ts`
- 使用Zod验证请求体
- bcrypt加密密码
- 创建用户记录，赠送100积分
- 发送验证邮件

#### 2.4 实现用户登录
- 创建 `src/app/api/auth/login/route.ts`
- 验证用户名/密码
- 生成JWT Token
- 设置HttpOnly Cookie

#### 2.5 实现认证中间件
- 创建 `src/lib/auth.ts`
- JWT验证逻辑
- 创建 `src/middleware.ts` 路由保护

#### 2.6 邮箱验证
- 创建 `src/app/api/auth/verify-email/route.ts`
- 生成验证Token
- 发送验证邮件
- 验证回调处理

#### 2.7 前端认证页面
- 创建 `src/app/(auth)/login/page.tsx`
- 创建 `src/app/(auth)/register/page.tsx`
- 创建 `src/app/(auth)/verify/page.tsx`
- 实现表单验证和提交逻辑

---

### 第三阶段：赛博朋克UI系统

#### 3.1 设计Token
- 在 `src/app/globals.css` 定义CSS变量
- 配置霓虹色彩方案
- 配置渐变和阴影

#### 3.2 配置Tailwind
- 编辑 `tailwind.config.ts`
- 添加自定义颜色
- 添加自定义动画（发光、故障、扫描线）
- 添加自定义字体（Orbitron, Rajdhani）

#### 3.3 创建基础组件
- `src/components/ui/Button.tsx` - 赛博朋克按钮
- `src/components/ui/Input.tsx` - 赛博朋克输入框
- `src/components/ui/Card.tsx` - 赛博朋克卡片
- `src/components/ui/Badge.tsx` - 霓虹标签
- `src/components/ui/Modal.tsx` - 模态框

#### 3.4 创建布局组件
- `src/components/layout/Header.tsx` - 顶部导航
- `src/components/layout/Footer.tsx` - 底部导航
- `src/components/layout/Sidebar.tsx` - 侧边栏
- `src/components/layout/CyberBackground.tsx` - 粒子背景

#### 3.5 创建特效组件
- `src/components/cyberpunk/NeonGlow.tsx` - 发光效果
- `src/components/cyberpunk/GlitchText.tsx` - 故障文字
- `src/components/cyberpunk/ScanLine.tsx` - 扫描线
- `src/components/cyberpunk/Particles.tsx` - 粒子效果

#### 3.6 创建根布局
- 编辑 `src/app/layout.tsx`
- 集成全局Provider
- 添加字体和样式

---

### 第四阶段：首页与插件商城

#### 4.1 首页开发
- 创建 `src/app/page.tsx`
- Hero Section（赛博朋克标题）
- 热门插件展示
- 最新插件列表
- 推荐开发者

#### 4.2 插件API
- 创建 `src/app/api/plugins/route.ts` - 列表和创建
- 创建 `src/app/api/plugins/[id]/route.ts` - 详情、更新、删除
- 创建 `src/app/api/plugins/[id]/download/route.ts` - 下载

#### 4.3 插件列表页
- 创建 `src/app/marketplace/page.tsx`
- 实现分页
- 实现搜索功能
- 实现分类筛选

#### 4.4 插件详情页
- 创建 `src/app/marketplace/plugin/[id]/page.tsx`
- 插件信息展示
- 下载按钮
- 评论区域（预留）

#### 4.5 插件发布功能
- 创建 `src/app/developer/publish/page.tsx`
- 文件上传组件
- 表单验证
- 提交审核

#### 4.6 文件存储
- 集成 Vercel Blob
- 实现上传API
- 文件类型验证（.lsp, .dll, .vlx等）
- 文件大小限制

---

### 第五阶段：积分与支付系统

#### 5.1 积分API
- 创建 `src/app/api/points/balance/route.ts`
- 创建 `src/app/api/points/history/route.ts`
- 实现积分扣除逻辑（下载插件）
- 实现积分增加逻辑（插件被下载）

#### 5.2 积分页面
- 创建 `src/app/profile/points/page.tsx`
- 余额展示
- 积分明细列表
- 充值入口

#### 5.3 支付API
- 创建 `src/app/api/payment/create/route.ts`
- 创建 `src/app/api/payment/callback/route.ts`
- 创建 `src/app/api/payment/status/[orderId]/route.ts`
- 集成支付宝/微信支付SDK

#### 5.4 充值页面
- 创建 `src/app/profile/recharge/page.tsx`
- 充值金额选择
- 支付方式选择
- 订单状态展示

#### 5.5 支付回调处理
- 验证签名
- 更新订单状态
- 增加用户积分
- 记录交易流水

---

### 第六阶段：用户中心与开发者中心

#### 6.1 用户中心布局
- 创建 `src/app/profile/layout.tsx`
- 侧边栏导航
- 个人信息展示

#### 6.2 个人信息
- 创建 `src/app/profile/info/page.tsx`
- 修改用户名
- 修改头像
- 修改密码

#### 6.3 下载历史
- 创建 `src/app/profile/downloads/page.tsx`
- 下载列表展示
- 重新下载功能

#### 6.4 开发者中心
- 创建 `src/app/developer/layout.tsx`
- 创建 `src/app/developer/page.tsx` - 仪表盘

#### 6.5 我的插件
- 创建 `src/app/developer/plugins/page.tsx`
- 插件列表
- 编辑和删除
- 状态查看

#### 6.6 销售统计
- 创建 `src/app/developer/stats/page.tsx`
- 使用Chart.js展示数据
- 销售额统计
- 下载量统计

#### 6.7 提现功能
- 创建 `src/app/developer/withdraw/page.tsx`
- 提现申请
- 提现记录
- 最低提现限制（1000积分）

---

### 第七阶段：管理后台

#### 7.1 管理后台布局
- 创建 `src/app/admin/layout.tsx`
- 管理员权限验证
- 管理导航

#### 7.2 插件审核
- 创建 `src/app/admin/review/page.tsx`
- 待审核列表
- 审核通过/拒绝
- 审核备注

#### 7.3 用户管理
- 创建 `src/app/admin/users/page.tsx`
- 用户列表
- 用户搜索
- 角色管理

#### 7.4 数据统计
- 创建 `src/app/admin/stats/page.tsx`
- 平台总览
- 用户增长
- 交易统计

---

### 第八阶段：测试与优化

#### 8.1 功能测试
- 注册登录流程测试
- 插件发布和下载测试
- 支付流程测试
- 积分系统测试

#### 8.2 性能优化
- 图片优化（Next/Image）
- 数据库查询优化
- API响应缓存
- 组件懒加载

#### 8.3 安全加固
- CSRF保护
- 速率限制
- SQL注入防护
- XSS防护
- 敏感信息加密

#### 8.4 SEO优化
- 元标签配置
- Sitemap生成
- robots.txt配置
- 结构化数据

---

### 第九阶段：部署上线

#### 9.1 环境准备
- 注册Vercel账号
- 注册Supabase账号
- 创建PostgreSQL数据库
- 配置环境变量

#### 9.2 数据库迁移
- 执行 `npx prisma generate`
- 执行 `npx prisma db push`
- 初始化枚举数据

#### 9.3 部署到Vercel
- 连接GitHub仓库
- 配置构建设置
- 添加环境变量
- 触发部署

#### 9.4 域名配置
- 购买域名
- 配置DNS
- Vercel绑定域名
- HTTPS证书自动配置

#### 9.5 监控设置
- 配置Vercel Analytics
- 配置错误监控（Sentry）
- 配置日志查看

---

## 技术要点说明

### 认证流程
1. 注册：邮箱+密码 → bcrypt加密 → 创建用户 → 送100积分 → 发验证邮件
2. 登录：邮箱+密码 → 验证 → 生成JWT → 设置HttpOnly Cookie
3. 验证：Token验证 → 更新isVerified字段

### 积分系统
1. 数据库事务保证积分操作原子性
2. 每次积分变动记录Transaction
3. 积分不能为负数
4. 下载付费插件时：买家扣积分，卖家获得70%，平台抽30%

### 支付流程
1. 创建订单 → 调用支付API → 获取支付链接 → 用户支付
2. 支付回调 → 验证签名 → 更新订单 → 增加积分
3. 订单超时自动取消

### 文件上传
1. 验证文件类型和大小
2. 上传到Vercel Blob
3. 存储URL到数据库
4. 下载时生成带有效期的临时链接

---

## 注意事项

1. **严格按照顺序执行**，不要跳步
2. **每完成一个阶段**，更新说明文档中的进度记录
3. **频繁提交代码**，保持代码随时可工作
4. **遇到问题**，先查阅官方文档，不要自行编造
5. **所有函数**必须添加函数级注释
6. **代码超过20行**，考虑拆分函数
7. **关键节点**添加中文注释

---

*创建时间：2026-05-03*
