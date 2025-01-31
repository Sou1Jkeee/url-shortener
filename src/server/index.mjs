import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

import appRoutes from './routes.mjs';
import { errorResponse, logger } from '#utils.mjs';
import enviroments from '#enviroments.mjs';

const PORT = enviroments.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  express.static(path.join(process.cwd(), 'public'), {
    index: false,
  })
);

app.engine('html', (filePath, options, callback) => {
  fs.readFile(filePath, (err, content) => {
    if (err) return callback(err);
    const { env } = options;
    let stringContent = content.toString();

    Object.keys(env).forEach((key) => {
      stringContent = stringContent.replaceAll(`#${key}#`, env[key]);
    });

    return callback(null, stringContent);
  });
});

app.set('views', path.join(process.cwd(), 'public'));
app.set('view engine', 'html');

appRoutes.forEach((route) => {
  const { method, url, fn } = route;

  return app[method](url, async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      logger(req, error);

      const code = error?.code || 500;
      res.status(code).json(errorResponse(code, error?.message));
      return;
    }

    logger(req);
  });
});

function startApp() {
  app.listen(PORT, () => {
    console.log(`Server is running at PORT: ${PORT}`);
  });
}

export { startApp };
