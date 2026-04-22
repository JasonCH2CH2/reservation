const mysql = require('mysql2/promise');
require('dotenv').config();

async function getConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    return connection;
  } catch (error) {
    console.error('数据库连接失败:', error);
    throw error;
  }
}

async function initDatabase() {
  const connection = await getConnection();
  
  try {
    // 创建桌号表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS tables (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 创建预约表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS reservations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE NOT NULL,
        table_id INT NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        name VARCHAR(50) NOT NULL,
        phone VARCHAR(11) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (table_id) REFERENCES tables(id)
      )
    `);
    
    // 检查是否有桌号数据，如果没有则插入
    const [rows] = await connection.execute('SELECT COUNT(*) FROM tables');
    if (rows[0]['COUNT(*)'] === 0) {
      // 插入8个桌号
      for (let i = 1; i <= 8; i++) {
        await connection.execute('INSERT INTO tables (name) VALUES (?)', [`${i}号桌`]);
      }
    }
    
    console.log('数据库初始化成功');
  } catch (error) {
    console.error('数据库初始化失败:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

module.exports = {
  getConnection,
  initDatabase
};