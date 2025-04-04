import { Inject, Injectable } from '@nestjs/common';
import {
  Activity,
  ActivityModelProvider,
  From,
} from '~/mongo/connect/activity.schema';

@Injectable()
export class ActivityService {
  constructor(
    @Inject(ActivityModelProvider.provide)
    private readonly activityModel: typeof ActivityModelProvider.useValue
  ) {}

  async create(
    appId: string,
    data: Pick<
      Activity,
      'channelId' | 'chatId' | 'messageData' | 'timestamp' | 'type' | 'from'
    >
  ) {
    const activity = await this.activityModel.create({
      ...data,
      appId: appId,
    });

    return activity.toObject();
  }

  async list(appId: string, chatId: string) {
    const activities = await this.activityModel
      .find({
        appId: appId,
        chatId: chatId,
      })
      .sort({
        timestamp: -1,
      })
      .lean();

    return activities;
  }
}
