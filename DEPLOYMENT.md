# SimpleServer - Cloudflare Pages 部署指南

## 项目简介
这是一个基于Node.js和Express的用户数据管理系统，集成了IP地理位置查询功能。

## Cloudflare Pages 部署步骤

### 1. 准备工作
- 确保您有Cloudflare账号 (chunjunliang@qq.com)
- 项目已准备好部署文件

### 2. 环境变量配置
在Cloudflare Pages中需要设置以下环境变量：

```
DB_USER=badmintonbattledev_user
DB_HOST=dpg-ch8r7jtgk4qeoo787770-a
DB_NAME=badmintonbattledev
DB_PASSWORD=0NXUyac9pz4BrAOVn36pnZgR4ChJYh85
DB_PORT=5432
NODE_ENV=production
```

### 3. 部署配置
- **构建命令**: `npm install`
- **输出目录**: `.` (根目录)
- **根目录**: `.` (根目录)
- **Node.js版本**: 18

### 4. 功能说明
- `/` - 主页
- `/info/:id` - 获取用户数据 (分页)
- `/info` - 添加用户数据 (POST)
- `/deleteall` - 删除所有用户数据
- `/inputdata` - 导入IP地理位置数据

## 本地开发
```bash
npm install
npm start
```

## 注意事项
- 确保PostgreSQL数据库可以接受外部连接
- 生产环境会自动启用SSL连接
- 建议在生产环境中使用环境变量管理敏感信息
