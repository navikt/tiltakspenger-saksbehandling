import {Alert, Button, DatePicker, Radio, RadioGroup, Select, useRangeDatepicker} from "@navikt/ds-react";
import {AccordionItem} from "../vilkår-accordions/Accordion";
import {SaksopplysningTable} from "../vilkår-accordions/SaksopplysningTable";
import {SøknadLayout} from "../../layouts/soker/SøknadLayout";
import React, {useState} from "react";
import {Saksopplysning, SaksopplysningInnDTO} from "../../types/NyBehandling";

interface InngangsvilkårTabProps {
    saksopplysninger: SaksopplysningInnDTO[];
}


export const InngangsvilkårTab = ({saksopplysninger}: InngangsvilkårTabProps) => {
    const [åpneRedigering, onÅpneRedigering] = useState<boolean>(false);

    const handleChange = (val: any) => console.log(val);
    const {datepickerProps, toInputProps, fromInputProps, selectedRange} = useRangeDatepicker({
        fromDate: new Date('Sep 12 2023'),
        onRangeChange: console.log,
    });

    return (
        <SøknadLayout>
            <Alert variant="info">Det er noe greier her</Alert>
            <div style={{padding: '1em'}}/>
            {saksopplysninger.map(saksopplysning => {
                return (
                    <>
                        <AccordionItem title={saksopplysning.vilkårTittel}>
                            <SaksopplysningTable
                                utfall={saksopplysning.utfall}
                                fom={saksopplysning.fom}
                                tom={saksopplysning.tom}
                                kilde={saksopplysning.kilde}
                                detaljer={saksopplysning.detaljer}
                                fakta={saksopplysning.fakta}
                                håndterStartRedigering={onÅpneRedigering}
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
                                    <div style={{padding: '1rem'}}/>

                                    <div
                                        style={{
                                            gap: '1rem',
                                            paddingBottom: '0.5rem',
                                        }}
                                    >
                                        <DatePicker {...datepickerProps}>
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                <DatePicker.Input {...fromInputProps} label="Fra"/>
                                                <div style={{padding: '1rem'}}/>
                                                <DatePicker.Input {...toInputProps} label="Til"/>
                                            </div>
                                        </DatePicker>
                                    </div>
                                    <div style={{padding: '0.5rem'}}/>
                                    <Select label="Begrunnelse for endring" style={{width: '415px'}}>
                                        <option value="">Velg grunn</option>
                                        <option value="Bruker møtte ikke opp">Bruker møtte ikke opp</option>
                                        <option value="Bruker vil ikke ha penger">Bruker vil ikke ha penger</option>
                                    </Select>
                                    <div style={{padding: '1rem'}}/>
                                    <div>
                                        <Button
                                            onClick={() => onÅpneRedigering(false)}
                                            variant="tertiary"
                                            style={{marginRight: '2rem'}}
                                        >
                                            Avbryt
                                        </Button>
                                        <Button>Lagre endring</Button>
                                    </div>
                                </div>
                            )}
                        </AccordionItem>
                        <div style={{marginTop: '0.5rem'}}/>
                    </>
                )
            })}


        </SøknadLayout>
    )
}