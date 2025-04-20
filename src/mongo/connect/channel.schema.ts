import { InferSchemaType, Schema } from 'mongoose';
import { MONGO_CONNECTION } from '../connections';
import { customizationSchema } from './customization.schema';

const CHANNEL_STATUS = ['ACTIVE', 'INACTIVE', 'DELETED'] as const;
const CHANNEL_TYPE = ['WEB'] as const;

const ChannelSchema = new Schema(
  {
    allowedDomains: {
      required: false,
      default: undefined,
      type: [String],
    },
    appId: {
      required: true,
      type: Schema.Types.ObjectId,
    },
    clientId: {
      required: true,
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
    },
    customization: customizationSchema,
    description: {
      type: String,
    },
    enableFeedback: {
      default: false,
      type: Boolean,
    },
    enablePreview: {
      default: false,
      type: Boolean,
    },
    isConnected: {
      default: false,
      type: Boolean,
    },
    isDefault: {
      default: false,
      type: Boolean,
    },
    modifiedBy: {
      type: Schema.Types.ObjectId,
    },
    name: {
      required: true,
      type: String,
    },
    privateKeys: {
      type: Object,
    },
    status: {
      default: 'ACTIVE',
      enum: CHANNEL_STATUS,
      type: String,
    },
    type: {
      enum: CHANNEL_TYPE,
      type: String,
    },
    welcomeMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ChannelSchemaName = 'channel';

const ChannelModel = MONGO_CONNECTION.DEFAULT.model(
  ChannelSchemaName,
  ChannelSchema
);

export const ChannelModelProvider = {
  provide: ChannelSchemaName,
  useValue: ChannelModel,
};

export type Channel = InferSchemaType<typeof ChannelSchema>;
