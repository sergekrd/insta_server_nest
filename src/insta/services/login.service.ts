import { Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(InstaLogin.name);
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

      if (proxyString !== '') {
        ig.state.proxyUrl = proxyString;
      }

      const sessionLoad = await this.tryLoadSession(ig, username);
      if (sessionLoad) {
        this.logger.log(`${username} сессия загружена из кукиз`);
        await this.cookiesService.saveSession(ig, username);
        return { username, client: ig };
      } else {
        const result = await this.auth(ig, username, password);
        if (result?.message) {
          return result;
        } else {
          this.logger.log(`${username} успешный вход`);
          await this.cookiesService.saveSession(result.client, username);
          return { username, client: result.client };
        }
      }
    } catch (error) {
      this.logger.error({
        message: 'Ошибка авторизации:',
        error: error.message,
      });
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
    } catch (error) {
      this.logger.warn({
        message: 'Ошибка в TryLoadSession:',
        error: error.message,
      });
      return false;
    }
  }

  async auth(ig: IgApiClient, username, password) {
    try {
      await ig.simulate.preLoginFlow();
      const loggedInUser = await ig.account.login(username, password);
      await ig.simulate.postLoginFlow();
      await ig.feed.directInbox().items();
      await this.userService.updateUserPk(username, loggedInUser.pk);
      await this.cookiesService.saveSession(ig, username);
      return { username, client: ig };
    } catch (error) {
      switch (true) {
        case error.constructor === IgCheckpointError: {
          await ig.challenge.auto(true);
          this.logger.warn({
            message: 'Checkpoint',
            info: ig.state.checkpoint,
          });
          return { username, client: ig, message: 'check point await' };
        }
        case error.constructor === IgLoginTwoFactorRequiredError: {
          return { username, client: ig, message: 'two factor login await' };
        }
        default: {
          throw error;
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
