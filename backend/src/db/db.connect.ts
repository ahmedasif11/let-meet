import mongoose from 'mongoose';

type ConnectionObject = {
  connections?: number;
};

const connectionObject: ConnectionObject = {};

async function connectToDB() {
  if (connectionObject.connections) {
    console.log('Already connected to the database');
    return;
  }

  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri || mongoUri === 'your_mongodb_connection_string_here') {
    console.warn('⚠️  MONGODB_URI not configured. Database connection skipped.');
    console.warn('⚠️  Some features may not work without a database connection.');
    return;
  }

  try {
    const db = await mongoose.connect(mongoUri);
    connectionObject.connections = db.connections.length;
    console.log('✅ Connected to the database');

    return db;
  } catch (error) {
    console.error('❌ Error connecting to the database:', error);
    throw error;
  }
}

export default connectToDB;
