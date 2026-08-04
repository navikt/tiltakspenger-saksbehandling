import { meldeperiodeKjedeIdTilPeriode } from '~/utils/periode';
import { BodyShort, VStack } from '@navikt/ds-react';
import { formaterDatotekst, formaterPeriodeKort, nesteDag } from '~/utils/date';
import {
    MeldekortDagValideringsfeil,
    MeldeperiodeSkjemaValideringsfeil,
} from '~/lib/meldekort/meldekortbehandling/context/meldekortbehandlingSkjemaValidering';
import { Periode } from '~/types/Periode';

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
                    {grupperSammenhengendeDagerFeil(dagerFeil).map(
                        ({ periode: dagerPeriode, feil }) => {
                            const { fraOgMed, tilOgMed } = dagerPeriode;

                            return (
                                <BodyShort key={`${fraOgMed}-${feil}`}>
                                    {`${
                                        fraOgMed === tilOgMed
                                            ? formaterDatotekst(fraOgMed)
                                            : formaterPeriodeKort(dagerPeriode)
                                    }: ${feil}`}
                                </BodyShort>
                            );
                        },
                    )}
                </VStack>
            )}
        </VStack>
    );
};

/** Slår sammen sammenhengende dager med samme feilmelding til én periode */
const grupperSammenhengendeDagerFeil = (
    dagerFeil: MeldekortDagValideringsfeil[],
): { periode: Periode; feil: string }[] => {
    const grupper: { periode: Periode; feil: string }[] = [];

    dagerFeil
        .toSorted((a, b) => a.dato.localeCompare(b.dato))
        .forEach((dag) => {
            const forrige = grupper.at(-1);

            if (
                forrige &&
                forrige.feil === dag.feil &&
                nesteDag(forrige.periode.tilOgMed) === dag.dato
            ) {
                forrige.periode.tilOgMed = dag.dato;
            } else {
                grupper.push({
                    periode: { fraOgMed: dag.dato, tilOgMed: dag.dato },
                    feil: dag.feil,
                });
            }
        });

    return grupper;
};
