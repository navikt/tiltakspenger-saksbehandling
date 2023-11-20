import React from 'react';
import { Tabs } from '@navikt/ds-react';
import { ChevronRightIcon, FileTextIcon } from '@navikt/aksel-icons';
import styles from './SøknadTabs.module.css';
import { Behandling } from '../../types/Behandling';
import { BankNoteIcon, CardIcon } from '@navikt/aksel-icons';
import { InngangsvilkårTab } from './InngangsvilkårTab';
import { MeldekortTab } from './MeldekortTab';

interface SøknadTabsProps {
    className?: string;
    defaultTab: string;
    onChange: (søknadId: string) => void;
    behandling: Behandling;
}

const BehandlingTabs = ({ defaultTab, behandling }: SøknadTabsProps) => {
    return (
        <div className={styles.tabsHistorikkDiv}>
            <div className={styles.tabsColumn}>
                <Tabs defaultValue={defaultTab} className={styles.søknadTabs}>
                    <Tabs.List>
                        <Tabs.Tab
                            key={'Inngangsvilkår'}
                            value={'Inngangsvilkår'}
                            label={'Inngangsvilkår'}
                            icon={<FileTextIcon />}
                            onClick={() => {}}
                        />
                        <Tabs.Tab
                            key={'Meldekort'}
                            value={'Meldekort'}
                            label={'Meldekort'}
                            icon={<CardIcon />}
                            onClick={() => {}}
                        />

                        <Tabs.Tab
                            key={'Utbetaling'}
                            value={'Utbetaling'}
                            label={'Utbetaling'}
                            icon={<BankNoteIcon />}
                            onClick={() => {}}
                        />
                    </Tabs.List>
                    <Tabs.Panel value={'Inngangsvilkår'}>
                        <InngangsvilkårTab
                            behandlingId={behandling.behandlingId}
                            kategoriserteSaksopplysninger={behandling.saksopplysninger}
                            periodeFom={behandling.fom}
                            periodeTom={behandling.tom}
                        />
                    </Tabs.Panel>
                    <Tabs.Panel value={'Meldekort'}>
                        <MeldekortTab></MeldekortTab>
                    </Tabs.Panel>
                    <Tabs.Panel value={'Utbetaling'}>Utbetaling</Tabs.Panel>
                </Tabs>
            </div>
            <div className={styles.historikkColumn}>
                <span>
                    {' '}
                    <ChevronRightIcon /> &nbsp; Historikk{' '}
                </span>
            </div>
        </div>
    );
};

export default BehandlingTabs;
