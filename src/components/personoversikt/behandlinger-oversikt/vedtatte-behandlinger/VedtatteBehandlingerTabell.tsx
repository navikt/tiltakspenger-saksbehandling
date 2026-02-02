import { ActionMenu, Button, Table } from '@navikt/ds-react';
import {
    behandlingResultatTilTag,
    finnBehandlingstypeTekst,
    klagebehandlingResultatTilText,
} from '~/utils/tekstformateringUtils';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '~/utils/date';
import { ChevronDownIcon, FileIcon } from '@navikt/aksel-icons';
import MenyValgBehandleSøknadPåNytt from '~/components/behandlingmeny/menyvalg/MenyValgBehandleSøknadPåNytt';
import SeBehandlingMenyvalg from '~/components/behandlingmeny/menyvalg/SeBehandlingMenyvalg';
import React from 'react';
import { behandlingUrl } from '~/utils/urls';
import { SakId } from '~/types/Sak';
import { Søknadsbehandling, SøknadsbehandlingResultat } from '~/types/Søknadsbehandling';
import { Omgjøringsgrad, Rammevedtak } from '~/types/Rammevedtak';
import { OmgjørVedtakMenyvalg } from '~/components/personoversikt/behandlinger-oversikt/vedtatte-behandlinger/OmgjørVedtakMenyvalg';
import { classNames } from '~/utils/classNames';

import style from './VedtatteBehandlinger.module.css';
import { Rammebehandling } from '~/types/Rammebehandling';
import { Klagebehandling } from '~/types/Klage';
import { Klagevedtak } from '~/types/Klagevedtak';
import Link from 'next/link';

type Props = {
    sakId: SakId;
    vedtakMedBehandling: VedtakMedBehandling[];
};

type VedtattRammevedtakMedBehandling = { type: 'rammevedtak' } & Rammevedtak & {
        behandling: Rammebehandling;
    };

type VedtattKlagevedtakMedBehandling = { type: 'klagevedtak' } & Klagevedtak & {
        behandling: Klagebehandling;
    };

type VedtakMedBehandling = VedtattRammevedtakMedBehandling | VedtattKlagevedtakMedBehandling;

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
                    const { type } = vedtak;
                    switch (type) {
                        case 'rammevedtak':
                            return (
                                <RammevedtakMedBehandlingRad key={vedtak.id} rammevedtak={vedtak} />
                            );

                        case 'klagevedtak':
                            return (
                                <KlagevedtakMedBehandlingRad
                                    key={vedtak.klagevedtakId}
                                    klagevedtak={vedtak}
                                />
                            );
                    }

                    //hvis denne fjernes vil ikke funksjonen få compile error dersom en case mangler
                    throw type satisfies never;
                })}
            </Table.Body>
        </Table>
    );
};

const omgjortGradStyle: Record<Omgjøringsgrad | string, string> = {
    DELVIS: style.delvisOmgjortBg,
    HELT: style.heltOmgjortBg,
};

const RammevedtakMedBehandlingRad = (props: { rammevedtak: VedtattRammevedtakMedBehandling }) => {
    return (
        <Table.Row
            shadeOnHover={false}
            className={classNames(
                props.rammevedtak.omgjortGrad && omgjortGradStyle[props.rammevedtak.omgjortGrad],
            )}
            key={props.rammevedtak.id}
        >
            <Table.DataCell>
                {finnBehandlingstypeTekst[props.rammevedtak.behandling.type]}
            </Table.DataCell>
            <Table.DataCell>
                {behandlingResultatTilTag(
                    props.rammevedtak.resultat,
                    props.rammevedtak.behandling.klagebehandlingId ? 'Klage - ' : undefined,
                )}
            </Table.DataCell>
            <Table.DataCell>{formaterTidspunkt(props.rammevedtak.opprettet)}</Table.DataCell>
            <Table.DataCell>
                {props.rammevedtak.opprinneligInnvilgetPerioder
                    .map((periode) => periodeTilFormatertDatotekst(periode))
                    .join(', ')}
            </Table.DataCell>
            <Table.DataCell>
                {props.rammevedtak.gjeldendeInnvilgetPerioder
                    .map((periode) => periodeTilFormatertDatotekst(periode))
                    .join(', ')}
            </Table.DataCell>
            <Table.DataCell>{props.rammevedtak.saksbehandler}</Table.DataCell>
            <Table.DataCell>{props.rammevedtak.beslutter}</Table.DataCell>
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
                        {props.rammevedtak.resultat === SøknadsbehandlingResultat.AVSLAG ? (
                            <MenyValgBehandleSøknadPåNytt
                                sakId={props.rammevedtak.behandling.sakId}
                                søknadId={
                                    (props.rammevedtak.behandling as Søknadsbehandling).søknad.id
                                }
                            />
                        ) : (
                            <OmgjørVedtakMenyvalg
                                vedtak={props.rammevedtak}
                                sakId={props.rammevedtak.behandling.sakId}
                            />
                        )}
                        <ActionMenu.Divider />
                        <SeBehandlingMenyvalg
                            behandlingHref={behandlingUrl(props.rammevedtak.behandling)}
                        />
                    </ActionMenu.Content>
                </ActionMenu>
            </Table.DataCell>
        </Table.Row>
    );
};

const KlagevedtakMedBehandlingRad = (props: { klagevedtak: VedtattKlagevedtakMedBehandling }) => {
    return (
        <Table.Row shadeOnHover={false} key={props.klagevedtak.klagevedtakId}>
            <Table.DataCell>Klage</Table.DataCell>
            <Table.DataCell>
                {klagebehandlingResultatTilText[props.klagevedtak.resultat]}
            </Table.DataCell>
            <Table.DataCell>{formaterTidspunkt(props.klagevedtak.opprettet)}</Table.DataCell>
            <Table.DataCell>-</Table.DataCell>
            <Table.DataCell>-</Table.DataCell>
            <Table.DataCell>{props.klagevedtak.behandling.saksbehandler}</Table.DataCell>
            <Table.DataCell>-</Table.DataCell>
            <Table.DataCell align={'right'}>
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
                            href={`/sak/${props.klagevedtak.behandling.saksnummer}/klage/${props.klagevedtak.behandling.id}/formkrav`}
                            icon={<FileIcon aria-hidden />}
                        >
                            Se vedtak
                        </ActionMenu.Item>
                    </ActionMenu.Content>
                </ActionMenu>
            </Table.DataCell>
        </Table.Row>
    );
};
