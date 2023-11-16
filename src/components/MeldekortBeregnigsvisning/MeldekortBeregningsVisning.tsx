import { CheckmarkCircleFillIcon, ExclamationmarkTriangleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Heading, Table } from '@navikt/ds-react';

export const MeldekortBeregningsvisning = () => {
    return (
        <Table>
            <Table.Row>
                <Table.HeaderCell scope="col">Beregning</Table.HeaderCell>
                <Table.HeaderCell scope="col"></Table.HeaderCell>
                <Table.HeaderCell scope="col"></Table.HeaderCell>
            </Table.Row>
            <Table.Row>
                <Table.DataCell>
                    <BodyShort style={{ marginBottom: '0.5rem' }}>
                        <>
                            <CheckmarkCircleFillIcon
                                style={{ color: 'green', alignSelf: 'center', marginRight: '0.5rem' }}
                            />
                            Deltatt i tiltak
                        </>
                    </BodyShort>
                    <BodyShort style={{ marginBottom: '0.5rem' }}>
                        <>
                            <XMarkOctagonFillIcon
                                style={{ color: 'red', alignSelf: 'center', marginRight: '0.5rem' }}
                            />
                            Ikke deltatt i tiltak
                        </>
                    </BodyShort>

                    <BodyShort style={{ marginBottom: '0.5rem' }}>
                        <>
                            <ExclamationmarkTriangleFillIcon
                                style={{ color: 'orange', alignSelf: 'center', marginRight: '0.5rem' }}
                            />
                            Fravær - Syk
                        </>
                    </BodyShort>

                    <BodyShort style={{ marginBottom: '0.5rem' }}>
                        <>
                            <ExclamationmarkTriangleFillIcon
                                style={{ color: 'orange', alignSelf: 'center', marginRight: '0.5rem' }}
                            />
                            Fravær - Sykt barn
                        </>
                    </BodyShort>

                    <BodyShort style={{ marginBottom: '0.5rem' }}>
                        <>
                            <ExclamationmarkTriangleFillIcon
                                style={{
                                    color: 'orange',
                                    marginRight: '0.5rem',
                                }}
                            />
                            Fravær - Velfærd
                        </>
                    </BodyShort>

                    <BodyShort style={{ marginBottom: '0.5rem' }}>Antall dager med 75% utbetaling</BodyShort>
                    <BodyShort style={{ marginBottom: '0.5rem' }}>Antall dager med 100% utbetaling</BodyShort>
                </Table.DataCell>
                <Table.DataCell>
                    <BodyShort style={{ marginBottom: '0.5rem' }}>5</BodyShort>
                    <BodyShort style={{ marginBottom: '0.5rem' }}>0</BodyShort>
                    <BodyShort style={{ marginBottom: '0.5rem' }}>0</BodyShort>
                    <BodyShort style={{ marginBottom: '0.5rem' }}>6</BodyShort>
                    <BodyShort style={{ marginBottom: '0.5rem' }}>0</BodyShort>
                    <BodyShort style={{ marginBottom: '0.5rem' }}>2</BodyShort>
                    <BodyShort style={{ marginBottom: '0.5rem' }}>2</BodyShort>
                </Table.DataCell>
                <Table.DataCell align="right">
                    <div>
                        <BodyShort style={{ marginBottom: '0.5rem' }}>&nbsp;</BodyShort>
                        <BodyShort style={{ marginBottom: '0.5rem' }}>&nbsp;</BodyShort>
                        <BodyShort style={{ marginBottom: '0.5rem' }}>&nbsp;</BodyShort>
                        <BodyShort style={{ marginBottom: '0.5rem' }}>&nbsp;</BodyShort>
                        <BodyShort style={{ marginBottom: '0.5rem' }}>&nbsp;</BodyShort>
                        <BodyShort style={{ marginBottom: '0.5rem' }}>405,-</BodyShort>
                        <BodyShort style={{ marginBottom: '0.5rem' }}>2144,-</BodyShort>
                    </div>
                </Table.DataCell>
            </Table.Row>
            <Table.Row>
                <Table.HeaderCell>Beløp til utbetaling</Table.HeaderCell>
                <Table.DataCell />
                <Table.DataCell align="right">
                    <BodyShort>2569,-</BodyShort>
                </Table.DataCell>
            </Table.Row>
        </Table>
    );
};
