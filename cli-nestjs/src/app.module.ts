import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TerminalGateway } from './terminal.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, TerminalGateway],
})
export class AppModule {}
