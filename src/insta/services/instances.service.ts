import { Injectable, Scope } from '@nestjs/common';
import { IgApiClient } from 'instagram-private-api';

@Injectable({ scope: Scope.DEFAULT })
export class InstancesService {
  private instances: { [name: string]: { client: IgApiClient } } = {};

  getInstance(username: string): { client: IgApiClient } {
    if (!this.instances[username]) {
      return;
    }
    return this.instances[username];
  }
  setInstance(username: string, client: IgApiClient) {
    return (this.instances[username] = { client });
  }
}
