import VilkårsvurderingDetails from '../vilkårsvurdering-details/VilkårsvurderingDetails';
import React, { useState } from 'react';
import {
    Alert,
    BodyShort,
    Button, DatePicker,
    Heading,
    Radio,
    RadioGroup,
    Select,
    Tabs,
    UNSAFE_Combobox,
    useRangeDatepicker
} from '@navikt/ds-react';
import { FileContent } from '@navikt/ds-icons';
import { useSetAtom } from 'jotai';
import Søknad from '../../types/Søknad';
import { formatDate } from '../../utils/date';
import { søknadIdAtom } from '../../pages/soker/[...all]';
import { Behandling } from '../../types/Behandling';
import Personalia from '../../types/Personalia';
import styles from './SøknadTabs.module.css';
import { SøknadLayout } from '../../layouts/soker/SøknadLayout';
import { SaksopplysningTable } from '../vilkår-accordions/SaksopplysningTable';
import { Accordion, AccordionItem } from '../vilkår-accordions/Accordion';
import format from 'date-fns/format';
import nbLocale from 'date-fns/locale/nb';

interface SøknadTabsProps {
    className?: string;
    defaultTab: string;
    onChange: (søknadId: string) => void;
    behandlinger: Behandling[];
    søkerId: string;
    personalia: Personalia;
}

function createSøknadLabel({ startdato, arrangoernavn, tiltakskode }: Søknad) {
    const arrangørNavnEllerTiltakskode = arrangoernavn || tiltakskode;
    if (startdato) {
        return `${arrangørNavnEllerTiltakskode} (${formatDate(startdato)})`;
    }
    return arrangørNavnEllerTiltakskode;
}

const SøknadTabs = ({ defaultTab, onChange, behandlinger, personalia, søkerId }: SøknadTabsProps) => {
    const setSøknadId = useSetAtom(søknadIdAtom);
    const [åpneRedigering, onÅpneRedigering] = useState<boolean>(false);

    const handleChange = (val: any) => console.log(val);
    const { datepickerProps, toInputProps, fromInputProps, selectedRange } = useRangeDatepicker({
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
                    icon={<FileContent />}
                    onClick={() => {}}
                />
                <Tabs.Tab
                    key={'Meldekort'}
                    value={'Meldekort'}
                    label={'Meldekort'}
                    icon={<FileContent />}
                    onClick={() => {}}
                />

                <Tabs.Tab
                    key={'Utbetaling'}
                    value={'Utbetaling'}
                    label={'Utbetaling'}
                    icon={<FileContent />}
                    onClick={() => {}}
                />

                <Tabs.Tab key={'Brev'} value={'Brev'} label={'Brev'} icon={<FileContent />} onClick={() => {}} />
            </Tabs.List>
            {behandlinger.map((behandling) => {
                const { klarForBehandling } = behandling;
                return (
                    <Tabs.Panel key={behandling.søknad.id} value={behandling.søknad.id}>
                        <SøknadLayout>
                            <Alert variant="info">Det er noe greier her</Alert>
                            <div style={{ padding: '1em' }} />
                            <AccordionItem title="§ et vilkår">
                                <SaksopplysningTable
                                    vilkårsVurdering={false}
                                    fom={''}
                                    tom={''}
                                    kilde={''}
                                    detaljer={''}
                                    handleStartRedigering={onÅpneRedigering}
                                />
                                {åpneRedigering && (
                                    <div
                                        style={{
                                            background: '#F2F3F5',
                                            width: '100%',
                                            height: '100%',
                                            padding: '1rem',
                                        }}
                                    >
                                        <RadioGroup legend="Endre vilkår" onChange={(val: string) => handleChange(val)}>
                                            <Radio value="Deltar ikke">Deltar ikke</Radio>
                                            <Radio value="Deltar">Deltar</Radio>
                                        </RadioGroup>
                                        <div style={{ padding: '1rem' }} />

                                        <div
                                            style={{
                                                gap: '1rem',
                                                paddingBottom: '0.5rem',
                                            }}
                                        >
                                            <DatePicker {...datepickerProps}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <DatePicker.Input {...fromInputProps} label="Fra" />
                                                    <div style={{ padding: '1rem' }} />
                                                    <DatePicker.Input {...toInputProps} label="Til" />
                                                </div>
                                            </DatePicker>
                                        </div>
                                        <div style={{ padding: '0.5rem' }} />
                                        <Select label="Begrunnelse for endring" style={{ width: '415px' }}>
                                            <option value="">Velg grunn</option>
                                            <option value="Bruker møtte ikke opp">Bruker møtte ikke opp</option>
                                            <option value="Bruker vil ikke ha penger">Bruker vil ikke ha penger</option>
                                        </Select>
                                        <div style={{ padding: '1rem' }} />
                                        <div>
                                            <Button
                                                onClick={() => onÅpneRedigering(false)}
                                                variant="tertiary"
                                                style={{ marginRight: '2rem' }}
                                            >
                                                Avbryt
                                            </Button>
                                            <Button>Lagre endring</Button>
                                        </div>
                                    </div>
                                )}
                            </AccordionItem>
                            <div style={{ padding: '1rem' }} />
                            <AccordionItem title="§ et vilkår">
                                <SaksopplysningTable
                                    vilkårsVurdering={false}
                                    fom={''}
                                    tom={''}
                                    kilde={''}
                                    detaljer={''}
                                />
                            </AccordionItem>
                            <div style={{ padding: '1rem' }} />

                            <AccordionItem title="§ et vilkår">
                                <SaksopplysningTable
                                    vilkårsVurdering={false}
                                    fom={''}
                                    tom={''}
                                    kilde={''}
                                    detaljer={''}
                                />
                            </AccordionItem>
                        </SøknadLayout>
                    </Tabs.Panel>
                );
            })}
        </Tabs>
    );
};

export default SøknadTabs;
