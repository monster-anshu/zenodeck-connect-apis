import { Global, Module } from '@nestjs/common';
import { ConnectAppModelProvider } from '~/mongo/connect/connect-app';
import { ConnectAppController } from './connect-app.controller';
import { ConnectAppService } from './connect-app.service';

@Global()
@Module({
  controllers: [ConnectAppController],
  providers: [ConnectAppService, ConnectAppModelProvider],
  exports: [ConnectAppService],
})
export class ConnectAppModule {}
