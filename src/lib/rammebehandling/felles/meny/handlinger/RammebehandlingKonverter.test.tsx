/** @jest-environment jsdom */
import { ComponentProps } from 'react';
import '@testing-library/jest-dom/jest-globals';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SakId, SakProps } from '~/lib/sak/SakTyper';
import { periode, rammevedtak, sak } from '~test/rammebehandling';
import { Saksnummer } from '~/lib/sak/Saksnummer';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { Rammevedtak, RammevedtakKommandoType } from '~/lib/rammebehandling/typer/Rammevedtak';
import { tilDato } from '~/types/DatoTid';
import {
    KonverterRevurderingTil,
    konverteringsalternativer,
    RammebehandlingKonverter,
} from './RammebehandlingKonverter';

const opprinneligFetch = global.fetch;
const fetchMock = jest.fn<typeof fetch>();

beforeEach(() => {
    global.fetch = fetchMock;
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
    global.fetch = opprinneligFetch;
    fetchMock.mockReset();
    jest.restoreAllMocks();
});

const svar = (status: number, body: unknown) =>
    ({ ok: status < 400, status, json: async () => body }) as Response;

const forlengbartVedtak = rammevedtak('vedtak_forlengbart', periode('2025-01-01', '2025-03-31'), {
    gyldigeKommandoer: {
        [RammevedtakKommandoType.FORLENG]: {
            type: RammevedtakKommandoType.FORLENG,
            forlengesFraOgMed: tilDato('2025-04-01'),
        },
    },
});

const renderDialog = (til: KonverterRevurderingTil, alleRammevedtak: Rammevedtak[] = []) => {
    const onSuccess = jest.fn<(sak: SakProps) => void>();
    render(
        <RammebehandlingKonverter
            sakId={'sak_test' as SakId}
            saksnummer={'202501011001' as Saksnummer}
            behandlingId={'beh_test' as RammebehandlingId}
            til={til}
            alleRammevedtak={alleRammevedtak}
            åpen={true}
            onClose={() => {}}
            onSuccess={onSuccess}
        />,
    );
    return onSuccess;
};

const sendtBody = () => JSON.parse(fetchMock.mock.calls[0][1]?.body as string);

describe('konverteringsalternativer', () => {
    test('tilbyr alle typer bortsett fra den revurderingen allerede har', () => {
        expect(konverteringsalternativer(RevurderingResultat.STANS)).toEqual([
            RevurderingResultat.INNVILGELSE,
            RevurderingResultat.FORLENGELSE,
            RevurderingResultat.OMGJØRING,
        ]);
    });

    test.each([
        RevurderingResultat.OMGJØRING,
        RevurderingResultat.OMGJØRING_OPPHØR,
        RevurderingResultat.OMGJØRING_IKKE_VALGT,
    ])('regner %s som omgjøring', (resultat) => {
        expect(konverteringsalternativer(resultat)).toEqual([
            RevurderingResultat.STANS,
            RevurderingResultat.INNVILGELSE,
            RevurderingResultat.FORLENGELSE,
        ]);
    });
});

describe('RammebehandlingKonverter', () => {
    test('venter på bekreftelse, sender POST til konverter og gir oppdatert sak til onSuccess', async () => {
        const oppdatertSak = sak();
        fetchMock.mockResolvedValue(svar(200, oppdatertSak));
        const onSuccess = renderDialog(RevurderingResultat.INNVILGELSE);

        expect(
            screen.getByRole('dialog', { name: 'Endre revurderingen til innvilgelse?' }),
        ).toBeInTheDocument();
        expect(screen.getByText(/Resultatet du har fylt ut nullstilles/)).toBeInTheDocument();
        expect(fetchMock).not.toHaveBeenCalled();

        fireEvent.click(screen.getByRole('button', { name: 'Endre til innvilgelse' }));

        await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(oppdatertSak));
        expect(fetchMock).toHaveBeenCalledWith(
            '/api/sak/sak_test/behandling/beh_test/konverter',
            expect.objectContaining({ method: 'POST' }),
        );
        expect(sendtBody()).toEqual({
            revurderingType: 'REVURDERING_INNVILGELSE',
            rammevedtakIdSomForlenges: null,
        });
    });

    test('forlengelse krever at saksbehandler velger vedtaket som skal forlenges', async () => {
        fetchMock.mockResolvedValue(svar(200, sak()));
        const onSuccess = renderDialog(RevurderingResultat.FORLENGELSE, [
            rammevedtak('vedtak_ikke_forlengbart', periode('2024-01-01', '2024-03-31')),
            forlengbartVedtak,
        ]);

        const bekreft = screen.getByRole('button', { name: 'Endre til forlengelse' });
        expect(bekreft).toBeDisabled();
        expect(screen.getAllByRole('radio')).toHaveLength(1);

        fireEvent.click(screen.getByRole('radio', { name: /^Forleng fra / }));
        fireEvent.click(bekreft);

        await waitFor(() => expect(onSuccess).toHaveBeenCalled());
        expect(sendtBody()).toEqual({
            revurderingType: 'FORLENGELSE',
            rammevedtakIdSomForlenges: 'vedtak_forlengbart',
        });
    });

    test('forlengelse kan ikke bekreftes når ingen vedtak kan forlenges', () => {
        renderDialog(RevurderingResultat.FORLENGELSE);

        expect(screen.getByText('Ingen vedtak kan forlenges')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Endre til forlengelse' })).toBeDisabled();
    });

    test('lar saksbehandler prøve igjen ved feil som ikke er terminal', async () => {
        fetchMock.mockResolvedValue(svar(400, { melding: 'Noe gikk galt', kode: 'ukjent' }));
        const onSuccess = renderDialog(RevurderingResultat.STANS);

        fireEvent.click(screen.getByRole('button', { name: 'Endre til stans' }));

        expect(await screen.findByText(/kode 400/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Endre til stans' })).toBeInTheDocument();
        expect(onSuccess).not.toHaveBeenCalled();
    });

    test.each([404, 409])(
        '%i (terminal): skjuler bekreftknappen og viser lenke til personoversikten',
        async (status) => {
            fetchMock.mockResolvedValue(svar(status, { melding: 'Feil', kode: 'feil' }));
            renderDialog(RevurderingResultat.OMGJØRING);

            fireEvent.click(screen.getByRole('button', { name: 'Endre til omgjøring' }));

            const lenke = await screen.findByRole('link', { name: 'Gå til personoversikten' });
            expect(lenke).toHaveAttribute('href', expect.stringContaining('202501011001'));
            expect(
                screen.queryByRole('button', { name: 'Endre til omgjøring' }),
            ).not.toBeInTheDocument();
        },
    );

    test('terminal feil beholdes når dialogen lukkes og åpnes igjen', async () => {
        fetchMock.mockResolvedValue(svar(409, { melding: 'Feil', kode: 'feil' }));
        const props = {
            sakId: 'sak_test' as SakId,
            saksnummer: '202501011001' as Saksnummer,
            behandlingId: 'beh_test' as RammebehandlingId,
            til: RevurderingResultat.STANS,
            alleRammevedtak: [],
            onClose: () => {},
            onSuccess: () => {},
        } satisfies Omit<ComponentProps<typeof RammebehandlingKonverter>, 'åpen'>;
        const { rerender } = render(<RammebehandlingKonverter {...props} åpen={true} />);

        fireEvent.click(screen.getByRole('button', { name: 'Endre til stans' }));
        await screen.findByRole('link', { name: 'Gå til personoversikten' });

        fireEvent.click(screen.getAllByRole('button', { name: 'Lukk' }).atNonNull(-1));
        rerender(<RammebehandlingKonverter {...props} åpen={false} />);
        rerender(<RammebehandlingKonverter {...props} åpen={true} />);

        expect(screen.getByRole('link', { name: 'Gå til personoversikten' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Endre til stans' })).not.toBeInTheDocument();
    });
});
