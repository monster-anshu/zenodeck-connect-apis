import { Module } from '@nestjs/common';
import { AgentModule } from './agent/agent.module';
import { AppController } from './app.controller';
import { ChannelModule } from './channel/channel.module';
import { ConnectAppModule } from './connect-app/connect-app.module';
import { CustomFieldModule } from './custom-field/custom-field.module';
import { CustomerModule } from './customer/customer.module';
import { InternalModule } from './internal/internal.module';
import { RoleModule } from './role/role.module';
import { WebsiteModule } from './website/website.module';

@Module({
  imports: [
    InternalModule,
    AgentModule,
    RoleModule,
    ConnectAppModule,
    CustomFieldModule,
    ChannelModule,
    WebsiteModule,
    CustomerModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
