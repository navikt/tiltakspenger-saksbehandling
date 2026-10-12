import dynamic from 'next/dynamic';
import { pageWithAuthentication } from '~/auth/pageWithAuthentication';

// Se src/pages/dev/index.tsx: sjekken må stå inline her for at importen skal bli død kode i prod-bygget.
const devRuterErAktivert = process.env.NEXT_PUBLIC_DEVROUTES === 'true';

const OppdaterTiltaksdeltakelseSide = devRuterErAktivert
    ? dynamic(() =>
          import('~/dev/tiltaksdeltakelse/OppdaterTiltaksdeltakelseSide').then(
              (mod) => mod.OppdaterTiltaksdeltakelseSide,
          ),
      )
    : () => null;

export const getServerSideProps = pageWithAuthentication(async (context) => {
    const id = context.params?.id;
    const harMaksEttIdSegment = !Array.isArray(id) || id.length <= 1;

    if (devRuterErAktivert && harMaksEttIdSegment) {
        return { props: {} };
    }

    return { notFound: true };
});

const OppdaterTiltaksdeltakelsePage = () => {
    return <OppdaterTiltaksdeltakelseSide />;
};

export default OppdaterTiltaksdeltakelsePage;
