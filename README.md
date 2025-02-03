# Url-shortener

## Simple url shortener nodejs project with express and mongoDB

### You can test production build at [url-shortener-sou1jkeee.vercel.app](https://url-shortener-sou1jkeee.vercel.app)

## Installation and launch

**IMPORTANT!** _MongoDB must be installed on the system, or you can use self-hosted or cloud-based_

1. Go to your project directory and install dependencies

   ```bash
   cd url-shortener/
   npm i
   ```

2. Set environment variables see [.env.example](./.env.example)

   ```
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/url-shortener
   DOMAIN_URI=https://example.com
   ```

3. Start project with node

   ```
   npm run start
   ```

   If everything is fine, you will see messages like

   ```
   DB Connected
   Server is running at PORT: 3000
   ```

## Application usage and other information

- Open a browser, go to http://localhost:3000 (or your domain if you deployed the application to a production environment), and try to create a short link
- Or you can use curl, postman, insomnia, etc. to create short links using API as shown in the example below:

  ```bash
  curl --request POST \
  --url https://example.com/urls/ \
  --header 'Content-Type: application/json' \
  --data '{"origUrl": "https://www.google.com"}'
  ```

  You will receive response like below:

  ```json
  {
    "urlId": "I1IpswO",
    "originalUrl": "https://www.google.com",
    "shortUrl": "https://example.com/I1IpswO",
    "clicks": 1,
    "createdAt": "1738327244293"
  }
  ```

  Or an error response:

  ```json
  {
    "code": 400,
    "message": "Bad Request",
    "errorMessage": "Url validation failed: origUrl is not match pattern"
  }
  ```

- In any case, in the console you can also monitor the state of the application, with information about successful and error requests

  ```bash
  [01.02.2025, 00:23:57] INFO  -- :
  {"method":"POST","path":"/urls","body":{"origUrl":"https://www.google.com/"}}
  [01.02.2025, 00:27:51] ERROR  -- : ValidationError: Url validation failed: origUrl cant be blank
  {"method":"POST","path":"/urls","body":{"origUrl":"https://www.google.com/!"}}
  ```
