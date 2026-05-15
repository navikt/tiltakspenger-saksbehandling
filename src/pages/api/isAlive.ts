import type { NextApiRequest, NextApiResponse } from 'next';

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).send("I'm alive!");
};

export default handler;
