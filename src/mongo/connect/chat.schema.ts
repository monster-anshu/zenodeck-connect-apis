import { InferSchemaType, Schema } from 'mongoose';
import { MONGO_CONNECTION } from '../connections';

const CHAT_STATUS = ['ACTIVE', 'RESOLVED', 'DELETED'] as const;
const ASSIGNEE_TYPE = ['AGENT', 'BOT'] as const;

const AssigneeSchema = new Schema(
  {
    assignedAt: Date,
    teamId: {
      type: Schema.Types.ObjectId,
    },
    type: {
      enum: ASSIGNEE_TYPE,
      required: true,
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
    },
  },
  { _id: false }
);

const ChatSchema = new Schema(
  {
    appId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    assignee: AssigneeSchema,
    conversationStatus: {
      required: true,
      type: String,
      enum: CHAT_STATUS,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    lastActivityInfo: {
      activityTimestamp: Date,
      id: Schema.Types.ObjectId,
      type: String,
      userType: String,
    },
    lastCustomerMessageInfo: {
      activityTimestamp: Date,
      id: Schema.Types.ObjectId,
      type: String,
      userType: String,
    },
    lastMessageInfo: {
      activityTimestamp: Date,
      id: Schema.Types.ObjectId,
      type: String,
      userType: String,
    },
    // metadata: ChatMetadataSchema,
    totalMsgCount: {
      type: Number,
      default: 0,
    },
    channelId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ChatSchemaName = 'chat';

const ChatModel = MONGO_CONNECTION.DEFAULT.model(ChatSchemaName, ChatSchema);

export const ChatModelProvider = {
  provide: ChatSchemaName,
  useValue: ChatModel,
};

export type Chat = InferSchemaType<typeof ChatSchema>;
