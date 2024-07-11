import { NextApiRequest, NextApiResponse } from 'next';

export type ApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
) => Promise<unknown> | unknown;

export interface TokenPayload {
  sub: string;
  iss: string;
  client_amr: string;
  pid: string;
  token_type: string;
  client_id: string;
  acr: string;
  scope: string;
  exp: string;
  iat: string;
  client_orgno: string;
  jti: string;
  consumer: {
    authority: string;
    ID: string;
  };
}
