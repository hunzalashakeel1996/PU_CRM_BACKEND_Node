const WebSocketLib = require('ws');
const {extractOrderStatus, apiFetch } = require('./chatbotFunctions')
const WSServer = require('ws').Server;

class WebSocketServer {
  constructor() {
    this.wss = new WSServer({ noServer: true });
  }
  /**
   * Initialize WebSocket server
   * @param httpServer - http server instance
   */

  sendMessageToClient = (clients, message, isSelf, ws) => {
    let result = { reason: message.reason, data: {} }
    clients.forEach(client => {
      // if (isSelf ? client === ws : client !== ws) {
    console.log(client.client_name)

        client.send(JSON.stringify({ ...result, data: message }))
      // }
    });
  }

  init(httpServer) {
    this.namespaces = [];
    const wServer = this;
    //
    // web socket Upgrade function to controll the websockets connections
    httpServer.on('upgrade', (request, socket, head) => {
      wServer.wss.handleUpgrade(request, socket, head, (ws) => {
        console.log('connected',request['headers']['sec-websocket-protocol'])
        ws.client_name = request['headers']['sec-websocket-protocol']
        wServer.wss.emit('connection', ws);
        ws.send(JSON.stringify({ message: 'welcome' }))
      });
    });

    this.wss.on('connection', (ws) => {
      console.log(`New WebSocket connection to added`);

      ws.on('close', () => {
        console.log(`WebSocket connection closed`);
      });

      ws.on('pong', () => {
        console.log('Alive');
      });

      ws.on('message', (msg) => {
        let message = JSON.parse(msg)
        console.log('message', message)
        console.log('length', Object.keys(this.wss.clients))

        //   id user send request to join room 
        if (message.type === 'join room') {
          ws.rooms = ws.rooms ? [...ws.rooms, message.id] : [message.id]
          return
        }
        // when user send message to specific room
        else if (message.type === 'roomMessage') {
          this.wss.clients.forEach(client => {
            if (client.rooms.includes(message.roomId) && client !== ws) {
              client.send(message)
            }
          });
          return
        }
        // broadcase message to all users
        else if (message.type === 'broadcastMessage') {
          console.log('message', message)
          this.sendMessageToClient(this.wss.clients, message, false, ws)
          return
        }
      //  ================================ CHATBOT =====================================================
        else if (message.type === 'chatbot') {
          apiFetch('puchatbot/model', 'POST', JSON.stringify({ sentence: message.data.newMessage }))
            .then(response => {
              // if user provide order or personal information
              if (response.class.tag === 'order_status') {
                extractOrderStatus(message.data.newMessage).then(res => {
                  this.sendMessageToClient(this.wss.clients, res.recordset, true, ws)

                })
              } else {
                this.sendMessageToClient(this.wss.clients,  response.class.responses[0], true, ws)
              }
            })
        }
      })

      ws.ping();
    });
  }
}
module.exports = { webSocketServer: new WebSocketServer() };
