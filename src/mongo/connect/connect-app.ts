import { InferSchemaType, Schema, Types } from 'mongoose';
import { MONGO_CONNECTION } from '../connections';

const CONNECT_APP_STATUS = ['ACTIVE', 'DELETED'] as const;

const EncryptionSchema = new Schema(
  {
    algorithm: {
      type: String,
      required: true,
    },
    initVector: {
      type: String,
      required: true,
    },
    securitykey: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const BrandingSchema = new Schema(
  {
    logo: { type: String },
    name: { type: String, required: true },
    url: { type: String },
  },
  {
    _id: false,
  }
);

// Company details
const ConnectAppSchema = new Schema(
  {
    branding: { type: BrandingSchema, required: true },
    companyId: { type: Schema.Types.ObjectId, required: true, index: true },
    companyProductId: { type: Schema.Types.ObjectId, required: true },
    status: { type: String, enum: CONNECT_APP_STATUS, default: 'ACTIVE' },
    encryption: {
      type: EncryptionSchema,
      required: true,
    },
    storageUsed: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type ConnectApp = InferSchemaType<typeof ConnectAppSchema> & {
  _id: Types.ObjectId;
};
export type ConnectAppEncryption = Pick<ConnectApp, 'encryption'>;

const ConnectAppSchemaName = 'connectApp';
const ConnectAppModel = MONGO_CONNECTION.DEFAULT.model(
  ConnectAppSchemaName,
  ConnectAppSchema
);

export const ConnectAppModelProvider = {
  provide: ConnectAppSchemaName,
  useValue: ConnectAppModel,
};
