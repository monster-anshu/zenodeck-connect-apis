import { InferSchemaType, Schema } from 'mongoose';
import { MONGO_CONNECTION } from '../connections';

const ACTIVITY_TYPE = [
  'MESSAGE',
  'AGENT_ACTIVITY',
  'CUSTOMER_ACTIVITY',
] as const;

const ACTIVITY_DATA_TYPE = [
  'CHAT_ASSIGNMENT',
  'NOTES_ADDED',
  'NOTES_REMOVED',
] as const;

export const MESSAGE_DATA_TYPE = ['TEXT'] as const;

const USRE_TYPE = ['CUSTOMER', 'AGENT'] as const;

export const AttachmentSchema = new Schema(
  {
    bucket: String,
    contentType: String,
    duration: Number,
    fileId: String,
    isDocument: Boolean,
    key: String,
    name: String,
    originalFileName: String,
    size: Number,
    thumbnailKey: String,
    thumbnailUrl: String,
    type: String,
    url: String,
  },
  {
    _id: false,
  }
);

export const MessageDataSchema = new Schema(
  {
    attachment: {
      type: AttachmentSchema,
    },
    message: String,
    type: {
      enum: MESSAGE_DATA_TYPE,
      required: true,
      type: String,
    },
  },
  {
    _id: false,
  }
);

export const ActivityDataSchema = new Schema(
  {
    assignment: {
      assignee: {
        type: {
          enum: ['AGENT'] as const,
          required: true,
          type: String,
        },
        userId: Schema.Types.ObjectId,
      },
    },
    type: {
      enum: ACTIVITY_DATA_TYPE,
      requied: true,
      type: String,
    },
  },
  {
    _id: false,
  }
);

const FormSchema = new Schema<From>(
  {
    customerId: Schema.Types.ObjectId,
    type: {
      enum: USRE_TYPE,
      required: true,
      type: String,
    },
    userId: Schema.Types.ObjectId,
  },
  { _id: false }
);

export const ActivitySchema = new Schema(
  {
    activityData: ActivityDataSchema,
    appId: {
      required: true,
      type: Schema.Types.ObjectId,
    },
    channelId: {
      required: true,
      type: Schema.Types.ObjectId,
    },
    chatId: {
      required: true,
      type: Schema.Types.ObjectId,
    },
    deletedBy: {
      type: String,
      userId: Schema.Types.ObjectId,
    },
    deletedType: {
      enum: ['FOR_ME', 'FOR_EVERYONE'],
      type: String,
    },
    from: {
      type: FormSchema,
      required: true,
    },
    messageData: MessageDataSchema,
    replyContext: {
      messageId: Schema.Types.ObjectId,
    },
    timestamp: {
      required: true,
      type: Date,
    },
    type: {
      enum: ACTIVITY_TYPE,
      required: true,
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ActivitySchemaName = 'activity';
const ActivityModel = MONGO_CONNECTION.DEFAULT.model(
  ActivitySchemaName,
  ActivitySchema
);

export const ActivityModelProvider = {
  provide: ActivitySchemaName,
  useValue: ActivityModel,
};

export type Activity = InferSchemaType<typeof ActivitySchema>;
export type From =
  | {
      type: 'CUSTOMER';
      customerId: string;
    }
  | {
      type: 'AGENT';
      userId: string;
    };
