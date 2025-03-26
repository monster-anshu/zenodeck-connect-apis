import { Module } from '@nestjs/common';
import { CustomFieldModelProvider } from '~/mongo/connect/custom-field.schema';
import { CustomFieldController } from './custom-field.controller';
import { CustomFieldService } from './custom-field.service';

@Module({
  controllers: [CustomFieldController],
  providers: [CustomFieldService, CustomFieldModelProvider],
  exports: [CustomFieldService],
})
export class CustomFieldModule {}
