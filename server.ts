import { createServer } from "http";
import { WebSocketServer } from "ws";
import ip from "ip";

const server = createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data) {
    let request;
    try {
      request = JSON.parse(data.toString());
    } catch (error) {
      console.log("Could not parse JSON: ", data);
    }
  });
});

server.listen(17070, "0.0.0.0");

console.log("Websocket running at", `ws://${ip.address()}:17070/`);
