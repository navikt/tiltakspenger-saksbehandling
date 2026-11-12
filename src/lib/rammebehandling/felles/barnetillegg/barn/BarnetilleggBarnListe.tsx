import { BodyShort, VStack } from '@navikt/ds-react';
import { useSak } from '~/lib/sak/SakContext';
import { useBehandling } from '~/lib/rammebehandling/context/BehandlingContext';
import { Rammebehandlingsstatus } from '~/lib/rammebehandling/typer/Rammebehandling';
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
        <VStack gap={'space-16'}>
            <BodyShort size={'small'} weight={'semibold'}>
                {behandling.status === Rammebehandlingsstatus.VEDTATT
                    ? 'Barn det er innvilget barnetillegg for'
                    : erReadonly
                      ? 'Barn'
                      : 'Velg barna det skal innvilges barnetillegg for'}
            </BodyShort>

            {kandidater.length === 0 && (
                <BodyShort size={'small'}>
                    {'Fant ingen barn i søknaden(e) eller tidligere vedtak.'}
                    {!erReadonly && ' Barn kan legges til manuelt.'}
                </BodyShort>
            )}

            {kandidater.length > 0 && (
                <VStack gap={'space-16'}>
                    {kandidater.map((kandidat) => (
                        <BarnetilleggBarnValg kandidat={kandidat} key={kandidat.barn.key} />
                    ))}
                </VStack>
            )}

            {!erReadonly && (
                <LeggTilBarnetilleggBarn
                    eksisterendeBarn={kandidater.map((kandidat) => kandidat.barn)}
                />
            )}
        </VStack>
    );
};
