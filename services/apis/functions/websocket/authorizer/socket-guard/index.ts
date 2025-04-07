import { handlerPath } from '~/lib/lambda/handler-resolve';

export const SocketAuthorizer = {
  handler: handlerPath(__dirname),
};
