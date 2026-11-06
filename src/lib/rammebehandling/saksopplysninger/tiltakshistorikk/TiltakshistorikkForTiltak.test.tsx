/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/jest-globals';
import { expect, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
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
    utløsteBehandlingen: false,
    behandlingId: null,
    oppgaveId: null,
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
                endringer: [{ type: TiltaksdeltakerEndringType.AVBRUTT_DELTAKELSE }],
            }),
            lagInnslag('eldre', '2025-04-01T10:00:00'),
            lagInnslag('annet', '2025-05-02T10:00:00', { internDeltakelseId: 'annet' }),
        ],
    });

    expect(screen.queryByText(utdatertTekst)).not.toBeInTheDocument();
    expect(screen.queryByText('Utløste behandlingen')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Vis tiltakshistorikk (2)' }));

    expect(screen.getByText('Tiltakshistorikk for Arbeidsmarkedsopplæring')).toBeInTheDocument();
    expect(screen.getAllByText('Utløste behandlingen')).toHaveLength(1);
    expect(screen.getByText('Deltakelsen er avbrutt')).toBeInTheDocument();
    expect(screen.getAllByText('01.04.2025 - Ukjent')).toHaveLength(2);
    expect(screen.queryByText('Ny endring')).not.toBeInTheDocument();
});

test('viser det nyeste innslaget under tiltaket når saksopplysningene er utdaterte', () => {
    renderForTiltak({
        harEndringEtterSistEndret: true,
        innslag: [
            lagInnslag('eldre', '2025-04-01T10:00:00'),
            lagInnslag('nyeste', '2025-05-02T10:00:00', {
                periode: { fraOgMed: '2025-04-01' as Dato, tilOgMed: '2025-06-30' as Dato },
            }),
        ],
    });

    expect(screen.getByText(utdatertTekst)).toBeInTheDocument();
    expect(screen.getByText('01.04.2025 - 30.06.2025')).toBeInTheDocument();
    expect(screen.queryByText('01.04.2025 - Ukjent')).not.toBeInTheDocument();
    expect(screen.getAllByText('Ny endring')).toHaveLength(1);
});
