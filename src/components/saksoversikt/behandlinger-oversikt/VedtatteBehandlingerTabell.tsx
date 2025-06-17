import { ActionMenu, Button, Table } from '@navikt/ds-react';
import { behandlingResultatTilTag, finnBehandlingstypeTekst } from '~/utils/tekstformateringUtils';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '~/utils/date';
import { BehandlingResultat, Behandlingstype } from '~/types/BehandlingTypes';
import Link from 'next/link';
import { ChevronDownIcon, FileIcon } from '@navikt/aksel-icons';
import ActionMenuItemBehandleSøknadPåNytt from '~/components/behandlingsknapper/behandle-søknad-på-nytt/ActionMenuItemBehandleSøknadPåNytt';
import { VedtattBehandlingDataCellInfo } from '~/components/saksoversikt/behandlinger-oversikt/VedtatteBehandlingerUtils';

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
                        <Table.DataCell style={{ display: 'flex', justifyContent: 'center' }}>
                            {(vedtattBehandling.behandlingstype ===
                                Behandlingstype.SØKNADSBEHANDLING ||
                                vedtattBehandling.behandlingstype ===
                                    Behandlingstype.REVURDERING) && (
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.5rem',
                                    }}
                                >
                                    <ActionMenu>
                                        <ActionMenu.Trigger>
                                            <Button
                                                variant="secondary-neutral"
                                                icon={<ChevronDownIcon aria-hidden />}
                                                iconPosition="right"
                                            >
                                                Velg
                                            </Button>
                                        </ActionMenu.Trigger>
                                        <ActionMenu.Content>
                                            <ActionMenu.Item
                                                as={Link}
                                                href={`/behandling/${vedtattBehandling.id}`}
                                                icon={<FileIcon aria-hidden />}
                                            >
                                                Se behandling
                                            </ActionMenu.Item>

                                            {vedtattBehandling.resultat ===
                                                BehandlingResultat.AVSLAG && (
                                                <ActionMenuItemBehandleSøknadPåNytt
                                                    sakId={vedtattBehandling.sakId}
                                                    søknadId={vedtattBehandling.søknadId}
                                                />
                                            )}
                                        </ActionMenu.Content>
                                    </ActionMenu>
                                </div>
                            )}
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};
