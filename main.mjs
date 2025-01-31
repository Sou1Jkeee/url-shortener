import { connectDB } from '#db/index.mjs';
import { startApp } from '#server/index.mjs';

await connectDB();
startApp();
