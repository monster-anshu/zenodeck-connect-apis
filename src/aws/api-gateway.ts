import {
  ApiGatewayManagementApiClient,
  ApiGatewayManagementApiClientConfig,
} from '@aws-sdk/client-apigatewaymanagementapi';
import { CONNECT_APP_SOCKET_API } from '~/env';

const configuration: ApiGatewayManagementApiClientConfig = {
  endpoint: CONNECT_APP_SOCKET_API,
};

export const socketClient = new ApiGatewayManagementApiClient(configuration);
