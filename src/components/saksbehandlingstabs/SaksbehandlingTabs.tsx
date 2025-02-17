import { Loader, Tabs } from '@navikt/ds-react';
import router from 'next/router';
import { useHentBehandlingDeprecated } from '../../hooks/useHentBehandlingDeprecated';
import { BehandlingStatus } from '../../types/BehandlingTypes';
import { useContext, useState } from 'react';
import { BehandlingContextDeprecated } from '../layout/FørstegangsbehandlingLayout';
import { kanSaksbehandleForBehandling } from '../../utils/tilganger';
import { useSaksbehandler } from '../../hooks/useSaksbehandler';

export const Saksbehandlingstabs = () => {
    const aktivTab = router.route.split('/')[3];
    const { innloggetSaksbehandler } = useSaksbehandler();
    const { behandlingId } = useContext(BehandlingContextDeprecated);
    const { valgtBehandling, isLoading } = useHentBehandlingDeprecated(behandlingId);
    const [value, setValue] = useState(aktivTab);

    if (isLoading || !valgtBehandling) {
        return <Loader />;
    }

    const erUnderBehandling = (status: string) => status === BehandlingStatus.UNDER_BEHANDLING;

    return (
        <Tabs value={value} onChange={setValue}>
            <Tabs.List>
                {erUnderBehandling(valgtBehandling.status) &&
                    kanSaksbehandleForBehandling(valgtBehandling, innloggetSaksbehandler) && (
                        <Tabs.Tab
                            value={'inngangsvilkar'}
                            label={'Inngangsvilkår'}
                            id="inngangsvilkår-tab"
                            aria-controls="inngangsvilkår-panel"
                            onClick={() =>
                                router.push(`/behandling/${behandlingId}/inngangsvilkar/kravfrist`)
                            }
                        />
                    )}
                <Tabs.Tab
                    value={'oppsummering'}
                    label={'Oppsummering'}
                    id="oppsummering-tab"
                    aria-controls="oppsummering-panel"
                    onClick={() => router.push(`/behandling/${behandlingId}/oppsummering`)}
                />
            </Tabs.List>
        </Tabs>
    );
};
