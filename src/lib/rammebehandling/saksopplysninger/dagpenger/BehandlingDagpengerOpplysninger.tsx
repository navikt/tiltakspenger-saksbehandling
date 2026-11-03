import { BodyShort, VStack } from '@navikt/ds-react';
import { BehandlingSaksopplysning } from '~/lib/rammebehandling/saksopplysninger/BehandlingSaksopplysning';
import {
    Dagpengeperiode,
    dagpengerKildeTekst,
    dagpengerYtelsetypeTekst,
} from '~/lib/rammebehandling/typer/Dagpengeperiode';
import { formaterDatotekst } from '~/utils/date';

type Props = {
    perioder: Dagpengeperiode[];
};

export const BehandlingDagpengerOpplysninger = ({ perioder }: Props) => {
    if (perioder.length === 0) {
        return <BodyShort size={'small'}>{'Ingen relevante dagpengeperioder'}</BodyShort>;
    }

    return (
        <VStack gap={'space-8'}>
            {perioder.map(({ fraOgMed, tilOgMed, ytelsetype, kilde }) => {
                const tilOgMedTekst = tilOgMed ? formaterDatotekst(tilOgMed) : 'løpende';

                return (
                    <div key={`${ytelsetype}-${kilde}-${fraOgMed}`}>
                        <BehandlingSaksopplysning
                            navn={'Ytelse'}
                            verdi={dagpengerYtelsetypeTekst[ytelsetype]}
                            visVarsel
                        />
                        <BehandlingSaksopplysning
                            navn={'Periode'}
                            verdi={`${formaterDatotekst(fraOgMed)} - ${tilOgMedTekst}`}
                        />
                        <BehandlingSaksopplysning
                            navn={'Kilde'}
                            verdi={dagpengerKildeTekst[kilde]}
                        />
                    </div>
                );
            })}
        </VStack>
    );
};
