/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/jest-globals';
import { expect, test } from '@jest/globals';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { TiltakshistorikkForTiltak } from './TiltakshistorikkForTiltak';
import {
    TiltakshistorikkForBehandling,
    Tiltakshistorikkinnslag,
} from '~/lib/rammebehandling/typer/Tiltakshistorikk';
import {
    TiltakDeltakerstatus,
    TiltaksdeltakelseKilde,
} from '~/lib/rammebehandling/typer/Tiltaksdeltakelse';
import { TiltaksdeltakerEndringType } from '~/lib/rammebehandling/typer/Revurdering';
import { Dato, Tidspunkt } from '~/types/DatoTid';
import { nonNullish } from '~/utils/object';

const lagInnslag = (
    id: string,
    innhentet: string,
    overstyr: Partial<Tiltakshistorikkinnslag> = {},
): Tiltakshistorikkinnslag => ({
    id,
    internDeltakelseId: 'intern',
    eksternDeltagelseId: 'ekstern',
    innhentet: innhentet as Tidspunkt,
    typeNavn: 'Arbeidsmarkedsopplæring',
    periode: { fraOgMed: '2025-04-01' as Dato, tilOgMed: null },
    deltakelseStatus: TiltakDeltakerstatus.DELTAR,
    kildestatus: 'DELTAR',
    deltakelseProsent: 100,
    antallDagerPerUke: 5,
    gjennomforingsprosent: null,
    kilde: TiltaksdeltakelseKilde.KOMET,
    endringer: [],
    harRelevantEndring: false,
    utløsteBehandlingen: false,
    behandlingId: null,
    oppgaveId: null,
    verdi: {
        eksternDeltakelseId: 'ekstern',
        gjennomføringId: 'gjennomføring-1',
        tiltakstype: 'GRUPPE_AMO',
        tiltakstypenavn: 'Arbeidsmarkedsopplæring i gruppe',
        tiltakskodeFraKilden: 'GRUPPE_AMO_KILDE',
        fraOgMed: '2025-04-01' as Dato,
        tilOgMed: '2025-06-30' as Dato,
        kildestatus: {
            kilde: TiltaksdeltakelseKilde.KOMET,
            kodeIKontrakten: 'HAR_SLUTTET',
            årsak: 'FATT_JOBB',
            opprettet: '2025-04-15T08:30:15' as Tidspunkt,
        },
        deltakelsesprosent: 80,
        dagerPerUke: 4,
        deltidsprosentPåGjennomføring: 60,
    },
    ...overstyr,
});

const oppslagstidspunkt = '2025-05-01T09:00:00' as Tidspunkt;
const sistEndret = '2025-05-01T12:00:00' as Tidspunkt;
const utdatertTekst = 'Tiltaksdeltakelsen er endret etter at saksopplysningene ble hentet';

const renderForTiltak = (tiltakshistorikk: TiltakshistorikkForBehandling) =>
    render(
        <TiltakshistorikkForTiltak
            internDeltakelseId={'intern'}
            typeNavn={'Arbeidsmarkedsopplæring'}
            tiltakshistorikk={tiltakshistorikk}
            sistEndret={sistEndret}
            oppslagstidspunkt={oppslagstidspunkt}
        />,
    );

test('viser ingenting når tiltaket ikke har tiltakshistorikk', () => {
    const { container } = renderForTiltak({
        harEndringEtterSistEndret: false,
        innslag: [lagInnslag('annet', '2025-05-02T10:00:00', { internDeltakelseId: 'annet' })],
    });

    expect(container).toBeEmptyDOMElement();
});

test('viser historikken for tiltaket kun i modalen når saksopplysningene er oppdaterte', () => {
    renderForTiltak({
        harEndringEtterSistEndret: false,
        innslag: [
            lagInnslag('utløsende', '2025-05-01T10:00:00', {
                utløsteBehandlingen: true,
                harRelevantEndring: true,
                endringer: [{ type: TiltaksdeltakerEndringType.AVBRUTT_DELTAKELSE }],
            }),
            lagInnslag('eldre', '2025-04-01T10:00:00'),
            lagInnslag('annet', '2025-05-02T10:00:00', { internDeltakelseId: 'annet' }),
        ],
    });

    expect(screen.queryByText(utdatertTekst)).not.toBeInTheDocument();
    expect(screen.queryByText('Utløste behandlingen')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Vis endringshistorikk (2)' }));

    expect(screen.getByText('Endringshistorikk for Arbeidsmarkedsopplæring')).toBeInTheDocument();
    expect(screen.getAllByText('Utløste behandlingen')).toHaveLength(1);
    expect(screen.getByText('Deltakelsen er avbrutt')).toBeInTheDocument();
    expect(screen.getAllByText('01.04.2025 - Ukjent')).toHaveLength(2);
    expect(screen.queryByText('Ny endring')).not.toBeInTheDocument();
});

test('viser ikke nye innslag i saksopplysningene når de ikke har relevante endringer', () => {
    renderForTiltak({
        harEndringEtterSistEndret: false,
        innslag: [
            lagInnslag('eldre', '2025-04-01T10:00:00'),
            lagInnslag('uten-relevant-endring', '2025-05-02T10:00:00', {
                periode: { fraOgMed: '2025-04-01' as Dato, tilOgMed: '2025-06-30' as Dato },
                harRelevantEndring: false,
            }),
        ],
    });

    expect(screen.queryByText(utdatertTekst)).not.toBeInTheDocument();
    expect(screen.queryByText('01.04.2025 - 30.06.2025')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Vis endringshistorikk (2)' })).toBeInTheDocument();
});

test('viser det nyeste innslaget under tiltaket når det har relevante endringer etter at saksopplysningene ble hentet', () => {
    renderForTiltak({
        harEndringEtterSistEndret: true,
        innslag: [
            lagInnslag('eldre', '2025-04-01T10:00:00'),
            lagInnslag('nyeste', '2025-05-02T10:00:00', {
                periode: { fraOgMed: '2025-04-01' as Dato, tilOgMed: '2025-06-30' as Dato },
                gjennomforingsprosent: 60,
                harRelevantEndring: true,
                endringer: [
                    {
                        type: TiltaksdeltakerEndringType.FORLENGELSE,
                        nySluttdato: '2025-06-30' as Dato,
                    },
                ],
            }),
        ],
    });

    expect(screen.getByText(utdatertTekst)).toBeInTheDocument();
    expect(screen.getByText('01.04.2025 - 30.06.2025')).toBeInTheDocument();
    expect(screen.queryByText('01.04.2025 - Ukjent')).not.toBeInTheDocument();
    expect(screen.getAllByText('Ny endring')).toHaveLength(1);
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Vis mer' })).not.toBeInTheDocument();
});

test('viser alle felter fra verdi når saksbehandler trykker på vis mer i modalen', () => {
    renderForTiltak({
        harEndringEtterSistEndret: false,
        innslag: [lagInnslag('innslag-1', '2025-04-15T10:00:00')],
    });

    fireEvent.click(screen.getByRole('button', { name: 'Vis endringshistorikk (1)' }));

    const visMerKnapp = screen.getByRole('button', { name: 'Vis mer' });
    expect(visMerKnapp).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Gjennomføring-id:')).not.toBeInTheDocument();

    fireEvent.click(visMerKnapp);

    expect(visMerKnapp).toHaveAttribute('aria-expanded', 'true');
    const forventedeDetaljer = [
        ['Ekstern deltakelse-id:', 'ekstern'],
        ['Gjennomføring-id:', 'gjennomføring-1'],
        ['Tiltakstype:', 'GRUPPE_AMO'],
        ['Tiltakstypenavn:', 'Arbeidsmarkedsopplæring i gruppe'],
        ['Tiltakskode fra kilden:', 'GRUPPE_AMO_KILDE'],
        ['Fra og med:', '01.04.2025'],
        ['Til og med:', '30.06.2025'],
        ['Kilde:', 'Komet'],
        ['Kildestatus:', 'HAR_SLUTTET'],
        ['Statusårsak:', 'FATT_JOBB'],
        ['Status opprettet:', '15.04.2025 kl. 08:30:15'],
        ['Deltakelsesprosent:', '80%'],
        ['Dager per uke:', '4'],
        ['Deltidsprosent på gjennomføring:', '60%'],
    ] as const;

    const visMerInnhold = within(nonNullish(visMerKnapp.parentElement));
    for (const [navn, verdi] of forventedeDetaljer) {
        expect(visMerInnhold.getByText(navn).parentElement).toHaveTextContent(`${navn}${verdi}`);
    }
});

test('viser registerkilde og deltakelse-id kun på innslag der de er endret fra forrige innslag', () => {
    renderForTiltak({
        harEndringEtterSistEndret: false,
        innslag: [
            lagInnslag('arena', '2025-03-01T10:00:00', {
                kilde: TiltaksdeltakelseKilde.ARENA,
                eksternDeltagelseId: 'TA123',
            }),
            lagInnslag('arena-igjen', '2025-03-15T10:00:00', {
                kilde: TiltaksdeltakelseKilde.ARENA,
                eksternDeltagelseId: 'TA123',
            }),
            lagInnslag('komet', '2025-04-01T10:00:00'),
            lagInnslag('komet-igjen', '2025-04-15T10:00:00'),
        ],
    });

    fireEvent.click(screen.getByRole('button', { name: 'Vis endringshistorikk (4)' }));

    expect(screen.getAllByText('Registerkilde:')).toHaveLength(1);
    expect(screen.getAllByText('Deltakelse-id:')).toHaveLength(1);
    expect(screen.getByText('ekstern')).toBeInTheDocument();
    expect(screen.queryByText('TA123')).not.toBeInTheDocument();
});
