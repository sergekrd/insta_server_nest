import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { InstaLogin } from './services/login.service';
import { PrismaModule } from 'nestjs-prisma';

import { InstancesService } from './services/instances.service';
import { ExecuteService } from './services/execute.service';
import { CookiesService } from './services/cookies.service';
import { UsersService } from './services/users.service';

@Module({
  imports: [PrismaModule],
  controllers: [AppController],
  providers: [
    InstaLogin,
    InstancesService,
    ExecuteService,
    CookiesService,
    UsersService,
  ],
})
export class AppModule {}
