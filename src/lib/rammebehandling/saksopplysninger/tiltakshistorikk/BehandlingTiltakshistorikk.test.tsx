/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/jest-globals';
import { expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { BehandlingTiltakshistorikk } from './BehandlingTiltakshistorikk';
import { Tiltakshistorikkinnslag } from '~/lib/rammebehandling/typer/Tiltakshistorikk';
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

const sistEndret = '2025-05-01T12:00:00' as Tidspunkt;

test('markerer innslaget som utløste behandlingen og nye endringer', () => {
    render(
        <BehandlingTiltakshistorikk
            sistEndret={sistEndret}
            tiltakshistorikk={{
                harEndringEtterSistEndret: true,
                innslag: [
                    lagInnslag('utløsende', '2025-05-01T10:00:00', {
                        utløsteBehandlingen: true,
                        endringer: [{ type: TiltaksdeltakerEndringType.AVBRUTT_DELTAKELSE }],
                    }),
                    lagInnslag('ny', '2025-05-02T10:00:00'),
                ],
            }}
        />,
    );

    expect(screen.getAllByText('Utløste behandlingen')).toHaveLength(1);
    expect(screen.getAllByText('Ny endring')).toHaveLength(1);
    expect(screen.getByText('Deltakelsen er avbrutt')).toBeInTheDocument();
    expect(screen.getAllByText('01.04.2025 - Ukjent')).toHaveLength(2);
});

test('viser ikke nye endringer når behandlingen ikke skal varsles', () => {
    render(
        <BehandlingTiltakshistorikk
            sistEndret={sistEndret}
            tiltakshistorikk={{
                harEndringEtterSistEndret: false,
                innslag: [lagInnslag('ny', '2025-05-02T10:00:00')],
            }}
        />,
    );

    expect(screen.queryByText('Ny endring')).not.toBeInTheDocument();
});

test('viser tekst når det ikke finnes tiltakshistorikk', () => {
    render(
        <BehandlingTiltakshistorikk
            sistEndret={sistEndret}
            tiltakshistorikk={{ harEndringEtterSistEndret: false, innslag: [] }}
        />,
    );

    expect(
        screen.getByText('Ingen endringer i tiltaksdeltakelsene er registrert for behandlingen'),
    ).toBeInTheDocument();
});
