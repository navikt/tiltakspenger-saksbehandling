import { MeldekortbehandlingSkjemaValideringsfeil } from '~/lib/meldekort/v2/meldekortbehandling/context/meldekortbehandlingSkjemaValidering';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { BodyShort, InlineMessage, VStack } from '@navikt/ds-react';
import { meldeperiodeKjedeIdTilPeriode } from '~/utils/periode';
import { formaterDatotekst, formaterPeriodeKort } from '~/utils/date';

type Props = {
    feil: MeldekortbehandlingSkjemaValideringsfeil;
};

export const MeldekortbehandlingValideringsfeil = ({ feil }: Props) => {
    const { meldeperioderFeil, overordnedeFeil } = feil;

    return (
        <Infokort variant={'feil'} header={'Feil eller mangler i behandlingen'}>
            <VStack gap={'space-16'}>
                <BodyShort>{'Må rettes før behandlingen kan sendes til beslutning.'}</BodyShort>

                {overordnedeFeil.map((feil) => (
                    <InlineMessage status={'error'} key={feil}>
                        {feil}
                    </InlineMessage>
                ))}

                {meldeperioderFeil.map((mp) => {
                    const { kjedeId, dagerFeil, overordnedeFeil } = mp;

                    const periode = meldeperiodeKjedeIdTilPeriode(kjedeId);

                    return (
                        <VStack key={kjedeId} gap={'space-4'}>
                            <BodyShort weight={'semibold'}>
                                {`Meldeperiode ${formaterPeriodeKort(periode)}`}
                            </BodyShort>

                            {overordnedeFeil.map((feil) => (
                                <BodyShort key={feil}>{feil}</BodyShort>
                            ))}

                            {dagerFeil.length > 0 && (
                                <VStack>
                                    {dagerFeil.map((dag) => {
                                        return (
                                            <BodyShort key={dag.dato}>
                                                {`${formaterDatotekst(dag.dato)} - ${dag.feil}`}
                                            </BodyShort>
                                        );
                                    })}
                                </VStack>
                            )}
                        </VStack>
                    );
                })}
            </VStack>
        </Infokort>
    );
};
