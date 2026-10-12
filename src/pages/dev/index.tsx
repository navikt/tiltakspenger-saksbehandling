import dynamic from 'next/dynamic';
import { pageWithAuthentication } from '~/auth/pageWithAuthentication';

// NEXT_PUBLIC_-variabler inlines ved bygg. Når dev-rutene er skrudd av blir importen under død kode,
// og dev-komponentene i ~/dev blir ikke med i bygget.
const devRuterErAktivert = process.env.NEXT_PUBLIC_DEVROUTES === 'true';

const LokalDevSide = devRuterErAktivert
    ? dynamic(() => import('~/dev/LokalDevSide').then((mod) => mod.LokalDevSide))
    : () => null;

export const getServerSideProps = pageWithAuthentication(async () => {
    if (devRuterErAktivert) {
        return { props: {} };
    }

    return { notFound: true };
});

const LocalDevPage = () => {
    return <LokalDevSide />;
};

export default LocalDevPage;
