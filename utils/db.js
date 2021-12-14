import mongoose from 'mongoose';

const connection = {};

async function connect() {
  if (connection.isConnected) {
    console.log('already connected');
    return;
  }
  //connections is an array that contains all the previous connections to the database
  if (mongoose.connections.length > 0) {
    //if there is already a connection set a value to connection.isConnected
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      console.log('use previous connection');
      return;
    }
    await mongoose.disconnect();
  }

  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('new connection');
  connection.isConnected = db.connections[0].readyState;
}

async function disconnect() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === 'production') {
      //if we are in developing phase, then db will not be disconnected
      //this will prevent connecting and disconnecting to tb in development
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      console.log('not disconnected');
    }
  }
}

//when our database returns it's "converted object", it will have 3 unique type of values, the id, createdAt and updatedAt
//to use that object and get no error, we need to convert them to strings, so that our .map() in our index.js works
function convertDocToObj(doc) {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
}

const db = { connect, disconnect, convertDocToObj };

export default db;
