import { IgApiClient } from 'instagram-private-api';

export type LogIn = {
  password: string;
  username: string;
  proxyString: string;
};

export type IgInstance = {
  [name: string]: {
    client: IgApiClient;
  };
};

export type LoginResult = {
  username: string;
  client: IgApiClient;
  message?: string;
};

export type CheckPointCode = {
  username: string;
  code: number;
  args: any;
};

export type Executedto = {
  functionString: string;
  username: string;
  args: any;
};
