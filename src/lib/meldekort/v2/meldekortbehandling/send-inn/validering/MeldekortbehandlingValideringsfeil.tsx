import { MeldekortbehandlingSkjemaValideringsfeil } from '~/lib/meldekort/v2/meldekortbehandling/context/meldekortbehandlingSkjemaValidering';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { BodyShort, VStack } from '@navikt/ds-react';
import { meldeperiodeKjedeIdTilPeriode } from '~/utils/periode';
import { formaterDatotekst, formaterPeriodeKort } from '~/utils/date';

type Props = {
    feil: MeldekortbehandlingSkjemaValideringsfeil;
};

export const MeldekortbehandlingValideringsfeil = ({ feil }: Props) => {
    const { meldeperioder } = feil;

    return (
        <Infokort variant={'feil'} header={'Feil eller mangler i behandlingen'}>
            <VStack gap={'space-8'}>
                <BodyShort spacing={true}>
                    {'Må rettes før behandlingen kan sendes til beslutning.'}
                </BodyShort>

                {meldeperioder.map((mp) => {
                    const { kjedeId, dager } = mp;

                    const periode = meldeperiodeKjedeIdTilPeriode(kjedeId);

                    return (
                        <VStack key={kjedeId}>
                            <BodyShort weight={'semibold'}>
                                {`Meldeperiode ${formaterPeriodeKort(periode)}`}
                            </BodyShort>

                            {dager.map((dag) => {
                                return (
                                    <BodyShort key={dag.dato}>
                                        {`${formaterDatotekst(dag.dato)} - ${dag.feil}`}
                                    </BodyShort>
                                );
                            })}
                        </VStack>
                    );
                })}
            </VStack>
        </Infokort>
    );
};
