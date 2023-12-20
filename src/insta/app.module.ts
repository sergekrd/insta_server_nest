import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { InstaLogin } from './services/login.service';
import { PrismaModule } from 'nestjs-prisma';

import { InstancesService } from './services/instances.service';

@Module({
  imports: [PrismaModule],
  controllers: [AppController],
  providers: [InstaLogin, InstancesService],
})
export class AppModule {}
