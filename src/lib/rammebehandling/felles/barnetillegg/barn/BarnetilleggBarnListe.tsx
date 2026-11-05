import { BodyShort, VStack } from '@navikt/ds-react';
import { useSak } from '~/lib/sak/SakContext';
import { useBehandling } from '~/lib/rammebehandling/context/BehandlingContext';
import { useBehandlingInnvilgelseMedPerioderSkjema } from '~/lib/rammebehandling/context/innvilgelse/innvilgelseContext';
import { hentBarnetilleggKandidater } from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggSkjemaUtils';
import { BarnetilleggBarnValg } from '~/lib/rammebehandling/felles/barnetillegg/barn/BarnetilleggBarnValg';
import { LeggTilBarnetilleggBarn } from '~/lib/rammebehandling/felles/barnetillegg/barn/LeggTilBarnetilleggBarn';

export const BarnetilleggBarnListe = () => {
    const { sak } = useSak();
    const { behandling } = useBehandling();
    const { innvilgelse, erReadonly } = useBehandlingInnvilgelseMedPerioderSkjema();

    const kandidater = hentBarnetilleggKandidater(behandling, innvilgelse, sak);

    return (
        <VStack gap={'space-12'}>
            <BodyShort size={'small'} weight={'semibold'}>
                {erReadonly ? 'Barn' : 'Velg barna det skal innvilges barnetillegg for'}
            </BodyShort>

            {kandidater.length === 0 && (
                <BodyShort size={'small'}>
                    {'Fant ingen barn i søknaden(e) eller tidligere vedtak.'}
                    {!erReadonly && ' Barn kan legges til manuelt.'}
                </BodyShort>
            )}

            {kandidater.map((kandidat) => (
                <BarnetilleggBarnValg kandidat={kandidat} key={kandidat.barn.key} />
            ))}

            {!erReadonly && (
                <LeggTilBarnetilleggBarn
                    eksisterendeKeys={kandidater.map((kandidat) => kandidat.barn.key)}
                />
            )}
        </VStack>
    );
};
