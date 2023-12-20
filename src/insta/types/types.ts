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
  code: number;
  username: string;
};

export type Executedto = {
  rFunction: string;
  username: string;
  arg: any;
};
