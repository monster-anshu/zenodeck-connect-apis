import { Types } from 'mongoose';
import {
  ConnectAppEncryption,
  ConnectAppModelProvider,
} from '~/mongo/connect/connect-app';
import { MONGO_CONNECTION } from '~/mongo/connections';
import { decrypt } from './crypto';

type GetAppEncryptionKeyOptions =
  | {
      appId: string | Types.ObjectId;
      connectApp?: ConnectAppEncryption;
    }
  | {
      connectApp: ConnectAppEncryption;
      appId?: string | Types.ObjectId;
    };

export type Encryption = {
  key: Buffer;
  iv: Buffer;
};

export const getAppEncryptionKey = async (
  props: GetAppEncryptionKeyOptions
) => {
  let connectApp = props.connectApp || null;
  if (!connectApp && props.appId) {
    connectApp = await ConnectAppModelProvider.useValue
      .findOne({
        _id: props.appId,
      })
      .lean();
  }
  if (!connectApp?.encryption) {
    throw new Error('Encryption not found');
  }
  const { initVector, securitykey } = connectApp.encryption;
  return {
    key: Buffer.from(decrypt(securitykey)),
    iv: Buffer.from(decrypt(initVector)),
  } as Encryption;
};
