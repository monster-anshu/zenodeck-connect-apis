import { handlerPath } from '~/lib/lambda/handler-resolve';
import { LambdaFunction } from '~/types';
import { SocketAuthorizer } from '../authorizer/authorizer';

export const socketConnect: LambdaFunction = {
  handler: handlerPath(__dirname),
  events: [
    {
      websocket: {
        route: '$connect',
        authorizer: SocketAuthorizer,
      },
    },
  ],
};
