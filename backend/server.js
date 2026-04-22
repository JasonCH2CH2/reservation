const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { getConnection, initDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 初始化数据库
initDatabase().catch(console.error);

// API路由

// 获取桌号列表
app.get('/api/tables', async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM tables');
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error('获取桌号列表失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取预约信息
app.get('/api/reservations', async (req, res) => {
  try {
    const { date, tableId } = req.query;
    const connection = await getConnection();
    
    let query = 'SELECT * FROM reservations WHERE 1=1';
    const params = [];
    
    if (date) {
      query += ' AND date = ?';
      params.push(date);
    }
    
    if (tableId) {
      query += ' AND table_id = ?';
      params.push(tableId);
    }
    
    const [rows] = await connection.execute(query, params);
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error('获取预约信息失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 创建预约
app.post('/api/reservations', async (req, res) => {
  try {
    const { date, tableId, startTime, endTime, name, phone } = req.body;
    
    // 验证参数
    if (!date || !tableId || !startTime || !endTime || !name || !phone) {
      return res.status(400).json({ error: '缺少必要参数' });
    }
    
    // 检查时间冲突
    const connection = await getConnection();
    const [conflicts] = await connection.execute(
      'SELECT * FROM reservations WHERE date = ? AND table_id = ? AND ((start_time < ? AND end_time > ?) OR (start_time < ? AND end_time > ?) OR (start_time >= ? AND end_time <= ?))',
      [date, tableId, endTime, startTime, endTime, startTime, startTime, endTime]
    );
    
    if (conflicts.length > 0) {
      await connection.end();
      return res.status(400).json({ error: '所选时间与已有预约冲突' });
    }
    
    // 创建预约
    const [result] = await connection.execute(
      'INSERT INTO reservations (date, table_id, start_time, end_time, name, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [date, tableId, startTime, endTime, name, phone]
    );
    
    await connection.end();
    res.json({ id: result.insertId, date, tableId, startTime, endTime, name, phone });
  } catch (error) {
    console.error('创建预约失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 取消预约
app.delete('/api/reservations', async (req, res) => {
  try {
    const { name, phone } = req.body;
    
    // 验证参数
    if (!name || !phone) {
      return res.status(400).json({ error: '缺少必要参数' });
    }
    
    const connection = await getConnection();
    const [result] = await connection.execute(
      'DELETE FROM reservations WHERE name = ? AND phone = ?',
      [name, phone]
    );
    
    await connection.end();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '未找到匹配的预约信息' });
    }
    
    res.json({ success: true, message: '预约已成功取消' });
  } catch (error) {
    console.error('取消预约失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});