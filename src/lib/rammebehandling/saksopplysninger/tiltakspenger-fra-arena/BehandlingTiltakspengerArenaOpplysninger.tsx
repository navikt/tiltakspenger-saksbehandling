import { BodyShort, VStack } from '@navikt/ds-react';
import { BehandlingSaksopplysning } from '~/lib/rammebehandling/saksopplysninger/BehandlingSaksopplysning';
import { ArenaTPVedtak } from '~/lib/rammebehandling/typer/ArenaTPVedtak';
import { formaterDatotekst } from '~/utils/date';

type Props = {
    vedtak: ArenaTPVedtak[];
};

export const BehandlingTiltakspengerArenaOpplysninger = ({ vedtak }: Props) => {
    if (vedtak.length === 0) {
        return <BodyShort size={'small'}>{'Ingen relevante tiltakspengevedtak i Arena'}</BodyShort>;
    }

    return (
        <VStack gap={'space-8'}>
            {vedtak.map((tpvedtak) => {
                const { fraOgMed, tilOgMed, rettighet } = tpvedtak;
                const tilOgMedTekst = tilOgMed ? formaterDatotekst(tilOgMed) : '';

                return (
                    <div key={`${tpvedtak.rettighet}-${tpvedtak.fraOgMed}`}>
                        <BehandlingSaksopplysning
                            navn={'Rettighet'}
                            verdi={rettighet}
                            visVarsel={true}
                        />
                        <BehandlingSaksopplysning
                            navn={'Periode'}
                            verdi={`${formaterDatotekst(fraOgMed)} - ${tilOgMedTekst}`}
                        />
                    </div>
                );
            })}
        </VStack>
    );
};
