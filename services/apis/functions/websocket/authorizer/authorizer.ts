export const SocketAuthorizer = {
  name: 'SocketAuthorizer',
  identitySource: 'route.request.querystring.token',
};

export type SocketAuthorizerContext = {
  appId: string;
  userId: string | undefined;
  customerId: string | undefined;
  type: 'AGENT' | 'CUSTOMER';
};
