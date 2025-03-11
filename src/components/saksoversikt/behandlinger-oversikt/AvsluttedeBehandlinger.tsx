import { Box, Button, Heading, Link, Table } from '@navikt/ds-react';

import { finnBehandlingstypeTekst } from '../../../utils/tekstformateringUtils';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '../../../utils/date';

import styles from '../Saksoversikt.module.css';
import {
    avsluttetBehandlingToDataCellInfo,
    avbruttSøknadToDataCellInfo,
    AvsluttetBehandlingDataCellInfo,
} from './AvsluttedeBehandlingerUtils';
import { SøknadForBehandlingProps } from '../../../types/SøknadTypes';
import { BehandlingData, Behandlingstype } from '../../../types/BehandlingTypes';
import {
    erBehandlingAbrutt as erBehandlingAvbrutt,
    erBehandlingFørstegangsbehandling,
    erBehandlingVedtatt,
} from '../../../utils/behandling';
import { erSøknadAvbrutt } from '../../../utils/SøknadUtils';

export const AvsluttedeBehandlinger = (props: {
    søknader: SøknadForBehandlingProps[];
    behandlinger: BehandlingData[];
}) => {
    const avsluttedeBehandlinger = props.behandlinger.filter(
        (b) => erBehandlingAvbrutt(b) || erBehandlingVedtatt(b),
    );
    const avbrutteSøknader = props.søknader
        .filter(erSøknadAvbrutt)
        .filter(
            (søknad) =>
                avsluttedeBehandlinger.find(
                    (behandling) =>
                        erBehandlingFørstegangsbehandling(behandling) &&
                        behandling.søknad.id === søknad.id,
                ) === undefined,
        );

    const avsluttedeBehandlingerInfo = avsluttedeBehandlinger.map(
        avsluttetBehandlingToDataCellInfo,
    );
    const avbrutteSøknaderInfo = avbrutteSøknader.map(avbruttSøknadToDataCellInfo);

    const avsluttede = [...avsluttedeBehandlingerInfo, ...avbrutteSøknaderInfo].toSorted((a, b) =>
        a.tidspunktAvsluttet.localeCompare(b.tidspunktAvsluttet),
    );

    const vedtatte = avsluttede.filter((avsluttet) => avsluttet.avsluttetPga === 'ferdigBehandlet');
    const avbrutte = avsluttede.filter((avsluttet) => avsluttet.avsluttetPga === 'avbrutt');

    return (
        <>
            {vedtatte.length > 0 && (
                <Box className={styles.tabellwrapper}>
                    <Heading level="3" size="small">
                        Vedtatte behandlinger
                    </Heading>
                    <VedtatteBehandlingerTabell avsluttede={vedtatte} />
                </Box>
            )}
            {avbrutte.length > 0 && (
                <Box className={styles.tabellwrapper}>
                    <Heading level="3" size="small">
                        Avsluttede behandlinger
                    </Heading>
                    <AvsluttedeBehandlingerTabell avsluttede={avbrutte} />
                </Box>
            )}
        </>
    );
};

export const VedtatteBehandlingerTabell = (props: {
    avsluttede: AvsluttetBehandlingDataCellInfo[];
}) => {
    if (props.avsluttede.length === 0) {
        return null;
    }

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Behandlingstype</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Tidspunkt iverksatt</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Behandlingsperiode</Table.HeaderCell>
                    <Table.HeaderCell scope="col"></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {props.avsluttede.map((avsluttet, idx) => (
                    <Table.Row shadeOnHover={false} key={`${avsluttet.tidspunktAvsluttet}-${idx}`}>
                        <Table.DataCell>
                            {finnBehandlingstypeTekst[avsluttet.behandlingstype]}
                        </Table.DataCell>
                        <Table.DataCell>
                            {formaterTidspunkt(avsluttet.tidspunktAvsluttet)}
                        </Table.DataCell>
                        <Table.DataCell>
                            {avsluttet.behandlingsperiode
                                ? periodeTilFormatertDatotekst(avsluttet.behandlingsperiode)
                                : 'Ingen periode'}
                        </Table.DataCell>
                        <Table.DataCell>
                            {(avsluttet.behandlingstype === Behandlingstype.FØRSTEGANGSBEHANDLING ||
                                avsluttet.behandlingstype === Behandlingstype.REVURDERING) && (
                                <Button
                                    style={{ minWidth: '50%' }}
                                    size="small"
                                    variant={'secondary'}
                                    as={Link}
                                    href={`/behandling/${avsluttet.id}`}
                                >
                                    Se behandling
                                </Button>
                            )}
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

export const AvsluttedeBehandlingerTabell = (props: {
    avsluttede: AvsluttetBehandlingDataCellInfo[];
}) => {
    if (props.avsluttede.length === 0) {
        return null;
    }

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Behandlingstype</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Tidspunkt avsluttet</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Behandlingsperiode</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {props.avsluttede.map((avsluttet, idx) => (
                    <Table.Row shadeOnHover={false} key={`${avsluttet.tidspunktAvsluttet}-${idx}`}>
                        <Table.DataCell>
                            {finnBehandlingstypeTekst[avsluttet.behandlingstype]}
                        </Table.DataCell>
                        <Table.DataCell>
                            {formaterTidspunkt(avsluttet.tidspunktAvsluttet)}
                        </Table.DataCell>
                        <Table.DataCell>
                            {avsluttet.behandlingsperiode
                                ? periodeTilFormatertDatotekst(avsluttet.behandlingsperiode)
                                : 'Ingen periode'}
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};
