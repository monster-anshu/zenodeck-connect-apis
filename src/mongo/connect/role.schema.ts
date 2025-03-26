import { InferSchemaType, Schema } from 'mongoose';
import { MONGO_CONNECTION } from '../connections';

export const Actions = [
  'CREATE',
  'READ',
  'UPDATE',
  'DELETE',
  // manage resource
  'manage',
] as const;

export const Subjects = ['USER', 'ROLE', 'BILLING', 'DASHBOARD'] as const;
export const Status = ['ACTIVE', 'DELETED'] as const;

const ActionSchema = {
  type: String,
  enum: Actions,
};

const PermissionSchema = new Schema<Permission>(
  {
    USER: [ActionSchema],
    ROLE: [ActionSchema],
    BILLING: [ActionSchema],
  },
  {
    _id: false,
  }
);

const RoleSchema = new Schema(
  {
    appId: {
      index: true,
      required: true,
      type: Schema.Types.ObjectId,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
    },
    isAutoCreated: {
      default: false,
      type: Boolean,
    },
    isSuperAdminRole: {
      type: Boolean,
    },
    modifiedBy: {
      type: Schema.Types.ObjectId,
    },
    name: {
      required: true,
      type: String,
    },
    permissions: PermissionSchema,
    status: {
      enum: Status,
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

RoleSchema.path('permissions').transform(function (value: Permission) {
  Subjects.forEach((subject) => {
    const actions = value[subject];
    if (!actions) {
      value[subject] = [];
      return;
    }
    value[subject] = Array.from(new Set(actions));
  });
  return value;
});

const RoleSchemaName = 'role';
const RoleModel = MONGO_CONNECTION.DEFAULT.model(RoleSchemaName, RoleSchema);

export const RoleModelProvider = {
  provide: RoleSchemaName,
  useValue: RoleModel,
};

export type FullPermission = Record<SubjectType, ActionType[]>;
export type Permission = Partial<FullPermission>;
export type Role = InferSchemaType<typeof RoleSchema>;
export type SubjectType = (typeof Subjects)[number];
export type ActionType = (typeof Actions)[number];
