import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { InternalModule } from './internal/internal.module';
import { AgentModule } from './agent/agent.module';

@Module({
  imports: [InternalModule, AgentModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
