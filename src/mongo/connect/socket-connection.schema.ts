import { InferSchemaType, Schema } from 'mongoose';
import { MONGO_CONNECTION } from '../connections';

const ConnectionSchema = new Schema(
  {
    connectionId: {
      required: true,
      type: String,
    },
    createdAt: {
      required: true,
      type: Date,
      default: () => new Date(),
    },
    lastEventAt: {
      required: true,
      type: Date,
      default: () => new Date(),
    },
  },
  { _id: false }
);

const SocketConnectionSchema = new Schema(
  {
    appId: {
      required: true,
      type: Schema.Types.ObjectId,
    },
    connections: [ConnectionSchema],
    userId: {
      required: true,
      type: Schema.Types.ObjectId,
    },
    userType: {
      enum: ['AGENT', 'CUSTOMER'],
      required: true,
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const SocketConnectionSchemaName = 'socketconnection';
const SocketConnectionModel = MONGO_CONNECTION.DEFAULT.model(
  SocketConnectionSchemaName,
  SocketConnectionSchema
);

export const SocketConnectionModelProvider = {
  provie: SocketConnectionSchemaName,
  useValue: SocketConnectionModel,
};

export type SocketConnection = InferSchemaType<typeof SocketConnectionSchema>;
