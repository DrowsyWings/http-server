const net = require("net");
const fs = require("fs");

const server = net.createServer((socket) => {
  //Request

  socket.on("data", (data) => {
    const request = data.toString();

    const url = request.split(" ")[1];

    if (url == "/") {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    } else if (url.includes("/echo/")) {
      const content = url.split("/echo/")[1];
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`
      );
    } else if (
      url.startsWith("/files/") &&
      data.toString().split(" ")[0] == "POST"
    ) {
      let fileName = url.split("/")[2];

      const filePath = process.argv[3] + "/" + fileName;
      const file = data.toString("utf-8").split("\r\n\r\n")[1];

      fs.writeFileSync(filePath, file);

      socket.write("HTTP/1.1 201 Created\r\n\r\n");
    } else if (url.startsWith("/files/")) {
      const directory = process.argv[3];
      const fileName = url.split("/files/")[1];

      if (fs.existsSync(`${directory}/${fileName}`)) {
        const content = fs.readFileSync(`${directory}/${fileName}`.toString());
        socket.write(
          `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${content.length}\r\n\r\n${content}`
        );
      } else {
        socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
        socket.end();
        return;
      }
    } else if (url.startsWith("/user-agent")) {
      const content = request.split("User-Agent: ")[1].split(" ")[0].trimEnd();
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`
      );
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
  });

  //Error Handling

  socket.on("error", (e) => {
    console.warn("ERROR: " + e);
    socket.write("HTTP/1.1 500\r\n\r\n");
    socket.end();
  });

  //Closing

  socket.on("close", () => {
    socket.end();
  });
});

server.listen(4221, "localhost");
