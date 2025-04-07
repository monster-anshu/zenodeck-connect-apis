import {
  PostToConnectionCommand,
  PostToConnectionCommandInput,
} from '@aws-sdk/client-apigatewaymanagementapi';
import { fromUtf8 } from '@aws-sdk/util-utf8-node';
import { FilterQuery, Types } from 'mongoose';
import { socketClient } from '~/aws/api-gateway';
import { Activity } from '~/mongo/connect/activity.schema';
import {
  SocketConnection,
  SocketConnectionModelProvider,
} from '~/mongo/connect/socket-connection.schema';

export class SocketService {
  private readonly socketModel = SocketConnectionModelProvider.useValue;

  async removeConnection(
    appId: string,
    {
      connectionId,
      userId,
      userType,
      fromSocketDisconnectEvent,
    }: {
      userId: string;
      connectionId: string;
      userType: string;
      fromSocketDisconnectEvent?: boolean;
    }
  ) {
    await this.socketModel.updateOne(
      {
        appId,
        'connections.connectionId': connectionId,
        userId: userId,
        userType: userType,
      },
      {
        $pull: { connections: { connectionId } },
      }
    );

    const data = await this.socketModel.deleteOne({
      appId,
      userId: userId,
      userType: userType,
      connections: { $size: 0 },
    });

    if (fromSocketDisconnectEvent) {
    }
  }

  async send(appId: string, connectionIds: string[], message: unknown) {
    connectionIds = [...new Set([...connectionIds])];
    if (!connectionIds.length) return;

    await Promise.allSettled(
      connectionIds.map(async (ConnectionId) => {
        const flag = await this.post({
          ConnectionId,
          Data: fromUtf8(JSON.stringify(message)),
        });
        const connection = await this.socketModel
          .findOne({
            appId,
            'connections.connectionId': ConnectionId,
          })
          .lean();

        if (!flag && connection) {
          await this.removeConnection(appId, {
            connectionId: ConnectionId,
            userId: connection.userId.toString(),
            userType: connection.userType,
          });
        }
      })
    );
  }

  async post(input: PostToConnectionCommandInput) {
    try {
      const command = new PostToConnectionCommand(input);
      await socketClient.send(command);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async getConnectionIds({
    appId,
    ignoreUserId,
    userId,
  }: GetConnectionIdOptions) {
    const filter: FilterQuery<SocketConnection> = {
      appId: appId,
      userId: {
        $ne: new Types.ObjectId(ignoreUserId),
      },
    };

    if (userId) {
      filter.userId = new Types.ObjectId(userId);
    }

    const connections = await this.socketModel.find(filter).lean();

    const arr = connections
      .map((connecion) => connecion.connections.map((c) => c.connectionId))
      .flat();

    return arr;
  }
}

type GetConnectionIdOptions = {
  appId: string;
  userId?: string;
  ignoreUserId: string;
};
