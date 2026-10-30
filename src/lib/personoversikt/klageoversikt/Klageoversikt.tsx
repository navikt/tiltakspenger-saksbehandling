import { HStack, Table, Tag } from '@navikt/ds-react';
import { nonNullish } from '~/utils/object';
import KlageMeny from '~/lib/klage/meny/KlageMeny';
import { SaksbehandlerKlagebehandlingKommando } from '~/lib/klage/typer/Klage';
import { formaterTidspunkt } from '~/utils/date';
import { klagehendelseUtfallTilTag } from '~/lib/klage/utils/KlageinstanshendelseUtils';
import {
    erKlageFerdigbehandlet,
    erKlageFerdigstilt,
    finnSisteGyldigeStegForKlage,
    hentSisteKlagehendelseUtfallFraKlagebehandling,
} from '~/lib/klage/utils/klageUtils';
import { erBehandlingSattPåVent } from '~/lib/behandling-felles/utils/behandlingUtils';
import { useSak } from '~/lib/sak/SakContext';
import { hentKlagevedtakMedBehandlinger } from '~/lib/sak/sakUtils';
import { InternLenkeKnapp } from '~/lib/_felles/intern-lenke/InternLenkeKnapp';
import { KlagebehandlingResultatTag } from '~/lib/klage/tags/KlagebehandlingResultatTag';
import { KlagebehandlingStatusTag } from '~/lib/klage/tags/KlagebehandlingStatusTag';

export const Klageoversikt = () => {
    const { sak } = useSak();
    const { klagebehandlinger } = sak;

    const klagevedtakMedBehandling = hentKlagevedtakMedBehandlinger(sak);

    const klagebehandlingerUtenVedtak = klagebehandlinger.filter(
        (klage) => !klagevedtakMedBehandling.some((vedtak) => vedtak.behandling.id === klage.id),
    );

    const harOverlappendeklagebehandlinger = klagebehandlingerUtenVedtak.some((klagebehandling) =>
        klagevedtakMedBehandling.some(
            (klagevedtak) => klagevedtak.behandling.id === klagebehandling.id,
        ),
    );

    if (harOverlappendeklagebehandlinger) {
        throw new Error(
            'Komponenten har samme klagebehandling både i klagebehandlinger og klagevedtakMedBehandling. Det skal være enten eller',
        );
    }

    const klagevedtakMedBehandlingOversikt = klagevedtakMedBehandling.map(
        (klagevedtakMedBehandling) => {
            return {
                status: (
                    <KlagebehandlingStatusTag status={klagevedtakMedBehandling.behandling.status} />
                ),
                resultat: (
                    <KlagebehandlingResultatTag resultat={klagevedtakMedBehandling.resultat} />
                ),
                utfallKlageinstans: '-',
                opprettet: formaterTidspunkt(klagevedtakMedBehandling.behandling.opprettet),
                ferdigstilt: formaterTidspunkt(klagevedtakMedBehandling.opprettet),
                saksbehandler: nonNullish(klagevedtakMedBehandling.behandling.saksbehandler),
                meny: (
                    <HStack gap={'space-8'} justify={'end'} align={'center'} wrap={false}>
                        <InternLenkeKnapp
                            href={finnSisteGyldigeStegForKlage(klagevedtakMedBehandling.behandling)}
                        />

                        <KlageMeny klage={klagevedtakMedBehandling.behandling} />
                    </HStack>
                ),
            };
        },
    );

    const klagebehandlingerOversikt = klagebehandlingerUtenVedtak.map((klagebehandling) => {
        const utfall = hentSisteKlagehendelseUtfallFraKlagebehandling(klagebehandling);

        return {
            status: erBehandlingSattPåVent(klagebehandling) ? (
                <Tag data-color="warning">Satt på vent</Tag>
            ) : (
                <KlagebehandlingStatusTag status={klagebehandling.status} />
            ),
            resultat: klagebehandling.resultat ? (
                <KlagebehandlingResultatTag resultat={klagebehandling.resultat.type} />
            ) : (
                '-'
            ),
            utfallKlageinstans: utfall ? klagehendelseUtfallTilTag({ utfall: utfall }) : '-',
            opprettet: formaterTidspunkt(klagebehandling.opprettet),
            ferdigstilt: erKlageFerdigstilt(klagebehandling)
                ? formaterTidspunkt(nonNullish(klagebehandling.resultat.ferdigstiltTidspunkt))
                : erKlageFerdigbehandlet(klagebehandling)
                  ? formaterTidspunkt(nonNullish(klagebehandling.iverksattTidspunkt))
                  : '-',
            saksbehandler: klagebehandling.saksbehandler ?? 'Ikke tildelt',
            meny: (
                <HStack gap={'space-8'} justify={'end'} align={'center'} wrap={false}>
                    <InternLenkeKnapp href={finnSisteGyldigeStegForKlage(klagebehandling)}>
                        {klagebehandling.gyldigeKommandoer.includes(
                            SaksbehandlerKlagebehandlingKommando.Saksbehandle,
                        )
                            ? 'Fortsett'
                            : 'Se behandling'}
                    </InternLenkeKnapp>

                    <KlageMeny klage={klagebehandling} />
                </HStack>
            ),
        };
    });

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
                        <Table.DataCell align={'right'}>{klage.meny}</Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};
