import { BodyShort, Button, DatePicker, Radio, RadioGroup, Select, Table, useRangeDatepicker } from '@navikt/ds-react';
import { UtfallIcon } from '../utfall-icon/UtfallIcon';
import React, { useState } from 'react';
import { PencilIcon } from '@navikt/aksel-icons';

interface SaksopplysningProps {
    vilkår: string;
    utfall: string;
    fom: string;
    tom: string;
    // vilkår: string; // Vilkår inneholder lovverk: String, val paragraf: String, val ledd: String?, val beskrivelse:
    kilde: string;
    detaljer: string;
    fakta: string;
}

const basepath = process.env.TILTAKSPENGER_VEDTAK_URL || '';

export const SaksopplysningTable = ({ vilkår, utfall, fom, tom, kilde, detaljer, fakta }: SaksopplysningProps) => {
    const [åpneRedigering, onÅpneRedigering] = useState<boolean>(false);
    const [valgtFom, setFom] = useState<Date>();
    const [valgtTom, setTom] = useState<Date>();
    const [harYtelse, setHarYtelse] = useState<boolean>();
    const [begrunnelse, setBegrunnelse] = useState<string>("");
    const handleChange = (val: any) => console.log(val);

    const behandlingid = 'beh_01H27W28VJSRPR1ESE5ASR04N8';


    const håndterLagreSaksopplysning = async () => {
        //fetch(`${basepath}/api/behandling/${behandlingid}`, {})
        const res = fetch(`/api/behandling/${behandlingid}`, {
            method: 'POST',
            body: JSON.stringify({
                fom: valgtFom?.toISOString().split('T')[0],
                tom: valgtTom?.toISOString().split('T')[0],
                vilkår: vilkår,
                begrunnelse: begrunnelse,
                harYtelse: harYtelse,
            }),
        });
    }

    const { datepickerProps, toInputProps, fromInputProps, selectedRange } = useRangeDatepicker({
        fromDate: new Date('Sep 12 2023'),
        onRangeChange: (range) => {
            if ( range ) {
                setFom(range.from);
                setTom(range.to);
            }
        }
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
                        <RadioGroup legend="Endre vilkår" onChange={(value: boolean) => setHarYtelse(value)}>
                            <Radio value={false}>Deltar ikke</Radio>
                            <Radio value={true}>Deltar</Radio>
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
                        <Select label="Begrunnelse for endring" style={{ width: '415px' }}
                                onChange={(e) => setBegrunnelse(e.target.value)}
                        >
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
                            <Button onClick={ () => håndterLagreSaksopplysning()}
                            >Lagre endring</Button>
                        </div>
                    </div>
                )}
            </>
        </>
    );
};
