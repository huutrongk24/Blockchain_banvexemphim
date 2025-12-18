const { MongoClient } = require('mongodb');

// Lưu ý: tốt nhất đặt URI trong biến môi trường MONGODB_URI
const uri = process.env.MONGODB_URI || 'mongodb+srv://trongnguyentrongnguyen123_db_user:Ynxyd8N93Zb6CMLe@cluster0.1fbzvgd.mongodb.net/?appName=Cluster0';
const dbName = process.env.MONGODB_DB || 'cinema';

const client = new MongoClient(uri);

let _db = null;

async function connect() {
  if (_db) return _db;
  await client.connect();
  _db = client.db(dbName);
  console.log('MongoDB connected to', uri);
  return _db;
}

function getDb() {
  if (!_db) throw new Error('MongoDB chưa kết nối. Gọi connect() trước.');
  return _db;
}

async function close() {
  if (client) await client.close();
  _db = null;
}

module.exports = { connect, getDb, close, client };
