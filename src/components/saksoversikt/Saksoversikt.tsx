import { Box, Heading, HStack, Spacer } from '@navikt/ds-react';
import { BehandlingData, BehandlingStatus, Behandlingstype } from '../../types/BehandlingTypes';
import { MeldekortOversikt } from './meldekort-oversikt/MeldekortOversikt';
import { BehandlingerOversikt } from './behandlinger-oversikt/BehandlingerOversikt';
import { OpprettRevurdering } from './opprett-revurdering/OpprettRevurdering';
import { PersonaliaHeader } from '../personaliaheader/PersonaliaHeader';
import { useSak } from '../../context/sak/SakContext';
import { AvsluttedeBehandlinger } from './behandlinger-oversikt/AvsluttedeBehandlinger';
import { MeldeperiodeKjedeStatus } from '../../types/meldekort/Meldeperiode';
import { MeldekortOversiktIkkeKlar } from './meldekort-oversikt/ikke-klar/MeldekortOversiktIkkeKlar';

import styles from './Saksoversikt.module.css';

export const Saksoversikt = () => {
    const { sakId, saksnummer, behandlinger, behandlingsoversikt, søknader, meldeperiodeKjeder } =
        useSak().sak;

    const { meldeperiodeKjederIkkeKlare, meldeperiodeKjederKlare } = Object.groupBy(
        meldeperiodeKjeder,
        ({ status }) =>
            status === MeldeperiodeKjedeStatus.IKKE_KLAR_TIL_BEHANDLING
                ? 'meldeperiodeKjederIkkeKlare'
                : 'meldeperiodeKjederKlare',
    );

    return (
        <>
            <PersonaliaHeader sakId={sakId} saksnummer={saksnummer} />
            <Box className={styles.wrapper}>
                <HStack align="center" className={styles.spacing}>
                    <Heading spacing size="medium" level="2">
                        Saksoversikt
                    </Heading>
                    <Spacer />
                    <OpprettRevurdering
                        sakId={sakId}
                        harVedtak={harVedtattFørstegangsbehandling(behandlinger)}
                    />
                </HStack>
                <Box className={styles.tabellwrapper}>
                    <Heading level={'3'} size={'small'}>
                        {'Behandlinger'}
                    </Heading>
                    <BehandlingerOversikt behandlinger={behandlingsoversikt} />
                </Box>
                <AvsluttedeBehandlinger
                    søknader={søknader}
                    behandlinger={behandlinger}
                    saksnummer={saksnummer}
                />

                <Box className={styles.tabellwrapper}>
                    <div className={styles.meldekortHeaderRad}>
                        <Heading level={'3'} size={'small'}>
                            {'Meldekort'}
                        </Heading>
                        {meldeperiodeKjederIkkeKlare && (
                            <MeldekortOversiktIkkeKlar
                                meldeperiodeKjeder={meldeperiodeKjederIkkeKlare}
                            />
                        )}
                    </div>
                    {meldeperiodeKjederKlare && (
                        <MeldekortOversikt
                            meldeperiodeKjeder={meldeperiodeKjederKlare}
                            saksnummer={saksnummer}
                        />
                    )}
                </Box>
            </Box>
        </>
    );
};

const harVedtattFørstegangsbehandling = (behandlingsoversikt: BehandlingData[]) =>
    behandlingsoversikt.some(
        (behandling) =>
            behandling.type === Behandlingstype.FØRSTEGANGSBEHANDLING &&
            behandling.status === BehandlingStatus.VEDTATT,
    );
