const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const stringedData = data.toString().split(" ")[2];
    if (stringedData == "/index.html") {
      const response1 = "HTTP/1.1 200 OK\r\n\r\n";
      socket.write(response1);
    } else {
      const response = "HTTP/1.1 404 Not Found\r\n\r\n";
      socket.write(response);
    }
    socket.end();
  });
});

server.listen(4221, "localhost");
