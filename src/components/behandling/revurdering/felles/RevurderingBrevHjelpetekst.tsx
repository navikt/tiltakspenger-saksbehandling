import { BodyLong } from '@navikt/ds-react';
import { TekstListe } from '~/components/liste/TekstListe';

export const RevurderingBrevHjelpetekst = () => {
    return (
        <>
            <BodyLong size={'small'}>{'Informer bruker om:'}</BodyLong>
            <TekstListe
                tekster={[
                    'Hvorfor du har endret vedtaket',
                    'Hvordan du har vurdert faktum opp mot reglene',
                    'Eventuelt andre relevante opplysninger som ikke kommer frem i standardtekstene i brevet',
                ]}
            />
        </>
    );
};
