import { getToken } from '../auth';

describe('getToken', () => {
    test('it should throw an error if no authorization header is provided', async () => {
        const getTokenCaller = () => getToken({ headers: [] } as any);
        expect(getTokenCaller).rejects.toThrow('Ingen tilgang');
    });

    test('it should throw an error if the authorization header contains an invalid token', async () => {
        const getTokenCaller = () => getToken({ headers: [{ authorization: 'et ugyldig token' }] } as any);
        expect(getTokenCaller).rejects.toThrow('Ingen tilgang');
    });
});
