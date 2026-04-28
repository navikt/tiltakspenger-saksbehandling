import { Tag, Table } from '@navikt/ds-react';
import KlageMeny from '~/lib/behandling-felles/behandlingmeny/KlageMeny';
import { Klagebehandling, KlagevedtakMedBehandling } from '~/lib/klage/typer/Klage';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { Nullable } from '~/types/UtilTypes';
import { formaterTidspunkt } from '~/utils/date';
import { klagehendelseUtfallTilTag } from '~/lib/klage/utils/KlageinstanshendelseUtils';
import {
    erKlageFerdigbehandlet,
    erKlageFerdigstilt,
    hentSisteKlagehendelseUtfallFraKlagebehandling,
} from '~/lib/klage/utils/klageUtils';
import {
    klagebehandlingStatusTilTag,
    klagebehandlingResultatTilTag,
} from '~/utils/tekstformateringUtils';

export type KlagebehandlingerMedOmgjøringsbehandling = {
    klagebehandling: Klagebehandling;
    omgjøringsbehandling: Nullable<Rammebehandling>;
};

const Klageoversikt = (props: {
    klagebehandlingerMedOmgjøringsbehandling: KlagebehandlingerMedOmgjøringsbehandling[];
    klagevedtakMedBehandling: KlagevedtakMedBehandling[];
}) => {
    const harOverlappendeklagebehandlinger = props.klagebehandlingerMedOmgjøringsbehandling.some(
        (klagebehandling) =>
            props.klagevedtakMedBehandling.some(
                (klagevedtak) => klagevedtak.behandling.id === klagebehandling.klagebehandling.id,
            ),
    );

    if (harOverlappendeklagebehandlinger) {
        throw new Error(
            'Komponenten har samme klagebehandling både i klagebehandlinger og klagevedtakMedBehandling. Det skal være enten eller',
        );
    }

    const klagevedtakMedBehandlingOversikt = props.klagevedtakMedBehandling.map(
        (klagevedtakMedBehandling) => {
            return {
                status: klagebehandlingStatusTilTag({
                    status: klagevedtakMedBehandling.behandling.status,
                }),
                resultat: klagebehandlingResultatTilTag({
                    resultat: klagevedtakMedBehandling.resultat,
                }),
                utfallKlageinstans: '-',
                opprettet: formaterTidspunkt(klagevedtakMedBehandling.behandling.opprettet),
                ferdigstilt: formaterTidspunkt(klagevedtakMedBehandling.opprettet),
                saksbehandler: klagevedtakMedBehandling.behandling.saksbehandler!,
                meny: (
                    <KlageMeny
                        klage={klagevedtakMedBehandling.behandling}
                        omgjøringsbehandling={null}
                    />
                ),
            };
        },
    );

    const klagebehandlingerOversikt = props.klagebehandlingerMedOmgjøringsbehandling.map(
        ({ klagebehandling, omgjøringsbehandling }) => {
            const utfall = hentSisteKlagehendelseUtfallFraKlagebehandling(klagebehandling);

            return {
                status: klagebehandling.ventestatus.at(-1)?.erSattPåVent ? (
                    <Tag data-color="warning">Satt på vent</Tag>
                ) : (
                    klagebehandlingStatusTilTag({ status: klagebehandling.status })
                ),
                resultat: klagebehandling.resultat
                    ? klagebehandlingResultatTilTag({ resultat: klagebehandling.resultat.type })
                    : '-',
                utfallKlageinstans: utfall ? klagehendelseUtfallTilTag({ utfall: utfall }) : '-',
                opprettet: formaterTidspunkt(klagebehandling.opprettet),
                ferdigstilt: erKlageFerdigstilt(klagebehandling)
                    ? formaterTidspunkt(klagebehandling.resultat.ferdigstiltTidspunkt!)
                    : erKlageFerdigbehandlet(klagebehandling)
                      ? formaterTidspunkt(klagebehandling.iverksattTidspunkt!)
                      : '-',
                saksbehandler: klagebehandling.saksbehandler ?? 'Ikke tildelt',
                meny: (
                    <KlageMeny
                        klage={klagebehandling}
                        omgjøringsbehandling={omgjøringsbehandling}
                    />
                ),
            };
        },
    );

    const klagerTilOversikt = [
        ...klagevedtakMedBehandlingOversikt,
        ...klagebehandlingerOversikt,
    ].toSorted((a, b) => b.opprettet.localeCompare(a.opprettet));

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Utfall underinstans</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Utfall klageinstans</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Opprettet</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Ferdigstilt</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
                    <Table.HeaderCell scope="col"></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {klagerTilOversikt.map((klage) => (
                    <Table.Row key={klage.opprettet}>
                        <Table.DataCell>{klage.status}</Table.DataCell>
                        <Table.DataCell>{klage.resultat}</Table.DataCell>
                        <Table.DataCell>{klage.utfallKlageinstans}</Table.DataCell>
                        <Table.DataCell>{klage.opprettet}</Table.DataCell>
                        <Table.DataCell>{klage.ferdigstilt}</Table.DataCell>
                        <Table.DataCell>{klage.saksbehandler}</Table.DataCell>
                        <Table.DataCell>{klage.meny}</Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

export default Klageoversikt;
