import { handlerPath } from '~/lib/lambda/handler-resolve';
import { LambdaFunction } from '~/types';

export const socketPing: LambdaFunction = {
  handler: handlerPath(__dirname),
  events: [
    {
      websocket: {
        route: 'ping',
      },
    },
  ],
};
