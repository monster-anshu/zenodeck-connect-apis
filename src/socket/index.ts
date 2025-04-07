import { SocketConnectionModelProvider } from '~/mongo/connect/socket-connection.schema';

export const removeInactiveConnection = async ({
  appId,
  userId,
  connectionId,
  userType,
  fromSocketDisconnectEvent,
}: {
  appId: string;
  userId: string;
  connectionId: string;
  userType: string;
  fromSocketDisconnectEvent?: boolean;
}) => {
  await SocketConnectionModelProvider.useValue.updateOne(
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

  const data = await SocketConnectionModelProvider.useValue.deleteOne({
    appId,
    userId: userId,
    userType: userType,
    connections: { $size: 0 },
  });

  if (fromSocketDisconnectEvent) {
  }
};
