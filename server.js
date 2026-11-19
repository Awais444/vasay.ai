if (!process.env.NODE_ENV) process.env.NODE_ENV = "production";

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const port = Number.parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = createServer((req, res) => {
      handle(req, res, parse(req.url, true)).catch((error) => {
        console.error("Request failed", req.url, error);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end("internal server error");
        }
      });
    });
    server.listen(port, "0.0.0.0", () => {
      console.log(`> Ready on http://0.0.0.0:${port}`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
