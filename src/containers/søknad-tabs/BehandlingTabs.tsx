import React from 'react';
import { Tabs } from '@navikt/ds-react';
import { FileTextIcon } from '@navikt/aksel-icons';
import styles from './SøknadTabs.module.css';
import { Behandling } from '../../types/Behandling';
import { BankNoteIcon, CardIcon } from '@navikt/aksel-icons';
import { InngangsvilkårTab } from './InngangsvilkårTab';
import { MeldekortSide } from '../../containers/søknad-tabs/MeldekortSide';
import {Lesevisning} from "../../utils/avklarLesevisning";

interface SøknadTabsProps {
    className?: string;
    defaultTab: string;
    onChange: (søknadId: string) => void;
    behandling: Behandling;
    lesevisning: Lesevisning;
    sendTabCallback?: (tab: string) => void;
}

const BehandlingTabs = ({ defaultTab, behandling, lesevisning, sendTabCallback }: SøknadTabsProps) => {
    return (
        <div className={styles.tabsHistorikkDiv}>
                <Tabs defaultValue={defaultTab}>
                    <Tabs.List>
                        <Tabs.Tab
                            key={'Inngangsvilkår'}
                            value={'Inngangsvilkår'}
                            label={'Inngangsvilkår'}
                            icon={<FileTextIcon />}
                            onClick={() => {sendTabCallback && sendTabCallback('Inngangsvilkår')}}
                        />
                        <Tabs.Tab
                            key={'Meldekort'}
                            value={'Meldekort'}
                            label={'Meldekort'}
                            icon={<CardIcon />}
                            onClick={() => {sendTabCallback && sendTabCallback('Meldekort')}}
                        />

                        <Tabs.Tab
                            key={'Utbetaling'}
                            value={'Utbetaling'}
                            label={'Utbetaling'}
                            icon={<BankNoteIcon />}
                            onClick={() => {sendTabCallback && sendTabCallback('Utbetaling')}}
                        />
                    </Tabs.List>
                    <Tabs.Panel value={'Inngangsvilkår'}>
                        <InngangsvilkårTab
                            behandlingId={behandling.behandlingId}
                            kategoriserteSaksopplysninger={behandling.saksopplysninger}
                            behandlingsperiode={{fom: behandling.fom, tom: behandling.tom}}
                            lesevisning={lesevisning}
                        />
                    </Tabs.Panel>
                    <Tabs.Panel value={'Meldekort'}>
                        <MeldekortSide />
                    </Tabs.Panel>
                    <Tabs.Panel value={'Utbetaling'}>Utbetaling</Tabs.Panel>
                </Tabs>
        </div>
    );
};

export default BehandlingTabs;
