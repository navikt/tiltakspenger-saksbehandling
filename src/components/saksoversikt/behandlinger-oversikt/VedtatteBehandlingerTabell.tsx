import { ActionMenu, Button, Table } from '@navikt/ds-react';
import { behandlingResultatTilTag, finnBehandlingstypeTekst } from '~/utils/tekstformateringUtils';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '~/utils/date';
import { BehandlingResultat, Behandlingstype } from '~/types/BehandlingTypes';
import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import MenyValgBehandleSøknadPNytt from '~/components/behandlingmeny/menyvalg/MenyValgBehandleSøknadPåNytt';
import { VedtattBehandlingDataCellInfo } from '~/components/saksoversikt/behandlinger-oversikt/VedtatteBehandlingerUtils';
import SeBehandlingMenyvalg from '~/components/behandlingmeny/menyvalg/SeBehandlingMenyvalg';
import React from 'react';
import Link from 'next/link';

export const VedtatteBehandlingerTabell = (props: {
    vedtatteBehandlinger: VedtattBehandlingDataCellInfo[];
}) => {
    if (props.vedtatteBehandlinger.length === 0) {
        return null;
    }

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Behandlingstype</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Resultat</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Tidspunkt iverksatt</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Behandlingsperiode</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Beslutter</Table.HeaderCell>
                    <Table.HeaderCell scope="col"></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {props.vedtatteBehandlinger.map((vedtattBehandling, idx) => (
                    <Table.Row
                        shadeOnHover={false}
                        key={`${vedtattBehandling.tidspunktAvsluttet}-${idx}`}
                    >
                        <Table.DataCell>
                            {finnBehandlingstypeTekst[vedtattBehandling.behandlingstype]}
                        </Table.DataCell>
                        <Table.DataCell>
                            {vedtattBehandling.resultat
                                ? behandlingResultatTilTag[vedtattBehandling.resultat]
                                : '-'}
                        </Table.DataCell>
                        <Table.DataCell>
                            {formaterTidspunkt(vedtattBehandling.tidspunktAvsluttet)}
                        </Table.DataCell>
                        <Table.DataCell>
                            {vedtattBehandling.behandlingsperiode
                                ? periodeTilFormatertDatotekst(vedtattBehandling.behandlingsperiode)
                                : 'Ingen periode'}
                        </Table.DataCell>

                        <Table.DataCell>
                            {vedtattBehandling.saksbehandler ?? 'Ikke tildelt'}
                        </Table.DataCell>
                        <Table.DataCell>
                            {vedtattBehandling.beslutter ?? 'Ikke tildelt'}
                        </Table.DataCell>
                        <Table.DataCell align={'right'}>
                            {(vedtattBehandling.behandlingstype ===
                                Behandlingstype.SØKNADSBEHANDLING ||
                                vedtattBehandling.behandlingstype ===
                                    Behandlingstype.REVURDERING) &&
                            vedtattBehandling.resultat === BehandlingResultat.AVSLAG ? (
                                <>
                                    {vedtattBehandling.resultat === BehandlingResultat.AVSLAG && (
                                        <ActionMenu>
                                            <ActionMenu.Trigger>
                                                <Button
                                                    variant="tertiary-neutral"
                                                    icon={
                                                        <MenuElipsisVerticalIcon title="Menyvalg" />
                                                    }
                                                    size="small"
                                                />
                                            </ActionMenu.Trigger>
                                            <ActionMenu.Content>
                                                <>
                                                    <SeBehandlingMenyvalg
                                                        behandlingHref={`/behandling/${vedtattBehandling.id}`}
                                                    />
                                                    <MenyValgBehandleSøknadPNytt
                                                        sakId={vedtattBehandling.sakId}
                                                        søknadId={vedtattBehandling.søknadId}
                                                    />
                                                </>
                                            </ActionMenu.Content>
                                        </ActionMenu>
                                    )}
                                </>
                            ) : (
                                <Button
                                    variant={'secondary'}
                                    as={Link}
                                    href={`/behandling/${vedtattBehandling.id}`}
                                    size={'small'}
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
