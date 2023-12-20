import { Body, Controller, Inject, Post } from '@nestjs/common';
import { InstaLogin } from '../services/login.service';
import { MessagePattern } from '@nestjs/microservices';
import { CheckPointCode, Executedto, LogIn } from '../types/types';
import { InstancesService } from '../services/instances.service';

@Controller()
export class AppController {
  constructor(
    private readonly instaLogin: InstaLogin,
    @Inject(InstancesService) private instances: InstancesService,
  ) {}

  @MessagePattern({ cmd: 'login' })
  async handleGetLeads(ctx: LogIn): Promise<void | string> {
    const { username, client, message } = await this.instaLogin.logIn(ctx);
    if (message) {
      return message;
    }
    this.instances.setInstance(username, client);
    return;
  }
  @Post('/login')
  async handlePostLogin(@Body() ctx: LogIn): Promise<void | string> {
    const { username, client, message } = await this.instaLogin.logIn(ctx);
    if (message) {
      return message;
    }
    this.instances.setInstance(username, client);
    return;
  }

  @Post('/checkpointcode')
  async checkpointcode(@Body() ctx: CheckPointCode): Promise<void | string> {
    const { username, code } = ctx;
    const { client } = this.instances.getInstance(username);
    const ig = await this.instaLogin.codeVerification(code, client);
    this.instances.setInstance(username, ig);
    return;
  }

  @Post('/execute')
  async execute(@Body() ctx: Executedto): Promise<void | string> {
  app.post('/api/doinsta', async function (req, res) {
    console.log('receiving data ...');
   
});
}
