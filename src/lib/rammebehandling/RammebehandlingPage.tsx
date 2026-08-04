import { SøknadsbehandlingVedtak } from '~/lib/rammebehandling/søknadsbehandling/SøknadsbehandlingVedtak';
import { RammebehandlingSaksopplysninger } from '~/lib/rammebehandling/saksopplysninger/RammebehandlingSaksopplysninger';
import { RevurderingVedtak } from './revurdering/RevurderingVedtak';
import { useBehandling } from './context/BehandlingContext';
import {
    Rammebehandlingsstatus,
    Rammebehandlingstype,
} from '~/lib/rammebehandling/typer/Rammebehandling';
import { PersonaliaHeader } from '../personaliaheader/PersonaliaHeader';
import { Alert, Box, VStack } from '@navikt/ds-react';
import AvbruttOppsummering from '~/lib/behandling-felles/oppsummeringer/oppsummeringAvAvbrutt/OppsummeringAvAvbrutt';
import { Tidslinjer } from '~/lib/_felles/tidslinjer/Tidslinjer';
import { useSak } from '~/lib/sak/SakContext';
import OppsummeringAvVentestatus from '~/lib/behandling-felles/oppsummeringer/ventestatus/OppsummeringAvVentestatus';
import { BehandlingSkjemaProvider } from '~/lib/rammebehandling/context/BehandlingSkjemaContext';
import { PersonoversiktTab } from '~/lib/personoversikt/Personoversikt';
import OppsummeringAvKlageForRammebehandling from '~/lib/behandling-felles/oppsummeringer/klage/oppsummeringAvKlageForRammebehandling/OppsummeringAvKlageForRammebehandling';
import { erBehandlingSattPåVent } from '~/lib/behandling-felles/utils/behandlingUtils';
import { hentKlagebehandling } from '~/lib/sak/sakUtils';

import style from './RammebehandlingPage.module.css';

export const RammebehandlingPage = () => {
    const { sak } = useSak();
    const { behandling } = useBehandling();

    const { type, sakId, saksnummer, status, avbrutt, ventestatus, klagebehandlingId } = behandling;

    const behandlingensKlage = klagebehandlingId
        ? hentKlagebehandling(sak, klagebehandlingId)
        : null;

    const erSattPåVent = erBehandlingSattPåVent(behandling);

    return (
        <>
            <PersonaliaHeader
                sakId={sakId}
                saksnummer={saksnummer}
                visTilbakeKnapp={true}
                aktivTab={
                    status === Rammebehandlingsstatus.VEDTATT
                        ? PersonoversiktTab.VedtatteBehandlinger
                        : PersonoversiktTab.ÅpneBehandlinger
                }
            />

            <BehandlingSkjemaProvider>
                <div className={style.container}>
                    <RammebehandlingSaksopplysninger />

                    <VStack className={style.main} gap={'space-16'}>
                        {erSattPåVent && (
                            <OppsummeringAvVentestatus
                                ventestatus={ventestatus.at(0)!}
                                historikk={ventestatus}
                            />
                        )}
                        <Tidslinjer sak={sak} />
                        {avbrutt && <AvbruttOppsummering avbrutt={avbrutt} withPanel={true} />}
                        {behandlingensKlage && (
                            <Box borderWidth="1">
                                <OppsummeringAvKlageForRammebehandling
                                    klagebehandling={behandlingensKlage}
                                />
                            </Box>
                        )}
                        <div className={style.vedtakContainer}>
                            {type === Rammebehandlingstype.SØKNADSBEHANDLING ? (
                                <SøknadsbehandlingVedtak />
                            ) : type === Rammebehandlingstype.REVURDERING ? (
                                <RevurderingVedtak />
                            ) : (
                                <Alert
                                    variant={'error'}
                                >{`Behandlingstypen er ikke implementert: ${type}`}</Alert>
                            )}
                        </div>
                    </VStack>
                </div>
            </BehandlingSkjemaProvider>
        </>
    );
};
