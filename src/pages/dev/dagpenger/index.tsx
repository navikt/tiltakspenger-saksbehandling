import dynamic from 'next/dynamic';
import { pageWithAuthentication } from '~/auth/pageWithAuthentication';

// Se src/pages/dev/index.tsx: sjekken må stå inline her for at importen skal bli død kode i prod-bygget.
const devRuterErAktivert = process.env.NEXT_PUBLIC_DEVROUTES === 'true';

const SettDagpengeperioderSide = devRuterErAktivert
    ? dynamic(() =>
          import('~/dev/dagpenger/SettDagpengeperioderSide').then(
              (mod) => mod.SettDagpengeperioderSide,
          ),
      )
    : () => null;

export const getServerSideProps = pageWithAuthentication(async () => {
    if (devRuterErAktivert) {
        return { props: {} };
    }

    return { notFound: true };
});

const SettDagpengeperioderPage = () => {
    return <SettDagpengeperioderSide />;
};

export default SettDagpengeperioderPage;
