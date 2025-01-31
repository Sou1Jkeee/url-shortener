import http from 'http';

const errorResponse = (code, errorMessage) => {
  return {
    code,
    message: http.STATUS_CODES[code?.toString()],
    errorMessage,
  };
};

const getDateTime = () => {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).format(new Date());
};

const logger = (request, error) => {
  const types = {
    info: { text: 'INFO', color: '33' },
    error: { text: 'ERROR', color: '31' },
  };

  let type = 'info';
  let errorMsg = '';

  const { method, path, body, query, params } = request;

  const logObj = Object.entries({ method, path, body, query, params }).reduce((acc, [k, v]) => {
    if (v && Object.keys(v)?.length) acc = { ...acc, [k]: v };
    return acc;
  }, {});

  if (error) {
    type = 'error';
    errorMsg = `${error?.name}: ${error?.message}`;
  }

  console[type](
    `\x1b[36m[${getDateTime()}]\x1b[0m`,
    `\x1b[${types[type].color}m${types[type].text}\x1b[0m `,
    '-- :',
    errorMsg,
    '\n',
    JSON.stringify(logObj)
  );
};

const getRandomInt = (min = 4, max = 7) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const filterObjKeys = (keys, obj) => {
  return keys.reduce((acc, cur) => {
    acc[cur] = obj[cur];
    return acc;
  }, {});
};

export { errorResponse, getDateTime, logger, getRandomInt, filterObjKeys };
