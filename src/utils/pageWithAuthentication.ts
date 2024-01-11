import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import {
  validateAzureToken,
  ValidationError,
} from '@navikt/next-auth-wonderwall';

export async function validateAuthorizationHeader(
  authorizationHeader: string | undefined
) {
  if (!authorizationHeader) {
    throw new Error('Mangler authorization header');
  }
  try {
    const validationResult = await validateAzureToken(authorizationHeader);
    if (validationResult !== 'valid') {
      throw validationResult;
    }
    return validationResult;
  } catch (e) {
    throw new Error((e as ValidationError<any>).message);
  }
}

const defaultGetServerSideProps = async () => ({
  props: {},
});

export function redirectToLogin(context: GetServerSidePropsContext) {
  return {
    redirect: {
      destination: `/oauth2/login?redirect=${context.resolvedUrl}`,
      permanent: false,
    },
  };
}

export function pageWithAuthentication(
  getServerSideProps: GetServerSideProps = defaultGetServerSideProps
) {
  return async (context: GetServerSidePropsContext) => {
    try {
      const authorizationHeader = context.req.headers.authorization;
      if (!authorizationHeader) {
        throw new Error('Fant ingen token i authorization header');
      }
      await validateAuthorizationHeader(authorizationHeader);
    } catch (error) {
      console.error(`Bruker har ikke tilgang: ${(error as Error).message}`);
      return redirectToLogin(context);
    }
    return getServerSideProps(context);
  };
}
