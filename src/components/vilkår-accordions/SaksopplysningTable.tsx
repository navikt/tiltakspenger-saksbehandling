import { BodyShort, Button, DatePicker, Radio, RadioGroup, Select, Table, useRangeDatepicker } from '@navikt/ds-react';
import { UtfallIcon } from '../utfall-icon/UtfallIcon';
import React, { useState } from 'react';
import { PencilIcon } from '@navikt/aksel-icons';

interface SaksopplysningProps {
    utfall: string;
    fom: string;
    tom: string;
    // vilkår: string; // Vilkår inneholder lovverk: String, val paragraf: String, val ledd: String?, val beskrivelse:
    kilde: string;
    detaljer: string;
    fakta: string;
}

export const SaksopplysningTable = ({ utfall, fom, tom, kilde, detaljer, fakta }: SaksopplysningProps) => {
    const [åpneRedigering, onÅpneRedigering] = useState<boolean>(false);
    const handleChange = (val: any) => console.log(val);

    const { datepickerProps, toInputProps, fromInputProps, selectedRange } = useRangeDatepicker({
        fromDate: new Date('Sep 12 2023'),
        onRangeChange: console.log,
    });
    return (
        <>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell></Table.HeaderCell>
                        <Table.HeaderCell>Registrering</Table.HeaderCell>
                        <Table.HeaderCell>Periode</Table.HeaderCell>
                        <Table.HeaderCell>Kilde</Table.HeaderCell>
                        <Table.HeaderCell>Detaljer</Table.HeaderCell>
                        <Table.HeaderCell />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Table.Row>
                        <Table.DataCell>
                            {
                                <div style={{ display: 'flex' }}>
                                    <UtfallIcon utfall={utfall} />
                                </div>
                            }
                        </Table.DataCell>
                        <Table.DataCell>
                            {
                                <div style={{ display: 'flex' }}>
                                    <BodyShort>{fakta}</BodyShort>
                                </div>
                            }
                        </Table.DataCell>
                        <Table.DataCell>
                            <BodyShort>{fom && tom ? `${fom} - ${tom}` : '-'}</BodyShort>
                        </Table.DataCell>
                        <Table.DataCell>
                            <BodyShort>{kilde ? kilde : '-'}</BodyShort>
                        </Table.DataCell>
                        <Table.DataCell>
                            <BodyShort>{detaljer ? detaljer : '-'}</BodyShort>
                        </Table.DataCell>
                        <Table.DataCell>
                            <Button
                                onClick={() => onÅpneRedigering(!åpneRedigering)}
                                variant="tertiary"
                                iconPosition="left"
                                icon={<PencilIcon />}
                                aria-label="hidden"
                            />
                        </Table.DataCell>
                    </Table.Row>
                </Table.Body>
            </Table>
            <>
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
            </>
        </>
    );
};
