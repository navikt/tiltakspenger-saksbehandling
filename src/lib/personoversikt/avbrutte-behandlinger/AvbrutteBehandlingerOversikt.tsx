import {
    Rammebehandling,
    RammebehandlingId,
    RammebehandlingResultat,
    Rammebehandlingstype,
} from '~/lib/rammebehandling/typer/Rammebehandling';
import { Klagebehandling, KlagebehandlingResultat, KlageId } from '~/lib/klage/typer/Klage';
import { Button, Table } from '@navikt/ds-react';
import { formaterPeriode, formaterTidspunkt } from '~/utils/date';
import Link from 'next/link';
import { behandlingUrl, klagebehandlingUrl, KlageStegUrlSegment } from '~/utils/urls';
import { Periode } from '~/types/Periode';
import { Nullable } from '~/types/UtilTypes';
import { Infokort } from '~/lib/_felles/infokort/Infokort';

type Props = {
    saksnummer: string;
    avbrutteRammebehandlinger: Rammebehandling[];
    avbrutteKlagebehandlinger: Klagebehandling[];
};

export const AvbrutteBehandlingerOversikt = ({
    saksnummer,
    avbrutteRammebehandlinger,
    avbrutteKlagebehandlinger,
}: Props) => {
    const avbrutteBehandlinger = [
        ...avbrutteRammebehandlinger.map(avbruttBehandlingToDataCellInfo),
        ...avbrutteKlagebehandlinger.map(avbruttKlageToDataCellInfo),
    ].toSorted((a, b) => b.tidspunktAvsluttet.localeCompare(a.tidspunktAvsluttet));

    if (avbrutteBehandlinger.length === 0) {
        return (
            <Infokort variant={'info'}>{'Ingen avsluttede behandlinger på denne saken'}</Infokort>
        );
    }

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Behandlingstype</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Tidspunkt avsluttet</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Behandlingsperiode</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Beslutter</Table.HeaderCell>
                    <Table.HeaderCell scope="col"></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {avbrutteBehandlinger.map((behandling, idx) => {
                    const {
                        tidspunktAvsluttet,
                        behandlingstype,
                        behandlingsperiode,
                        saksbehandler,
                        beslutter,
                        id,
                    } = behandling;

                    return (
                        <Table.Row shadeOnHover={false} key={`${tidspunktAvsluttet}-${idx}`}>
                            <Table.DataCell>
                                {avbruttbehandlingstypeTekst[behandlingstype]}
                            </Table.DataCell>
                            <Table.DataCell>{formaterTidspunkt(tidspunktAvsluttet)}</Table.DataCell>
                            <Table.DataCell>
                                {behandlingsperiode
                                    ? formaterPeriode(behandlingsperiode)
                                    : 'Ingen periode'}
                            </Table.DataCell>
                            <Table.DataCell>{saksbehandler ?? 'Ikke tildelt'}</Table.DataCell>
                            <Table.DataCell>{beslutter ?? 'Ikke tildelt'}</Table.DataCell>
                            <Table.DataCell align={'right'}>
                                <Button
                                    size={'small'}
                                    variant={'secondary'}
                                    as={Link}
                                    href={
                                        behandlingstype === 'KLAGEBEHANDLING'
                                            ? klagebehandlingUrl(
                                                  saksnummer,
                                                  id,
                                                  KlageStegUrlSegment.Formkrav,
                                              )
                                            : behandlingUrl({
                                                  saksnummer,
                                                  id,
                                              })
                                    }
                                >
                                    {'Se behandling'}
                                </Button>
                            </Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    );
};

const avbruttBehandlingToDataCellInfo = (behandling: Rammebehandling): AvbruttBehandlingInfo => {
    return {
        id: behandling.id,
        behandlingsperiode: behandling.vedtaksperiode,
        resultat: behandling.resultat,
        behandlingstype: behandling.type,
        tidspunktAvsluttet: behandling.avbrutt!.avbruttTidspunkt,
        saksbehandler: behandling.saksbehandler,
        beslutter: behandling.beslutter,
    };
};

const avbruttKlageToDataCellInfo = (klage: Klagebehandling): AvbruttBehandlingInfo => {
    return {
        id: klage.id,
        behandlingsperiode: null,
        resultat: klage.resultat?.type ?? KlagebehandlingResultat.AVVIST,
        behandlingstype: 'KLAGEBEHANDLING',
        tidspunktAvsluttet: klage.sistEndret,
        saksbehandler: klage.saksbehandler,
        beslutter: null,
    };
};

const avbruttbehandlingstypeTekst: Record<AvbruttBehandlingstype, string> = {
    [Rammebehandlingstype.SØKNADSBEHANDLING]: 'Søknadsbehandling',
    [Rammebehandlingstype.REVURDERING]: 'Revurdering',
    KLAGEBEHANDLING: 'Klagebehandling',
} as const;

type AvbruttBehandlingInfoBase = {
    id: RammebehandlingId | KlageId;
    behandlingstype: AvbruttBehandlingstype;
    resultat: AvbruttBehandlingResultat;
    tidspunktAvsluttet: string;
    behandlingsperiode: Nullable<Periode>;
    saksbehandler?: Nullable<string>;
    beslutter?: Nullable<string>;
};

type AvbruttKlagebehandlingInfo = AvbruttBehandlingInfoBase & {
    id: KlageId;
    behandlingstype: 'KLAGEBEHANDLING';
    resultat: KlagebehandlingResultat;
};

type AvbruttRammebehandlingInfo = AvbruttBehandlingInfoBase & {
    id: RammebehandlingId;
    behandlingstype: Rammebehandlingstype;
    resultat: RammebehandlingResultat;
};

type AvbruttBehandlingInfo = AvbruttKlagebehandlingInfo | AvbruttRammebehandlingInfo;

type AvbruttBehandlingstype = Rammebehandlingstype | 'KLAGEBEHANDLING';
type AvbruttBehandlingResultat = RammebehandlingResultat | KlagebehandlingResultat;
