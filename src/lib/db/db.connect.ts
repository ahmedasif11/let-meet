import mongoose from 'mongoose';

type ConnectionObject = {
  connections?: number; // TODO: Divv b/w this and key value pair of connections
};
const connectionObject: ConnectionObject = {};

async function connectToDB() {
  if (connectionObject.connections) {
    console.log('Already connected to the database');
    return;
  }

  try {
    const db = await mongoose.connect(
      (process.env.MONGODB_URI as string) || ''
    ); // TODO: Explore connections options
    connectionObject.connections = db.connections.length; //TODO: Diff b/w connections and readyState
    console.log('Connected to the database', db);

    return db;
  } catch (error) {
    console.log('Error connecting to the database', error);
  }
}

export default connectToDB;
