import { Inject, Injectable } from '@nestjs/common';
import mongoose, { Types } from 'mongoose';
import { Role, RoleModelProvider } from '~/mongo/connect/role.schema';

@Injectable()
export class RoleService {
  constructor(
    @Inject(RoleModelProvider.provide)
    private roleModel: typeof RoleModelProvider.useValue
  ) {}

  async createDefault(appId: string, userId: string) {
    const data = await this.roleModel
      .findOne({
        appId,
        isAutoCreated: true,
        isSuperAdminRole: true,
      })
      .lean();

    if (data?._id) {
      return data._id.toString();
    }

    const roles: Omit<Role, 'createdAt' | 'updatedAt'>[] = [
      {
        appId: new Types.ObjectId(appId),
        name: 'Admin',
        status: 'ACTIVE',
        permissions: {},
        isSuperAdminRole: true,
        isAutoCreated: true,
        createdBy: new Types.ObjectId(userId),
        modifiedBy: new Types.ObjectId(userId),
      },
      //   {
      //     appId: ObjectId(appId),
      //     name: 'User',
      //     status: 'ACTIVE',
      //     permissions: {},
      //     isAutoCreated: true,
      //     createdBy: ObjectId(userId),
      //     modifiedBy: ObjectId(userId),
      //   },
    ];
    const documents = await this.roleModel.create(roles);
    const superAdminRole = documents.find((item) => item.isSuperAdminRole);
    return superAdminRole!._id.toString();
  }

  async getById(appId: string, roleId: string) {
    const role = await this.roleModel
      .findOne({
        _id: roleId,
        appId: appId,
      })
      .lean();

    return role;
  }
}
