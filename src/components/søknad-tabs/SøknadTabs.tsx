import VilkårsvurderingDetails from '../vilkårsvurdering-details/VilkårsvurderingDetails';
import React from 'react';
import { Tabs } from '@navikt/ds-react';
import { FileContent } from '@navikt/ds-icons';
import { useAtom } from 'jotai';
import { Behandling } from '../../types/Søknad';
import { formatDate } from '../../utils/date';
import { søknadIdAtom } from '../../pages/soker/[...all]';

interface SøknadTabsProps {
    className?: string;
    defaultTab: string;
    onChange: (søknadId: string) => void;
    behandlinger: Behandling[];
}

const SøknadTabs = ({ className, defaultTab, onChange, behandlinger }: SøknadTabsProps) => {
    const [søknadId, setSøknadId] = useAtom(søknadIdAtom);
    return (
        <Tabs defaultValue={defaultTab} className={className || ''}>
            <Tabs.List>
                {behandlinger.map((behandling) => {
                    const { søknad } = behandling;
                    return (
                        <Tabs.Tab
                            key={søknad.id}
                            value={søknad.id}
                            label={`${søknad.arrangoernavn || søknad.tiltakskode} (${formatDate(søknad.startdato)})`}
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
