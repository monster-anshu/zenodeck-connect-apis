import { InferSchemaType, Schema } from 'mongoose';
import { MONGO_CONNECTION } from '../connections';

const CUSTOMER_STATUS = ['ACTIVE', 'DELETED'] as const;
const CUSTOMER_ONLINE_STATUS = ['ONLINE', 'AWAY', 'OFFLINE'] as const;

const FieldSchema = new Schema({} as Record<string, string>, {
  strict: false,
  _id: false,
});

const CustomerSchema = new Schema(
  {
    appId: {
      required: true,
      type: Schema.Types.ObjectId,
    },
    channelId: {
      required: true,
      type: Schema.Types.ObjectId,
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
    },
    fields: FieldSchema,
    lastSeenAt: {
      type: Date,
    },
    onlineStatus: {
      default: 'AWAY',
      enum: CUSTOMER_ONLINE_STATUS,
      required: true,
      type: String,
    },
    source: {
      required: true,
      type: String,
    },
    status: {
      default: 'ACTIVE',
      enum: CUSTOMER_STATUS,
      required: true,
      type: String,
    },
  },
  {
    timestamps: true,
    autoIndex: false,
  }
);

const CustomerSchemaName = 'customer';

const CustomerModel = MONGO_CONNECTION.DEFAULT.model(
  'customer',
  CustomerSchema
);

export const CustomerModelProvider = {
  provide: CustomerSchemaName,
  useValue: CustomerModel,
};

export type Customer = InferSchemaType<typeof CustomerSchema>;
