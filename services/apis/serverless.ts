import type { AWS } from '@serverless/typescript';

import * as functions from './functions/index';

const serverlessConfiguration: AWS = {
  service: 'zenodeck-connect-apis',
  frameworkVersion: '4',
  useDotenv: true,
  plugins: [
    'serverless-deployment-bucket',
    'serverless-prune-plugin',
    'serverless-offline',
  ],
  build: {
    esbuild: {
      external: ['@aws-sdk/*'],
      sourcemap: false,
      minify: true,
    },
  },
  custom: {
    prune: {
      automatic: true,
      number: 1,
    },
    'serverless-offline': {
      noPrependStageInUrl: true,
      disableCookieValidation: true,
      httpPort: 3001,
      lambdaPort: 3002,
    },
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs22.x',
    memorySize: 128,
    timeout: 30,
    region: 'us-east-1',
    lambdaHashingVersion: '20201221',
    stage: '${opt:stage}',
    deploymentBucket: {
      name: '${env:SERVERLESS_DEPLOYMENT_BUCKET}',
    },
    logRetentionInDays: 1,
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      MONGO_COMMON_URI: '${env:MONGO_COMMON_URI}',
      MONGO_DEFAULT_URI: '${env:MONGO_DEFAULT_URI}',
      NODE_ENV: 'production',
      STAGE: '${opt:stage}',
      TZ: 'Asia/Kolkata',
    },
  },
  package: { individually: true },
  functions: functions,
};

module.exports = serverlessConfiguration;
