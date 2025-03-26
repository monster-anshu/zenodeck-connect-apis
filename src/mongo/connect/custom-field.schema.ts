import { InferSchemaType, Schema } from 'mongoose';
import { MONGO_CONNECTION } from '../connections';

export const CUSTOM_FIELD_TYPES = ['TEXT', 'EMAIL'] as const;
export const CUSTOM_FIELD_STATUS = ['ACTIVE', 'INACTIVE'] as const;

const CustomFieldSchema = new Schema(
  {
    appId: {
      required: true,
      type: Schema.Types.ObjectId,
    },
    choices: {
      type: [String],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
    },
    custom: {
      default: true,
      type: Boolean,
    },
    description: {
      type: String,
    },
    label: {
      required: true,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
    sequence: {
      type: Number,
    },
    showInChat: {
      default: false,
      type: Boolean,
    },
    status: {
      default: 'INACTIVE',
      type: String,
      enum: CUSTOM_FIELD_STATUS,
    },
    type: {
      required: true,
      type: String,
      enum: CUSTOM_FIELD_TYPES,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const CustomFieldSchemaName = 'customField';

const CustomFieldModel = MONGO_CONNECTION.DEFAULT.model(
  CustomFieldSchemaName,
  CustomFieldSchema
);

export const CustomFieldModelProvider = {
  provide: CustomFieldSchemaName,
  useValue: CustomFieldModel,
};

export type CustomField = InferSchemaType<typeof CustomFieldSchema>;
