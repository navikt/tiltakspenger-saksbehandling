import { meldeperiodeKjedeIdTilPeriode } from '~/utils/periode';
import { BodyShort, VStack } from '@navikt/ds-react';
import { formaterDatotekst, formaterPeriodeKort } from '~/utils/date';
import { MeldeperiodeSkjemaValideringsfeil } from '~/lib/meldekort/v2/meldekortbehandling/context/meldekortbehandlingSkjemaValidering';

type Props = {
    valideringsfeil: MeldeperiodeSkjemaValideringsfeil;
    className?: string;
};

export const MeldeperiodebehandlingValideringsfeil = ({ valideringsfeil, className }: Props) => {
    const { kjedeId, dagerFeil, overordnedeFeil } = valideringsfeil;

    const periode = meldeperiodeKjedeIdTilPeriode(kjedeId);

    return (
        <VStack gap={'space-4'} className={className}>
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
};
