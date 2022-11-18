import VilkårsvurderingDetails from '../vilkårsvurdering-details/VilkårsvurderingDetails';
import React from 'react';
import { Tabs } from '@navikt/ds-react';
import { Behandling } from '../../types/Søknad';
import { formatDate } from '../../utils/date';
import { FileContent } from '@navikt/ds-icons';

interface SøknadTabsProps {
    defaultTab: string;
    onChange: (søknadId: string) => void;
    behandlinger: Behandling[];
}

const SøknadTabs = ({ defaultTab, onChange, behandlinger }: SøknadTabsProps) => {
    return (
        <Tabs defaultValue={defaultTab}>
            <Tabs.List>
                {behandlinger.map((behandling) => {
                    return (
                        <Tabs.Tab
                            key={behandling.søknad.id}
                            value={behandling.søknad.id}
                            label={`${behandling.søknad.arrangoernavn} (${formatDate(behandling.søknad.startdato)})`}
                            icon={<FileContent />}
                            onClick={() => {
                                onChange(behandling.søknad.id);
                            }}
                        />
                    );
                })}
            </Tabs.List>
            {behandlinger.map((behandling) => {
                return (
                    <Tabs.Panel key={behandling.søknad.id} value={behandling.søknad.id}>
                        <VilkårsvurderingDetails søknadResponse={behandling} />
                    </Tabs.Panel>
                );
            })}
        </Tabs>
    );
};

export default SøknadTabs;
