import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Terminal as Xterm } from 'xterm';
import { io, Socket } from 'socket.io-client';
import 'xterm/css/xterm.css';

@Component({
  selector: 'wizard-terminal',
  templateUrl: './terminal.html',
  styleUrls: ['./terminal.scss'],
})
export class Terminal implements AfterViewInit, OnDestroy {
  @ViewChild('terminalContainer', { static: false })
  terminalContainer!: ElementRef;
  private terminal!: Xterm;
  private socket!: Socket;
  private cols = 80; // Match Node.js server default
  private rows = 30; // Match Node.js server default
  private fontSize = 14; // Initial font size
  private charWidth = 9; // Base char width for Fira Code at fontSize 14
  private charHeight = 18; // Base char height for Fira Code at fontSize 14

  ngAfterViewInit() {
    // Initialize xterm.js terminal
    this.terminal = new Xterm({
      cols: this.cols,
      rows: this.rows,
      cursorBlink: true,
      fontFamily: "'FiraCode Nerd Font', monospace",
      fontSize: this.fontSize,
      theme: {
        background: '#000000',
        foreground: '#ffffff',
      },
    });

    // Open terminal in the container
    this.terminal.open(this.terminalContainer.nativeElement);

    // Connect to WebSocket server
    this.socket = io('http://localhost:3000');

    // Handle WebSocket connection
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');

      // Send initial terminal size to server
      this.socket.emit('resize', { cols: this.cols, rows: this.rows });
    });

    // Handle terminal output from server
    this.socket.on('terminalOutput', (data: string) => {
      this.terminal.write(data);
    });

    // Handle terminal exit
    this.socket.on('terminalExit', ({ code }: { code: number }) => {
      this.terminal.write(`\r\nTerminal exited with code ${code}\r\n`);
      this.socket.disconnect();
    });

    // Handle WebSocket disconnection
    this.socket.on('disconnect', () => {
      this.terminal.write('\r\nDisconnected from server\r\n');
    });

    // Send terminal input to server
    this.terminal.onData((data: string) => {
      this.socket.emit('terminalInput', data);
    });

    // Handle window resize to update terminal size
    window.addEventListener('resize', this.handleResize.bind(this));
    this.handleResize(); // Initial resize
  }

  increaseFontSize() {
    if (this.fontSize < 30) {
      // Max font size limit
      this.fontSize += 2;
      this.updateFontSize();
    }
  }

  decreaseFontSize() {
    if (this.fontSize > 8) {
      // Min font size limit
      this.fontSize -= 2;
      this.updateFontSize();
    }
  }

  private updateFontSize() {
    // Update terminal font size
    this.terminal.options.fontSize = this.fontSize;

    // Adjust charWidth and charHeight based on fontSize (approximate scaling)
    const baseFontSize = 14;
    const scale = this.fontSize / baseFontSize;
    this.charWidth = 9 * scale; // Scale from base charWidth
    this.charHeight = 18 * scale; // Scale from base charHeight

    // Recalculate terminal dimensions
    this.handleResize();
  }

  private handleResize() {
    // Fit terminal to container size
    const container = this.terminalContainer.nativeElement;
    const newCols = Math.floor(container.clientWidth / this.charWidth);
    const newRows = Math.floor(container.clientHeight / this.charHeight);

    if (newCols !== this.cols || newRows !== this.rows) {
      this.cols = newCols;
      this.rows = newRows;

      // Update terminal size
      this.terminal.resize(this.cols, this.rows);

      // Notify server of new size
      if (this.socket && this.socket.connected) {
        this.socket.emit('resize', { cols: this.cols, rows: this.rows });
      }
    }
  }

  ngOnDestroy() {
    // Clean up
    if (this.socket) {
      this.socket.disconnect();
    }
    this.terminal.dispose();
    window.removeEventListener('resize', this.handleResize.bind(this));
  }
}
