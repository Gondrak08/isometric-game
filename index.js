const WebSocket = require("ws");
const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    fs.readFile("public/index.html", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-type": "text/plain" });
        res.end(`Server internal error ${err}`);
      } else {
        res.writeHead(200, { "Content-type": "text/html" });
        res.end(data);
      }
    });
  } else if (req.url.endsWith(".js")) {
    // Handle JavaScript file requests
    fs.readFile(`public${req.url}`, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-type": "text/plain" });
        res.end("Not Found");
      } else {
        res.writeHead(200, { "Content-type": "text/javascript" });
        res.end(data);
      }
    });
  } else if (req.url.startsWith("/assets/")) {
    // Handle image file requests
    fs.readFile(`public${req.url}`, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-type": "text/plain" });
        res.end("Not Found");
      } else {
        // Set the appropriate content type for image files
        const extension = req.url.split(".").pop();
        const contentType = `image/${extension}`;
        res.writeHead(200, { "Content-type": contentType });
        res.end(data);
      }
    });
  } else {
    res.writeHead(404, { "Content-type": "text/plain" });
    res.end("Not Found");
  }
});
// to test
//to start the server
const wsServer = new WebSocket.Server({ server });
wsServer.on("connection", (ws) => {
  fs.watch("./public/js/main.js", (event, filename) => {
    if (event === "change") {
      ws.send("reload");
    }
  });
});
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is runningon http://localhost:${PORT}`);
});
wsServer.on("listening", () => {
  console.log("WebSocket server listening");
});
