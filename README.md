# React + TypeScript 后端API测试平台

## 🎯 项目背景

本项目是一个基于React 18和TypeScript构建的企业级前端项目，专门用于后端API服务的集成测试和联调。项目提供了四种完整的功能页面模板，支持对后端服务的CRUD操作进行全面测试。

## ✨ 核心特性

- **📝 新增数据模板** - 完整的数据创建功能，支持表单验证和实时反馈
- **🔍 查询渲染模板** - 数据列表展示，支持自动刷新和详情查看
- **🔄 更新数据模板** - 数据编辑功能，支持部分字段更新
- **🗑️ 删除操作模板** - 安全的数据删除，包含确认机制
- **🚀 企业级架构** - TypeScript强类型支持，组件化设计
- **📱 响应式设计** - 支持桌面端和移动端适配

## ✅ 已完成的功能
1. 四种功能页面模板 - 完整的CRUD操作界面
2. API服务层 - 统一的axios配置和错误处理
3. TypeScript支持 - 完整的类型定义
4. 响应式设计 - 移动端和桌面端适配
5. 完整文档 - 详细的README使用指南
   
## 🏗️ 项目结构
```bash
react-ts-mock-backend-sever/
├── public/                 # 静态资源
│   └── index.html         # HTML模板
├── src/                   # 源代码
│   ├── components/        # 组件目录
│   │   ├── CreateTemplate.tsx    # 新增数据模板
│   │   ├── QueryTemplate.tsx     # 查询渲染模板
│   │   ├── DeleteTemplate.tsx    # 删除操作模板
│   │   └── UpdateTemplate.tsx    # 更新数据模板
│   ├── services/          # 服务层
│   │   └── api.ts         # API服务封装
│   ├── App.tsx            # 主应用组件
│   ├── App.css            # 应用样式
│   ├── index.tsx          # 应用入口
│   ├── index.css          # 全局样式
│   └── react-app-env.d.ts # TypeScript声明
├── .env                   # 环境配置
├── .env.example           # 环境配置示例
├── .gitignore            # Git忽略规则
├── package.json          # 项目依赖
├── tsconfig.json         # TypeScript配置
└── README.md             # 项目文档
```

## 🚀 快速开始

### 环境要求

- Node.js 16.0.0 或更高版本
- npm 8.0.0 或更高版本
- 现代浏览器（Chrome、Firefox、Safari、Edge）

### 安装步骤

1. **安装依赖**
   ```bash
   npm install
   ```

2. **配置环境变量**
   ```bash
   cp .env.example .env
   ```
   
   编辑 `.env` 文件，设置您的API基础URL：
   ```env
   REACT_APP_API_BASE_URL=http://your-backend-server:port/api
   ```

3. **启动开发服务器**
   ```bash
   npm start
   ```

4. **访问应用**
   打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
# 构建生产版本
npm run build

# 启动本地服务器预览构建结果
npx serve -s build
```

## 📋 功能模板使用指南

### 1. 新增数据模板 (CreateTemplate)
- **功能**: 创建新的数据记录
- **使用方法**: 填写表单字段，点击"提交创建"
- **接口**: `POST /api/data`
- **字段**: name(名称), description(描述), value(数值)

### 2. 查询渲染模板 (QueryTemplate)
- **功能**: 查看所有数据记录
- **特性**: 自动刷新(5秒间隔), 点击查看详情
- **接口**: `GET /api/data` (列表), `GET /api/data/:id` (详情)
- **配置**: 支持禁用自动刷新，调整刷新间隔

### 3. 更新数据模板 (UpdateTemplate)
- **功能**: 更新现有数据记录
- **流程**: 输入ID → 获取数据 → 修改字段 → 确认更新
- **接口**: `PUT /api/data/:id`
- **特性**: 支持部分字段更新，修改标识显示

### 4. 删除操作模板 (DeleteTemplate)
- **功能**: 删除数据记录
- **安全机制**: 二次确认，数据预览
- **接口**: `DELETE /api/data/:id`
- **警告**: 删除操作不可逆

## 🔧 API服务配置

### 基础配置
在 `src/services/api.ts` 中配置：

```typescript
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 支持的数据接口

| 操作 | HTTP方法 | 端点 | 参数 |
|------|----------|------|------|
| 创建 | POST | `/data` | {name, description, value} |
| 查询所有 | GET | `/data` | - |
| 查询单个 | GET | `/data/:id` | id |
| 更新 | PUT | `/data/:id` | {name, description, value} |
| 删除 | DELETE | `/data/:id` | id |
| 批量查询 | POST | `/data/batch` | {ids: number[]} |

### 自定义接口

要添加新的API接口，只需在 `ApiService` 类中添加新方法：

```typescript
static async customEndpoint(params: any): Promise<any> {
  const response = await apiClient.post('/custom', params);
  return response.data;
}
```

## 🎨 样式定制

项目使用CSS Modules风格的样式组织：

- **全局样式**: `src/index.css`
- **组件样式**: `src/App.css`
- **响应式设计**: 支持移动端适配

自定义主题颜色可在 `src/App.css` 中修改CSS变量。

## 📦 可用脚本

- `npm start` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm test` - 运行测试套件
- `npm run eject` - 弹出配置（不可逆操作）

## 🔍 调试技巧

1. **网络请求监控**: 浏览器开发者工具 → Network标签
2. **状态跟踪**: 组件内使用console.log输出关键状态
3. **错误处理**: 所有API调用都有完整的错误处理
4. **环境变量**: 通过 `.env` 文件配置不同环境

## 🤝 贡献指南

1. Fork本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🆘 常见问题

### Q: 如何修改API基础URL？
A: 编辑 `.env` 文件中的 `REACT_APP_API_BASE_URL` 变量

### Q: 如何添加新的API接口？
A: 在 `src/services/api.ts` 的 `ApiService` 类中添加新方法

### Q: 如何自定义样式主题？
A: 修改 `src/App.css` 中的CSS变量和样式规则

### Q: 如何禁用自动刷新？
A: 在QueryTemplate组件中设置 `autoRefresh={false}` 属性

## 📞 技术支持

如有问题请提交Issue或联系开发团队。

---

**Happy Coding! 🚀**
