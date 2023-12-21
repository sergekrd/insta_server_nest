import { Injectable } from '@nestjs/common';
import { LogIn, LoginResult } from '../types/types';
import {
  IgApiClient,
  IgCheckpointError,
  IgLoginTwoFactorRequiredError,
} from 'instagram-private-api';
import { UsersService } from './users.service';
import { CookiesService } from './cookies.service';

@Injectable()
export class InstaLogin {
  constructor(
    private readonly userService: UsersService,
    private readonly cookiesService: CookiesService,
  ) {}
  public async logIn(ctx: LogIn): Promise<LoginResult> {
    try {
      const { username, password, proxyString } = ctx;
      await this.userService.saveUser(username, password);

      const ig = new IgApiClient();
      ig.state.generateDevice(username);

      if (proxyString == '') {
      } else {
        ig.state.proxyUrl = proxyString;
      }
      const sessionLoad = await this.tryLoadSession(ig, username);
      if (sessionLoad) {
        console.log(username + ' сессия загружена из кукиз');
        await this.cookiesService.saveSession(ig, username);
        return { username, client: ig };
      }

      if (!sessionLoad) {
        console.log(`${username} +  сессия не загружена из кукиз`);
        const result = await this.auth(ig, username, password);
        if (result?.message) {
          return result;
        } else {
          console.log('Вход осуществлен');
          await this.cookiesService.saveSession(result.client, username);
          return { username, client: result.client };
        }
      }
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      throw error;
    }
  }

  async tryLoadSession(ig: IgApiClient, username: string): Promise<boolean> {
    try {
      const cookies = await this.cookiesService.loadSession(username);
      if (!cookies) return false;
      await ig.state.deserialize(cookies);
      await ig.feed.directInbox().items();
      return true;
    } catch (e) {
      console.log('Ошибка в TryLoadSession:', e.message);
      return false;
    }
  }

  async auth(ig: IgApiClient, username, password) {
    try {
      await ig.simulate.preLoginFlow();
      const loggedInUser = await ig.account.login(username, password);
      process.nextTick(async () => {
        const t = ig.simulate.postLoginFlow();
        await t;
      });
      await ig.feed.directInbox().items();
      await this.userService.updateUserPk(username, loggedInUser.pk);
      await this.cookiesService.saveSession(ig, username);
      return { username, client: ig };
    } catch (e) {
      switch (true) {
        case e.constructor === IgCheckpointError: {
          console.log(ig.state.checkpoint); // Checkpoint info here
          await ig.challenge.auto(true); // Requesting sms-code or click "It was me" button
          console.log(ig.state.checkpoint); // Challenge info here
          return { username, client: ig, message: 'check point await' };
        }
        case e.constructor === IgLoginTwoFactorRequiredError: {
          return { username, client: ig, message: 'two factor login await' };
        }
        default: {
          console.log(e);
          throw e;
        }
      }
    }
  }

  public async codeVerification(code: number, ig: IgApiClient) {
    try {
      await ig.challenge.sendSecurityCode(code);
      return ig;
    } catch (e: any) {
      console.log('Could not resolve checkpoint:', e, e.stack);
    }
  }
}
