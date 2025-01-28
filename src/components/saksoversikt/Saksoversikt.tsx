import { Box, HStack, Heading, Spacer } from '@navikt/ds-react';
import { BehandlingForBenk } from '../../types/BehandlingTypes';
import { MeldeperiodeSammendragProps } from '../../types/MeldekortTypes';
import { MeldekortOversikt } from './meldekort-oversikt/MeldekortOversikt';
import { BehandlingerOversikt } from './behandlinger-oversikt/BehandlingerOversikt';
import { useFeatureToggles } from '../../hooks/useFeatureToggles';
import { RevurderTilStans } from './revurder-stans/RevurderTilStans';

import styles from './Saksoversikt.module.css';

interface SaksoversiktProps {
    behandlingsoversikt: BehandlingForBenk[];
    meldeperioder: MeldeperiodeSammendragProps[];
    førsteLovligeStansdato: string;
    saksnummer: string;
    sakId: string;
}

export const Saksoversikt = ({
    behandlingsoversikt,
    førsteLovligeStansdato,
    meldeperioder,
    saksnummer,
    sakId,
}: SaksoversiktProps) => {
    const { revurderingStansToggle } = useFeatureToggles();

    return (
        <Box className={styles.wrapper}>
            <HStack align="center" style={{ marginBottom: '1rem' }}>
                <Heading spacing size="medium" level="2">
                    Saksoversikt
                </Heading>
                <Spacer />
                {revurderingStansToggle && (
                    <RevurderTilStans
                        sakId={sakId}
                        saksnummer={saksnummer}
                        førsteLovligeStansdato={førsteLovligeStansdato}
                        sisteLovligeStansdato={behandlingsoversikt[0].periode.tilOgMed}
                    />
                )}
            </HStack>
            <Box className={styles.tabellwrapper}>
                <Heading level={'3'} size={'small'}>
                    {'Behandlinger'}
                </Heading>
                <BehandlingerOversikt behandlinger={behandlingsoversikt} />
            </Box>
            <Box className={styles.tabellwrapper}>
                <Heading level={'3'} size={'small'}>
                    {'Meldekort'}
                </Heading>
                <MeldekortOversikt meldeperioder={meldeperioder} saksnummer={saksnummer} />
            </Box>
        </Box>
    );
};
