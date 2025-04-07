import { handlerPath } from '~/lib/lambda/handler-resolve';
import { LambdaFunction } from '~/types';

export const socketDisconnect: LambdaFunction = {
  handler: handlerPath(__dirname),
  events: [
    {
      websocket: {
        route: '$disconnect',
      },
    },
  ],
};
