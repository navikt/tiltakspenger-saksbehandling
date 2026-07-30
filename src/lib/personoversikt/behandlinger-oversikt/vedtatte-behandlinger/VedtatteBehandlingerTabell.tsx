import { ActionMenu, Button, Table } from '@navikt/ds-react';
import {
    behandlingResultatTilTag,
    finnBehandlingstypeTekst,
    klagebehandlingResultatTilText,
} from '~/utils/tekstformateringUtils';
import { formaterTidspunkt, formaterPeriode } from '~/utils/date';
import { ChevronDownIcon, FileIcon } from '@navikt/aksel-icons';
import MenyValgBehandleSøknadPåNytt from '~/lib/behandling-felles/behandlingmeny/menyvalg/MenyValgBehandleSøknadPåNytt';
import SeBehandlingMenyvalg from '~/lib/behandling-felles/behandlingmeny/menyvalg/SeBehandlingMenyvalg';
import { behandlingUrl } from '~/utils/urls';
import { SakId } from '~/lib/sak/SakTyper';
import {
    Søknadsbehandling,
    SøknadsbehandlingResultat,
} from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { Omgjøringsgrad } from '~/lib/rammebehandling/typer/Rammevedtak';
import { OmgjørVedtakMenyvalg } from '~/lib/personoversikt/behandlinger-oversikt/vedtatte-behandlinger/OmgjørVedtakMenyvalg';
import { classNames } from '~/utils/classNames';
import { RammevedtakMedBehandling } from '~/lib/rammebehandling/typer/Rammevedtak';
import Link from 'next/link';
import { klagebehandlingUrl, KlageStegUrlSegment } from '~/utils/urls';
import { KlagevedtakMedBehandling } from '~/lib/klage/typer/Klagevedtak';
import {
    RammevedtakEllerKlageMedBehandling,
    VedtakType,
} from '~/lib/behandling-felles/typer/BehandlingFelles';

import style from './OmgjortGradBakgrunn.module.css';

type Props = {
    sakId: SakId;
    vedtakMedBehandling: RammevedtakEllerKlageMedBehandling[];
};

export const VedtatteBehandlingerTabell = ({ vedtakMedBehandling }: Props) => {
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Behandlingstype</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Resultat</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Tidspunkt iverksatt</Table.HeaderCell>
                    <Table.HeaderCell scope="col">
                        Opprinnelige innvilgelsesperioder
                    </Table.HeaderCell>
                    <Table.HeaderCell scope="col">Gjeldende innvilgelsesperioder</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Beslutter</Table.HeaderCell>
                    <Table.HeaderCell scope="col"></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {vedtakMedBehandling.map((vedtak) => {
                    switch (vedtak.vedtakType) {
                        case VedtakType.Rammebehandling:
                            return (
                                <RammevedtakMedBehandlingRad key={vedtak.id} rammevedtak={vedtak} />
                            );

                        case VedtakType.Klage:
                            return (
                                <KlagevedtakMedBehandlingRad
                                    key={vedtak.klagevedtakId}
                                    klagevedtak={vedtak}
                                />
                            );
                    }

                    //hvis denne fjernes vil ikke funksjonen få compile error dersom en case mangler
                    throw vedtak satisfies never;
                })}
            </Table.Body>
        </Table>
    );
};

const RammevedtakMedBehandlingRad = ({
    rammevedtak,
}: {
    rammevedtak: RammevedtakMedBehandling;
}) => {
    const {
        omgjortGrad,
        resultat,
        opprettet,
        opprinneligInnvilgetPerioder,
        gjeldendeInnvilgetPerioder,
        saksbehandler,
        beslutter,
        behandling,
    } = rammevedtak;

    return (
        <Table.Row
            shadeOnHover={false}
            className={classNames(omgjortGrad && omgjortGradStyle[omgjortGrad])}
        >
            <Table.DataCell>{finnBehandlingstypeTekst[behandling.type]}</Table.DataCell>
            <Table.DataCell>
                {behandlingResultatTilTag(
                    resultat,
                    behandling.klagebehandlingId ? 'Klage - ' : undefined,
                )}
            </Table.DataCell>
            <Table.DataCell>{formaterTidspunkt(opprettet)}</Table.DataCell>
            <Table.DataCell>
                {opprinneligInnvilgetPerioder.map((periode) => formaterPeriode(periode)).join(', ')}
            </Table.DataCell>
            <Table.DataCell>
                {gjeldendeInnvilgetPerioder.map((periode) => formaterPeriode(periode)).join(', ')}
            </Table.DataCell>
            <Table.DataCell>{saksbehandler}</Table.DataCell>
            <Table.DataCell>{beslutter}</Table.DataCell>
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
                                sakId={behandling.sakId}
                                søknadId={(behandling as Søknadsbehandling).søknad.id}
                            />
                        ) : (
                            <OmgjørVedtakMenyvalg vedtak={rammevedtak} sakId={behandling.sakId} />
                        )}
                        <ActionMenu.Divider />
                        <SeBehandlingMenyvalg behandlingHref={behandlingUrl(behandling)} />
                    </ActionMenu.Content>
                </ActionMenu>
            </Table.DataCell>
        </Table.Row>
    );
};

const KlagevedtakMedBehandlingRad = ({
    klagevedtak,
}: {
    klagevedtak: KlagevedtakMedBehandling;
}) => {
    const { resultat, opprettet, behandling } = klagevedtak;

    return (
        <Table.Row shadeOnHover={false}>
            <Table.DataCell>{'Klage'}</Table.DataCell>
            <Table.DataCell>{klagebehandlingResultatTilText[resultat]}</Table.DataCell>
            <Table.DataCell>{formaterTidspunkt(opprettet)}</Table.DataCell>
            <Table.DataCell>{'-'}</Table.DataCell>
            <Table.DataCell>{'-'}</Table.DataCell>
            <Table.DataCell>{behandling.saksbehandler}</Table.DataCell>
            <Table.DataCell>{'-'}</Table.DataCell>
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
                        <ActionMenu.Item
                            as={Link}
                            href={klagebehandlingUrl(
                                behandling.saksnummer,
                                behandling.id,
                                KlageStegUrlSegment.Formkrav,
                            )}
                            icon={<FileIcon aria-hidden />}
                        >
                            {'Se vedtak'}
                        </ActionMenu.Item>
                    </ActionMenu.Content>
                </ActionMenu>
            </Table.DataCell>
        </Table.Row>
    );
};

const omgjortGradStyle: Record<Omgjøringsgrad | string, string> = {
    DELVIS: style.delvisOmgjortBg,
    HELT: style.heltOmgjortBg,
} as const;
