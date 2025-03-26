import { Inject, Injectable } from '@nestjs/common';
import { ProjectionType, Types } from 'mongoose';
import { encrypt } from '~/lib/crypto';
import { randomString } from '~/lib/random';
import CompanyProductModel from '~/mongo/common/schema/CompanyProduct';
import {
  ConnectApp,
  ConnectAppModelProvider,
} from '~/mongo/connect/connect-app';

@Injectable()
export class ConnectAppService {
  constructor(
    @Inject(ConnectAppModelProvider.provide)
    private connectAppModel: typeof ConnectAppModelProvider.useValue
  ) {}

  async createDefault({
    companyId,
    companyName,
  }: {
    companyId: string;
    companyName: string;
  }) {
    const [connectApp, productInfo] = await Promise.all([
      this.connectAppModel
        .findOne({
          companyId,
        })
        .lean(),
      CompanyProductModel.findOne({
        companyId,
        productId: 'CONNECT',
        status: 'ACTIVE',
      }).lean(),
    ]);

    if (connectApp || !productInfo) {
      return null;
    }

    const company = await this.connectAppModel.create({
      companyId,
      companyProductId: productInfo._id,
      status: 'ACTIVE',
      encryption: {
        algorithm: encrypt('aes256'),
        initVector: encrypt(randomString(16)),
        securitykey: encrypt(randomString(32)),
      },
      branding: {
        name: companyName,
      },
    });

    return company;
  }

  async get({
    appId,
    companyId,
    projection: additionalProjection,
  }: {
    appId?: string;
    companyId: string;
    projection?: Record<string, number>;
  }) {
    let connectAppInfo;
    const projection: ProjectionType<ConnectApp> = {
      branding: 1,
      ...additionalProjection,
    };
    if (appId) {
      connectAppInfo = await this.connectAppModel
        .findOne(
          {
            _id: appId,
            companyId,
            status: 'ACTIVE',
          },
          projection
        )
        .lean();
    }
    if (!connectAppInfo) {
      connectAppInfo = await this.connectAppModel
        .findOne(
          {
            companyId,
            status: 'ACTIVE',
          },
          projection
        )
        .lean();
    }
    return connectAppInfo;
  }

  async getById(appId: string) {
    const connectApp = await this.connectAppModel
      .findOne({
        _id: appId,
        status: 'ACTIVE',
      })
      .lean();

    return connectApp;
  }
}
