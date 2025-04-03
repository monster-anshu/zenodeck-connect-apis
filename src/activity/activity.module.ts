import { Module } from '@nestjs/common';
import { ActivityModelProvider } from '~/mongo/connect/activity.schema';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';

@Module({
  controllers: [ActivityController],
  providers: [ActivityService, ActivityModelProvider],
  exports: [ActivityService],
})
export class ActivityModule {}
