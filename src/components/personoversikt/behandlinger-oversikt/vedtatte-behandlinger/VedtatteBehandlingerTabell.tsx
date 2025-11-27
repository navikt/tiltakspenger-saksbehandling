import { ActionMenu, Button, HStack, Table } from '@navikt/ds-react';
import { behandlingResultatTilTag, finnBehandlingstypeTekst } from '~/utils/tekstformateringUtils';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '~/utils/date';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import MenyValgBehandleSøknadPåNytt from '~/components/behandlingmeny/menyvalg/MenyValgBehandleSøknadPåNytt';
import SeBehandlingMenyvalg from '~/components/behandlingmeny/menyvalg/SeBehandlingMenyvalg';
import React from 'react';
import { behandlingUrl } from '~/utils/urls';
import { SakId } from '~/types/Sak';
import { SøknadsbehandlingResultat } from '~/types/Søknadsbehandling';
import { RammevedtakMedBehandling } from '~/types/Rammevedtak';
import { OmgjørVedtakMenyvalg } from '~/components/personoversikt/behandlinger-oversikt/vedtatte-behandlinger/OmgjørVedtakMenyvalg';

type Props = {
    sakId: SakId;
    rammevedtakMedBehandlinger: RammevedtakMedBehandling[];
};

export const VedtatteBehandlingerTabell = ({ sakId, rammevedtakMedBehandlinger }: Props) => {
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Behandlingstype</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Resultat</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Tidspunkt iverksatt</Table.HeaderCell>
                    <Table.HeaderCell scope="col">
                        Opprinnelig innvilgelsesperiode(r)
                    </Table.HeaderCell>
                    <Table.HeaderCell scope="col">
                        Gjeldende innvilgelsesperiode(r)
                    </Table.HeaderCell>
                    <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Beslutter</Table.HeaderCell>
                    <Table.HeaderCell scope="col"></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {rammevedtakMedBehandlinger.map((vedtak) => {
                    const {
                        id,
                        behandling,
                        opprinneligInnvilgetPerioder,
                        gjeldendeInnvilgetPerioder,
                        opprettet,
                    } = vedtak;
                    const { type, resultat } = behandling;

                    return (
                        <Table.Row shadeOnHover={false} key={id}>
                            <Table.DataCell>{finnBehandlingstypeTekst[type]}</Table.DataCell>
                            <Table.DataCell>{behandlingResultatTilTag[resultat]}</Table.DataCell>
                            <Table.DataCell>{formaterTidspunkt(opprettet)}</Table.DataCell>
                            <Table.DataCell>
                                <HStack gap="2">
                                    {opprinneligInnvilgetPerioder.map((periode, index) => (
                                        <span key={index}>
                                            {periodeTilFormatertDatotekst(periode)}
                                        </span>
                                    ))}
                                </HStack>
                            </Table.DataCell>
                            <Table.DataCell>
                                <HStack gap="2">
                                    {gjeldendeInnvilgetPerioder.map((periode, index) => (
                                        <span key={index}>
                                            {periodeTilFormatertDatotekst(periode)}
                                        </span>
                                    ))}
                                </HStack>
                            </Table.DataCell>
                            <Table.DataCell>{vedtak.saksbehandler}</Table.DataCell>
                            <Table.DataCell>{vedtak.beslutter}</Table.DataCell>
                            <Table.DataCell align={'right'}>
                                <ActionMenu>
                                    <ActionMenu.Trigger>
                                        <Button
                                            variant="secondary"
                                            iconPosition="right"
                                            icon={<ChevronDownIcon title="Menyvalg" />}
                                            size="small"
                                        >
                                            {'Velg'}
                                        </Button>
                                    </ActionMenu.Trigger>
                                    <ActionMenu.Content>
                                        {resultat === SøknadsbehandlingResultat.AVSLAG ? (
                                            <MenyValgBehandleSøknadPåNytt
                                                sakId={sakId}
                                                søknadId={behandling.søknad.id}
                                            />
                                        ) : (
                                            <OmgjørVedtakMenyvalg vedtak={vedtak} sakId={sakId} />
                                        )}
                                        <ActionMenu.Divider />
                                        <SeBehandlingMenyvalg
                                            behandlingHref={behandlingUrl(behandling)}
                                        />
                                    </ActionMenu.Content>
                                </ActionMenu>
                            </Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    );
};
