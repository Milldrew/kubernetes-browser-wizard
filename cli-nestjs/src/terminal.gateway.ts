import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as pty from 'node-pty';

interface TerminalSession {
  ptyProcess: pty.IPty;
  socket: Socket;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TerminalGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private terminals: Map<string, TerminalSession> = new Map();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);

    // Create a new terminal session for this client
    const shell = process.env.SHELL || 'bash';
    const ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: process.env.HOME,
      env: process.env,
    });

    // Store the terminal session
    this.terminals.set(client.id, {
      ptyProcess,
      socket: client,
    });

    // Handle terminal output
    ptyProcess.onData((data: string) => {
      client.emit('terminalOutput', data);
    });

    // Handle terminal exit
    ptyProcess.onExit(({ exitCode, signal }) => {
      client.emit('terminalExit', { code: exitCode, signal });
      this.terminals.delete(client.id);
    });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);

    // Clean up terminal session
    const session = this.terminals.get(client.id);
    if (session) {
      session.ptyProcess.kill();
      this.terminals.delete(client.id);
    }
  }

  @SubscribeMessage('terminalInput')
  handleTerminalInput(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    const session = this.terminals.get(client.id);
    if (session) {
      session.ptyProcess.write(data);
    }
  }

  @SubscribeMessage('resize')
  handleResize(
    @MessageBody() data: { cols: number; rows: number },
    @ConnectedSocket() client: Socket,
  ) {
    const session = this.terminals.get(client.id);
    if (session) {
      session.ptyProcess.resize(data.cols, data.rows);
    }
  }
}

