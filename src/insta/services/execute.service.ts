import { Injectable } from '@nestjs/common';
import { Executedto } from '../types/types';
import { IgApiClient } from 'instagram-private-api';
import { CookiesService } from './cookies.service';

@Injectable()
export class ExecuteService {
  constructor(private readonly cookiesService: CookiesService) {}
  public async run(ig: IgApiClient, executeData: Executedto) {
    {
      try {
        const { functionString, username, args } = executeData;
        const myFunction = eval(`(${functionString})`);

        if (typeof myFunction === 'function') {
          const result = await myFunction(ig, args);
          const json = JSON.stringify(result, null, 4);

          await this.cookiesService.saveSession(ig, username);
          return json;
        } else {
          throw new Error('You send not function');
        }
      } catch (e) {
        console.log(e);
        throw e;
      }
    }
  }
}
