import { Module } from '@nestjs/common';
import { AgentModule } from './agent/agent.module';
import { AppController } from './app.controller';
import { ConnectAppModule } from './connect-app/connect-app.module';
import { CustomFieldModule } from './custom-field/custom-field.module';
import { InternalModule } from './internal/internal.module';
import { RoleModule } from './role/role.module';
import { ChannelModule } from './channel/channel.module';

@Module({
  imports: [
    InternalModule,
    AgentModule,
    RoleModule,
    ConnectAppModule,
    CustomFieldModule,
    ChannelModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
