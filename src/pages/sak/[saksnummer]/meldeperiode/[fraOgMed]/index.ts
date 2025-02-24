import { Loader } from '@navikt/ds-react';
import { pageWithAuthentication } from '../../../../../auth/pageWithAuthentication';
import dayjs from 'dayjs';

export const getServerSideProps = pageWithAuthentication(async (context) => {
    const fraOgMed = context.params!.fraOgMed as string;
    // Anta at meldeperioden er 14 dager og redirect dersom kun fra-dato var angitt i url'en
    const tilOgMedDato = dayjs(fraOgMed).add(13, 'days').format('YYYY-MM-DD');

    return {
        redirect: {
            destination: `${context.resolvedUrl}/${tilOgMedDato}`,
            permanent: false,
        },
    };
});

export default Loader;
