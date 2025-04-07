import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, PipelineStage, Types } from 'mongoose';
import { ActivityService } from '~/activity/activity.service';
import { ActivityModelProvider, From } from '~/mongo/connect/activity.schema';
import { AgentModelProvider } from '~/mongo/connect/agent.schema';
import { Chat, ChatModelProvider } from '~/mongo/connect/chat.schema';
import { CustomerModelProvider } from '~/mongo/connect/customer.schema';
import { SocketService } from '~/socket/socket.service';
import { SendMessageDto } from './dto/chat-send-message.dto';
import { ListChatFilter } from './type';

@Injectable()
export class ChatService {
  constructor(
    @Inject(ChatModelProvider.provide)
    private readonly chatModel: typeof ChatModelProvider.useValue,
    private readonly activityService: ActivityService,
    private readonly socketService: SocketService
  ) {}

  async list(
    appId: string,
    { customerIds, fetchCustomerInfo, limit, ids, channelIds }: ListChatFilter
  ) {
    const filter: FilterQuery<Chat> = {
      appId: new Types.ObjectId(appId),
      status: 'ACTIVE',
    };

    if (customerIds?.length) {
      filter.customerId = {
        $in: customerIds.map((id) => new Types.ObjectId(id)),
      };
    }

    if (ids?.length) {
      filter._id = {
        $in: ids.map((id) => new Types.ObjectId(id)),
      };
    }

    if (channelIds?.length) {
      filter.channelId = {
        $in: channelIds.map((id) => new Types.ObjectId(id)),
      };
    }

    const pipelines: PipelineStage[] = [];

    pipelines.push({
      $match: filter,
    });

    pipelines.push({
      $sort: { 'lastMessageInfo.activityTimestamp': -1 },
    });

    if (limit) {
      pipelines.push({
        $limit: limit,
      });
    }

    pipelines.push({
      $lookup: {
        from: AgentModelProvider.useValue.collection.name,
        as: 'agents',
        localField: 'assignee.userId',
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

    const addFields: PipelineStage.AddFields['$addFields'] = {
      'assignee.name': {
        $first: '$agents.firstName',
      },
      'assignee.profilePic': {
        $first: '$agents.profilePic',
      },
      // TODO: remove hard coded value
      'assignee.onlineStatus': 'ONLINE',
    };

    if (fetchCustomerInfo) {
      pipelines.push({
        $lookup: {
          from: CustomerModelProvider.useValue.collection.name,
          as: 'customers',
          localField: 'customerId',
          foreignField: '_id',
        },
      });

      addFields.customer = {
        $first: '$customers.fields',
      };
    }

    pipelines.push({ $addFields: addFields });

    if (fetchCustomerInfo) {
      pipelines.push({
        $addFields: {
          'customer.onlineStatus': 'ONLINE',
        },
      });
    }

    pipelines.push({ $unset: ['agents', 'customers'] });

    const chats = await this.chatModel.aggregate<
      Chat & { _id: Types.ObjectId }
    >(pipelines);

    return chats;
  }

  async create(appId: string, customerId: string, data: Partial<Chat>) {
    const existingChat = await this.chatModel
      .findOne({
        appId: appId,
        customerId: customerId,
        status: 'ACTIVE',
      })
      .lean();

    if (existingChat) return existingChat;

    const chat = await this.chatModel.create({
      status: 'ACTIVE',
      ...data,
      appId: appId,
      customerId: customerId,
    });

    return chat.toObject();
  }

  async createMessage(
    appId: string,
    chatId: string,
    from: From,
    body: SendMessageDto
  ) {
    const filter: FilterQuery<Chat> = {
      _id: chatId,
      appId: appId,
      status: 'ACTIVE',
    };

    if (from.type === 'CUSTOMER') {
      filter.customerId = from.customerId;
    }

    const chat = await this.chatModel.findOne(filter).lean();

    if (!chat) {
      throw new NotFoundException('CHAT_NOT_FOUND');
    }

    const activity = await this.activityService.create(appId, {
      channelId: chat.channelId,
      chatId: chat._id,
      from: from,
      messageData: {
        message: body.message,
        type: body.type,
      },
      timestamp: new Date(),
      type: 'MESSAGE',
    });

    const set: Partial<Chat> = {};

    set.lastMessageInfo = {
      activityTimestamp: activity.timestamp,
      id: activity._id,
      type: 'TEXT',
      message: activity.messageData?.message,
    };

    await this.chatModel.updateOne(
      {
        _id: chat._id,
      },
      {
        $inc: {
          totalMsgCount: 1,
        },
        $set: set,
      }
    );

    const [activities, connectionIds] = await Promise.all([
      this.activityService.list(appId, chat._id.toString(), {
        limit: 1,
        activityId: activity._id.toString(),
      }),
      this.socketService.getConnectionIds({
        appId: appId,
        ignoreUserId: from.type === 'AGENT' ? from.userId : from.customerId,
      }),
    ]);

    const formatted = activities.at(0);
    if (!formatted) return null;

    await this.socketService.send(appId, connectionIds, {
      type: 'ACTIVITY',
      activity: formatted,
    });

    return formatted;
  }

  async listMessage(appId: string, chatId: string, customerId?: string) {
    const chat = (
      await this.list(appId, {
        customerIds: customerId ? [customerId] : [],
        fetchCustomerInfo: customerId ? false : true,
        ids: [chatId],
        limit: 1,
      })
    ).at(0);

    if (!chat) {
      throw new NotFoundException('CHAT_NOT_FOUND');
    }

    const activities = await this.activityService.list(
      appId,
      chat._id.toString()
    );

    return { chat, activities };
  }
}
