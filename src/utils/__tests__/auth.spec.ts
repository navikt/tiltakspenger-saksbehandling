import { getToken } from '../auth';

global.fetch = jest.fn();

const okResponse = {
    ok: true,
    json: () => Promise.resolve({ access_token: 'accessTokenMock' }),
};

const notOkResponse = {
    status: 401,
    headers: { 'content-type': 'application/json' },
    body: null,
};

function getTokenCaller(params: any) {
    return () => getToken(params);
}

function mockRequestWithAuthorizationHeader(authorizationHeaderValue?: string) {
    return { headers: { authorization: authorizationHeaderValue } };
}

describe('getToken', () => {
    test('it should throw an error if no authorization header is provided', async () => {
        const request = mockRequestWithAuthorizationHeader();
        const getTokenCall = getTokenCaller(request);
        expect(getTokenCall).rejects.toThrow('Ingen tilgang');
    });

    test('it should throw an error if the authorization header contains an invalid token', async () => {
        const request = mockRequestWithAuthorizationHeader('et ugyldig token');
        const getTokenCall = getTokenCaller(request);
        expect(getTokenCall).rejects.toThrow('Ingen tilgang');
    });

    test('it should reject with a response object when on-behalf-of grant fails', async () => {
        // @ts-ignore
        fetch.mockImplementationOnce(() => Promise.reject(notOkResponse));
        const request = mockRequestWithAuthorizationHeader('Bearer blabla.blabla.blabla');
        const getTokenCaller = () => getToken(request as any);
        expect(getTokenCaller).rejects.toEqual(notOkResponse);
    });

    it('should resolve with the resulting access_token when on-behalf-of grant is successful', async () => {
        // @ts-ignore
        fetch.mockImplementationOnce(() => Promise.resolve(okResponse));
        const request = mockRequestWithAuthorizationHeader('Bearer blabla.blabla.blabla');
        const result = await getToken(request as any);
        expect(result).toEqual('accessTokenMock');
    });
});
