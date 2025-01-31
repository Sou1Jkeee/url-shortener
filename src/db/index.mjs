import mongoose from 'mongoose';

import enviroments from '#enviroments.mjs';

async function connectDB() {
  return mongoose
    .connect(enviroments.MONGO_URI, { dbName: 'url-shortener' })
    .then(() => {
      console.log(`DB Connected`);
    })
    .catch((err) => {
      console.log(err.message);
    });
}

export { connectDB };
