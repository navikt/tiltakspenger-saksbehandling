import { Branded } from '~/types/UtilTypes';
import { GetServerSidePropsContext } from 'next';

export type Saksnummer = Branded<string, 'saksnummer'>;

export const tilSaksnummer = (s: string): Saksnummer => {
    if (!erSaksnummer(s)) {
        throw new Error(`Ugyldig saksnummer: ${s}`);
    }
    return s as Saksnummer;
};

export const erSaksnummer = (s: string): s is Saksnummer => {
    return /^\d{12,}$/.test(s);
};

export const saksnummerFraPageContext = (context: GetServerSidePropsContext): Saksnummer | null => {
    const saksnummer = context.params?.saksnummer;

    return typeof saksnummer === 'string' && erSaksnummer(saksnummer) ? saksnummer : null;
};
