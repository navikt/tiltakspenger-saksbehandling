import VilkårsvurderingDetails from '../vilkårsvurdering-details/VilkårsvurderingDetails';
import React from 'react';
import { Alert, Heading, Tabs } from '@navikt/ds-react';
import { FileContent } from '@navikt/ds-icons';
import { useAtom } from 'jotai';
import Søknad from '../../types/Søknad';
import { formatDate } from '../../utils/date';
import { søknadIdAtom } from '../../pages/soker/[...all]';
import { Behandling } from '../../types/Behandling';
import Personalia from '../../types/Personalia';
import styles from './SøknadTabs.module.css';
import { SøknadLayout } from '../../layouts/soker/SøknadLayout';

interface SøknadTabsProps {
    className?: string;
    defaultTab: string;
    onChange: (søknadId: string) => void;
    behandlinger: Behandling[];
    personalia: Personalia;
}

function createSøknadLabel({ startdato, arrangoernavn, tiltakskode }: Søknad) {
    const arrangørNavnEllerTiltakskode = arrangoernavn || tiltakskode;
    if (startdato) {
        return `${arrangørNavnEllerTiltakskode} (${formatDate(startdato)})`;
    }
    return arrangørNavnEllerTiltakskode;
}

const SøknadTabs = ({ defaultTab, onChange, behandlinger, personalia }: SøknadTabsProps) => {
    const [søknadId, setSøknadId] = useAtom(søknadIdAtom);
    console.log('behandlinger', behandlinger);
    return (
        <Tabs defaultValue={defaultTab} className={styles.søknadTabs}>
            <Tabs.List>
                {behandlinger.map((behandling) => {
                    const { søknad } = behandling;
                    const søknadLabel = createSøknadLabel(søknad);
                    return (
                        <Tabs.Tab
                            key={søknad.id}
                            value={søknad.id}
                            label={søknadLabel}
                            icon={<FileContent />}
                            onClick={() => {
                                setSøknadId(søknad.id);
                                onChange(søknad.id);
                            }}
                        />
                    );
                })}
            </Tabs.List>
            {behandlinger.map((behandling) => {
                const { klarForBehandling } = behandling;
                return (
                    <Tabs.Panel key={behandling.søknad.id} value={behandling.søknad.id}>
                        <SøknadLayout>
                            {klarForBehandling ? (
                                <VilkårsvurderingDetails behandling={behandling} personalia={personalia} />
                            ) : (
                                <Alert variant="warning">
                                    <Heading spacing size="small" level="3">
                                        Søknaden mangler data fra alle relevante systemer
                                    </Heading>
                                    Vent noen minutter og oppdater siden
                                </Alert>
                            )}
                        </SøknadLayout>
                    </Tabs.Panel>
                );
            })}
        </Tabs>
    );
};

export default SøknadTabs;
