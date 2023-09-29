import React, {useState} from 'react';
import {
    Tabs,
    useRangeDatepicker
} from '@navikt/ds-react';
import {FileContent} from '@navikt/ds-icons';
import styles from './SøknadTabs.module.css';
import {NyBehandling} from "../../types/NyBehandling";
import {BankNoteIcon, CardIcon, EnvelopeClosedIcon, MonitorIcon, ParagraphIcon} from "@navikt/aksel-icons";
import {InngangsvilkårTab} from "./InngangsvilkårTab";

interface SøknadTabsProps {
    className?: string;
    defaultTab: string;
    onChange: (søknadId: string) => void;
    behandling: NyBehandling;
}

const BehandlingTabs = ({defaultTab, onChange, behandling}: SøknadTabsProps) => {
    const [åpneRedigering, onÅpneRedigering] = useState<boolean>(false);

    const handleChange = (val: any) => console.log(val);
    const {datepickerProps, toInputProps, fromInputProps, selectedRange} = useRangeDatepicker({
        fromDate: new Date('Sep 12 2023'),
        onRangeChange: console.log,
    });

    const initialOptions = ['Bruker møtte ikke opp', 'Bruker vil ikke ha penger'];

    return (
        <Tabs defaultValue={defaultTab} className={styles.søknadTabs}>
            <Tabs.List>
                <Tabs.Tab
                    key={'Inngangsvilkår'}
                    value={'Inngangsvilkår'}
                    label={'Inngangsvilkår'}
                    icon={<FileContent/>}
                    onClick={() => {
                    }}
                />
                <Tabs.Tab
                    key={'Meldekort'}
                    value={'Meldekort'}
                    label={'Meldekort'}
                    icon={<CardIcon/>}
                    onClick={() => {
                    }}
                />

                <Tabs.Tab
                    key={'Utbetaling'}
                    value={'Utbetaling'}
                    label={'Utbetaling'}
                    icon={<BankNoteIcon/>}
                    onClick={() => {
                    }}
                />
                <Tabs.Tab key={'Brev'} value={'Brev'} label={'Brev'} icon={<EnvelopeClosedIcon/>} onClick={() => {
                }}/>
                <Tabs.Tab key={'Klage'} value={'Klage'} label={'Klage'} icon={<ParagraphIcon/>} onClick={() => {
                }}/>
            </Tabs.List>
            <Tabs.Panel value={'Inngangsvilkår'}>
                <InngangsvilkårTab
                    saksopplysninger={behandling.saksopplysninger}
                />
            </Tabs.Panel>
            <Tabs.Panel value={'Meldekort'}>
                Meldekort
            </Tabs.Panel>
            <Tabs.Panel value={'Utbetaling'}>
                Utbetaling
            </Tabs.Panel>
            <Tabs.Panel value={'Brev'}>
                Brev
            </Tabs.Panel>
            <Tabs.Panel value={'Klage'}>
                Klage
            </Tabs.Panel>
        </Tabs>
    );
};

export default BehandlingTabs;
