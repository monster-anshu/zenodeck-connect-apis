import { Injectable } from '@nestjs/common';
import { PopulateDefaultDto } from './dto/populate-default.dto';

@Injectable()
export class InternalService {
  async populateDefault({
    companyId,
    companyName,
    userId,
  }: PopulateDefaultDto) {}
}
