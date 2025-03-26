import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { InternalModule } from './internal/internal.module';

@Module({
  imports: [InternalModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
