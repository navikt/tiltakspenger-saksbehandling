import { ActionMenu, Button, Table } from '@navikt/ds-react';
import { behandlingResultatTilTag, finnBehandlingstypeTekst } from '~/utils/tekstformateringUtils';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '~/utils/date';

import { ArrowsCirclepathIcon, ChevronDownIcon, MagnifyingGlassIcon } from '@navikt/aksel-icons';
import MenyValgBehandleSøknadPåNytt from '~/components/behandlingmeny/menyvalg/MenyValgBehandleSøknadPåNytt';
import { VedtattBehandlingCellInfo } from '~/components/saksoversikt/behandlinger-oversikt/VedtatteBehandlingerUtils';
import SeBehandlingMenyvalg from '~/components/behandlingmeny/menyvalg/SeBehandlingMenyvalg';
import React from 'react';
import Link from 'next/link';
import { behandlingUrl } from '~/utils/urls';
import { BehandlingResultat } from '~/types/Behandling';

export const VedtatteBehandlingerTabell = (props: {
    vedtatteBehandlinger: VedtattBehandlingCellInfo[];
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
                            {vedtattBehandling.resultat === BehandlingResultat.AVSLAG ? (
                                <ActionMenu>
                                    <ActionMenu.Trigger>
                                        <Button
                                            variant="secondary"
                                            iconPosition="right"
                                            icon={<ChevronDownIcon title="Menyvalg" />}
                                            size="small"
                                        >
                                            Velg
                                        </Button>
                                    </ActionMenu.Trigger>
                                    <ActionMenu.Content>
                                        <>
                                            {vedtattBehandling.søknadId && (
                                                <>
                                                    <MenyValgBehandleSøknadPåNytt
                                                        sakId={vedtattBehandling.sakId}
                                                        søknadId={vedtattBehandling.søknadId}
                                                    />
                                                    <ActionMenu.Divider />
                                                </>
                                            )}
                                            <SeBehandlingMenyvalg
                                                behandlingHref={behandlingUrl(vedtattBehandling)}
                                            />
                                        </>
                                    </ActionMenu.Content>
                                </ActionMenu>
                            ) : (
                                <ActionMenu>
                                    <ActionMenu.Trigger>
                                        <Button
                                            variant="secondary"
                                            iconPosition="right"
                                            icon={<ChevronDownIcon title="Menyvalg" />}
                                            size="small"
                                        >
                                            Velg
                                        </Button>
                                    </ActionMenu.Trigger>
                                    <ActionMenu.Content>
                                        <ActionMenu.Item
                                            as={Link}
                                            href={behandlingUrl(vedtattBehandling)}
                                            icon={<MagnifyingGlassIcon aria-hidden />}
                                        >
                                            Se behandling
                                        </ActionMenu.Item>
                                        <ActionMenu.Item
                                            onClick={() => {}}
                                            icon={<ArrowsCirclepathIcon aria-hidden />}
                                        >
                                            Omgjør
                                        </ActionMenu.Item>
                                    </ActionMenu.Content>
                                </ActionMenu>
                            )}
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};
