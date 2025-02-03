import { nanoid } from 'nanoid';

import Url from '#db/url.mjs';
import { errorResponse, filterObjKeys, getRandomInt } from '#utils.mjs';
import enviroments from '#enviroments.mjs';
import { ValidationError } from '#customErrors.mjs';

const DOMAIN_URI = enviroments.DOMAIN_URI || 'http://localhost:3000';
const PUBLIC_URL_KEYS = Object.keys(Url.schema.obj);
const URL_PATTERN = `^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$`;

const appRoutes = [
  {
    method: 'get',
    url: '/',
    fn: async (_, response) => {
      const env = { DOMAIN_URI: DOMAIN_URI };

      response.render('index', { env });
    },
  },
  {
    method: 'get',
    url: '/:urlId',
    fn: async (request, response) => {
      const urlId = request?.params?.urlId;
      const url = await Url.findOne({ urlId });

      if (url) {
        url.clicks++;
        await url.save();

        response.redirect(url.originalUrl);
      } else {
        response.status(404).json(errorResponse(404));
      }
    },
  },
  {
    method: 'post',
    url: '/urls',
    fn: async (request, response) => {
      const { origUrl } = request?.body;

      const regex = new RegExp(URL_PATTERN, 'i');
      const isValid = regex.test(origUrl);

      if (origUrl && isValid) {
        let originalUrl = origUrl.replace(/[?\/]+$/, '');
        if (!origUrl.startsWith('https')) originalUrl = `https://${originalUrl}`;

        let url = await Url.findOne({ originalUrl });

        if (!url) {
          const urlId = nanoid(getRandomInt());
          const shortUrl = `${DOMAIN_URI}/${urlId}`;

          url = new Url({
            originalUrl,
            shortUrl,
            urlId,
          });

          await url.save();
        }

        response.json(filterObjKeys(PUBLIC_URL_KEYS, url));
      } else {
        let errorMsg = 'Url validation failed: origUrl is not match pattern';

        if (!origUrl) errorMsg = 'Url validation failed: origUrl cant be blank';

        throw new ValidationError(errorMsg);
      }
    },
  },
];

const invalidRoutes = {
  method: 'all',
  url: '*',
  fn: async (_, response) => {
    response.status(404).json(errorResponse(404));
  },
};

appRoutes.push(invalidRoutes);

export default appRoutes;
