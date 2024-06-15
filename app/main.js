const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const splitData = data.toString().split("/");
    if (splitData == "/") {
      const fileName = data.toString().split(" ")[1].split("/")[2];
      if (fileName) {
        const response1 =
          "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: 3\r\n\r\n" +
          fileName;
        socket.write(response1);
      } else {
        const response2 =
          "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: 3\r\n\r\n";
        socket.write(response2);
      }
    } else {
      const response = "HTTP/1.1 404 Not Found\r\n\r\n";
      socket.write(response);
    }
    socket.end();
  });
});

server.listen(4221, "localhost");
