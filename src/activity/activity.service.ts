import { Inject, Injectable } from '@nestjs/common';
import { PipelineStage, Types } from 'mongoose';
import {
  Activity,
  ActivityModelProvider,
  From,
} from '~/mongo/connect/activity.schema';
import { AgentModelProvider } from '~/mongo/connect/agent.schema';
import { CustomerModelProvider } from '~/mongo/connect/customer.schema';

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
    const pipelines: PipelineStage[] = [];

    pipelines.push({
      $match: {
        appId: new Types.ObjectId(appId),
        chatId: new Types.ObjectId(chatId),
      },
    });

    pipelines.push({
      $sort: {
        timestamp: -1,
      },
    });

    pipelines.push({
      $lookup: {
        from: AgentModelProvider.useValue.collection.name,
        as: 'agents',
        localField: 'from.userId',
        foreignField: 'userId',
        let: { appId: '$appId' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$appId', '$$appId'] },
            },
          },
          {
            $project: {
              _id: 0,
              firstName: 1,
              lastName: 1,
              profilePic: 1,
              userId: 1,
            },
          },
        ],
      },
    });

    pipelines.push({
      $lookup: {
        from: CustomerModelProvider.useValue.collection.name,
        as: 'customers',
        localField: 'from.customerId',
        foreignField: '_id',
      },
    });

    pipelines.push({
      $addFields: {
        agent: {
          $first: '$agents',
        },
        customer: {
          $first: '$customers.fields',
        },
      },
    });

    pipelines.push({ $unset: ['agents', 'customers'] });

    const activities = await this.activityModel.aggregate<unknown>(pipelines);

    return activities;
  }
}
