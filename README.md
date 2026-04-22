# 桌号预约系统

一个基于前端和后端的桌号预约系统，支持多用户共享预约数据，所有人都能看到同一个预约情况。

## 功能特性

- **自由选择时间**：用户可以自由选择预约的开始时间和结束时间
- **时间范围限制**：
  - 周一至周五：18:00 - 23:00
  - 周末：11:00 - 23:00
- **预约取消**：需要输入正确的姓名和手机号才能取消预约
- **信息脱敏**：预约人信息展示为**+名字的最后一个字，电话号展示尾号后四位
- **多用户共享**：所有用户访问同一套预约数据
- **实时更新**：预约状态实时同步

## 技术栈

### 前端
- HTML5
- CSS3 (Tailwind CSS)
- JavaScript

### 后端
- Node.js
- Express
- MySQL

## 部署步骤

### 1. 前端部署

**使用GitHub Pages部署**：
1. 将项目上传到GitHub仓库
2. 在仓库设置中启用GitHub Pages
3. 选择`main`分支作为源
4. 访问生成的GitHub Pages URL

**本地运行**：
1. 直接在浏览器中打开 `reservation.html` 文件
2. 或使用本地服务器：
   ```bash
   npx http-server -p 8000
   ```

### 2. 后端部署

**本地开发**：
1. 安装依赖：
   ```bash
   cd backend
   npm install
   ```
2. 配置数据库连接（修改 `.env` 文件）
3. 启动服务器：
   ```bash
   npm start
   ```

**服务器部署**：
1. 安装Node.js和MySQL
2. 上传后端代码
3. 配置环境变量
4. 启动服务（推荐使用PM2）

## 数据库设计

### 1. 桌号表（tables）
| 字段名 | 数据类型 | 描述 |
|-------|---------|------|
| id | INT | 桌号ID（主键） |
| name | VARCHAR(20) | 桌号名称（如"1号桌"） |
| created_at | TIMESTAMP | 创建时间 |

### 2. 预约表（reservations）
| 字段名 | 数据类型 | 描述 |
|-------|---------|------|
| id | INT | 预约ID（主键） |
| date | DATE | 预约日期 |
| table_id | INT | 桌号ID |
| start_time | TIME | 开始时间 |
| end_time | TIME | 结束时间 |
| name | VARCHAR(50) | 预约人姓名 |
| phone | VARCHAR(11) | 预约人手机号 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

## API接口

- `GET /api/tables` - 获取桌号列表
- `GET /api/reservations?date=2026-04-22&tableId=1` - 获取指定日期和桌号的预约信息
- `POST /api/reservations` - 创建预约
- `DELETE /api/reservations` - 取消预约

## 使用说明

1. 打开预约系统页面
2. 选择日期和桌号
3. 选择预约时间（注意时间范围限制）
4. 填写预约人信息
5. 点击"确认预约"按钮
6. 如需取消预约，在桌号详情页面点击"取消"按钮，输入正确的姓名和手机号

## 注意事项

- 请确保后端服务正常运行
- 数据库连接信息需要正确配置
- 服务器需要开放相应的端口（80、3000）

## 许可证

MIT License