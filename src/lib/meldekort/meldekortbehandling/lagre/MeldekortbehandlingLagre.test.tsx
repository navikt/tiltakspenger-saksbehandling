/** @jest-environment jsdom */
import '@testing-library/jest-dom/jest-globals';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SakProvider } from '~/lib/sak/SakContext';
import { SakProps } from '~/lib/sak/SakTyper';
import {
    MeldekortbehandlingProvider,
    useMeldekortbehandlingSkjema,
    useMeldekortbehandlingSkjemaDispatch,
} from '~/lib/meldekort/meldekortbehandling/context/MeldekortbehandlingContext';
import { MeldekortbehandlingLagre } from '~/lib/meldekort/meldekortbehandling/lagre/MeldekortbehandlingLagre';
import {
    MeldekortbehandlingDagStatus,
    MeldekortbehandlingProps,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { sak } from '~test/rammebehandling';
import { ikkeSladdet } from '~test/sladdetVerdi';
import { nonNullish } from '~/utils/object';
import {
    FØRSTE_MANDAG,
    kjedeIdFor,
    meldekortbehandling,
    meldekortDager,
    meldeperiodebehandling,
} from '~test/meldekort';
import { tilTidspunkt } from '~/types/DatoTid';

const { DeltattUtenLønnITiltaket, IkkeBesvart } = MeldekortbehandlingDagStatus;

const kjedeId = kjedeIdFor(FØRSTE_MANDAG);
const ULAGREDE_ENDRINGER = /Det finnes ulagrede endringer/;

const opprinneligFetch = global.fetch;
const fetchMock = jest.fn<typeof fetch>();

beforeEach(() => {
    global.fetch = fetchMock;
});

afterEach(() => {
    global.fetch = opprinneligFetch;
});

const sakMedBehandling = (behandling: MeldekortbehandlingProps): SakProps =>
    sak({ meldekortbehandlinger: { [behandling.id]: behandling } });

// Minimale skjemafelter koblet til den ekte konteksten, slik de ekte komponentene gjør
const Skjemafelter = () => {
    const skjema = useMeldekortbehandlingSkjema();
    const dispatch = useMeldekortbehandlingSkjemaDispatch();

    const settFørsteDag = (status: MeldekortbehandlingDagStatus) =>
        dispatch({ type: 'oppdaterDagStatus', payload: { kjedeId, dagIndex: 0, status } });

    return (
        <>
            <textarea aria-label={'Begrunnelse'} ref={skjema.begrunnelse.ref} />
            <textarea aria-label={'Brevtekst'} ref={skjema.brevtekst.ref} />
            <textarea
                aria-label={'Prioriteringsbegrunnelse'}
                ref={skjema.prioriteringBegrunnelse.ref}
            />
            <button type={'button'} onClick={() => settFørsteDag(DeltattUtenLønnITiltaket)}>
                {'Deltatt første dag'}
            </button>
            <button type={'button'} onClick={() => settFørsteDag(IkkeBesvart)}>
                {'Nullstill første dag'}
            </button>
            <button
                type={'button'}
                onClick={() =>
                    dispatch({ type: 'setErPrioritert', payload: { erPrioritert: true } })
                }
            >
                {'Prioriter'}
            </button>
            <button
                type={'button'}
                onClick={() =>
                    dispatch({
                        type: 'setSkalJournalføreNotat',
                        payload: { skalJournalføreNotat: true },
                    })
                }
            >
                {'Journalfør notat'}
            </button>
            <p>{`Skrivebeskyttet: ${skjema.erReadonly}`}</p>
            <p>{`Kan endre journalføring: ${skjema.kanEndreSkalJournalføreNotat}`}</p>
        </>
    );
};

const renderLagring = (behandling: MeldekortbehandlingProps = meldekortbehandling()) =>
    render(
        <SakProvider sak={sakMedBehandling(behandling)}>
            <MeldekortbehandlingProvider id={behandling.id}>
                <Skjemafelter />
                <MeldekortbehandlingLagre />
            </MeldekortbehandlingProvider>
        </SakProvider>,
    );

const skrivI = (label: string, value: string) =>
    fireEvent.input(screen.getByLabelText(label), { target: { value } });

const klikk = (name: string) => fireEvent.click(screen.getByRole('button', { name }));

const lagreKnapp = () => screen.getByRole('button', { name: 'Lagre og oppdater beregning' });

describe('lagring av meldekortbehandling', () => {
    test('viser sist lagret uten ulagrede endringer når skjemaet er likt behandlingen', () => {
        renderLagring();

        expect(screen.getByText('Sist lagret: 20.01.2025 kl. 09:00:00')).toBeInTheDocument();
        expect(screen.queryByText(ULAGREDE_ENDRINGER)).not.toBeInTheDocument();
        expect(lagreKnapp()).toBeEnabled();
    });

    test('en endret dag gir ulagrede endringer, som forsvinner når dagen endres tilbake', () => {
        renderLagring();

        klikk('Deltatt første dag');
        expect(screen.getByText(ULAGREDE_ENDRINGER)).toBeInTheDocument();

        klikk('Nullstill første dag');
        expect(screen.queryByText(ULAGREDE_ENDRINGER)).not.toBeInTheDocument();
    });

    test('fritekst gir ulagrede endringer, men ikke når den kun består av mellomrom', () => {
        renderLagring();

        skrivI('Brevtekst', '   ');
        expect(screen.queryByText(ULAGREDE_ENDRINGER)).not.toBeInTheDocument();

        skrivI('Brevtekst', 'Tekst til brevet');
        expect(screen.getByText(ULAGREDE_ENDRINGER)).toBeInTheDocument();
    });

    test('lagrede fritekster fylles inn i feltene, og fjerning av dem gir ulagrede endringer', () => {
        renderLagring(
            meldekortbehandling({
                begrunnelse: ikkeSladdet('Lagret begrunnelse'),
                prioritering: { begrunnelse: ikkeSladdet('Haster') },
            }),
        );

        expect(screen.getByLabelText('Begrunnelse')).toHaveValue('Lagret begrunnelse');
        expect(screen.getByLabelText('Prioriteringsbegrunnelse')).toHaveValue('Haster');
        expect(screen.queryByText(ULAGREDE_ENDRINGER)).not.toBeInTheDocument();

        skrivI('Prioriteringsbegrunnelse', '');
        expect(screen.getByText(ULAGREDE_ENDRINGER)).toBeInTheDocument();
    });

    test('sender hele skjemaet ved lagring, og er lagret når backend svarer med oppdatert sak', async () => {
        const behandling = meldekortbehandling();
        const oppdatertBehandling = meldekortbehandling({
            sistEndret: tilTidspunkt('2025-01-20T10:15:30'),
            meldeperioder: [
                meldeperiodebehandling(FØRSTE_MANDAG, {
                    dager: meldekortDager(FØRSTE_MANDAG, (_, index) =>
                        index === 0 ? DeltattUtenLønnITiltaket : IkkeBesvart,
                    ),
                }),
            ],
            begrunnelse: ikkeSladdet('Begrunnelse'),
            tekstTilVedtaksbrev: ikkeSladdet('Brevtekst'),
            skalJournalføreNotat: true,
            prioritering: { begrunnelse: ikkeSladdet('Haster') },
        });
        fetchMock.mockResolvedValue({
            ok: true,
            json: async () => sakMedBehandling(oppdatertBehandling),
        } as Response);

        renderLagring(behandling);

        klikk('Deltatt første dag');
        klikk('Prioriter');
        klikk('Journalfør notat');
        skrivI('Begrunnelse', '  Begrunnelse \n');
        skrivI('Brevtekst', 'Brevtekst');
        skrivI('Prioriteringsbegrunnelse', 'Haster');

        fireEvent.click(lagreKnapp());

        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        const [url, init] = nonNullish(fetchMock.mock.calls[0]);
        expect(url).toBe(`/api/sak/sak_1/meldekort/${behandling.id}/oppdater`);
        expect(init?.method).toBe('POST');
        expect(JSON.parse(init?.body as string)).toEqual({
            meldeperioder: [
                {
                    kjedeId,
                    dager: meldekortDager(FØRSTE_MANDAG, (_, index) =>
                        index === 0 ? DeltattUtenLønnITiltaket : IkkeBesvart,
                    ),
                },
            ],
            skalSendeVedtaksbrev: true,
            skalJournalføreNotat: true,
            begrunnelse: 'Begrunnelse',
            tekstTilVedtaksbrev: 'Brevtekst',
            prioritering: { begrunnelse: 'Haster' },
        });

        expect(await screen.findByText('Sist lagret: 20.01.2025 kl. 10:15:30')).toBeInTheDocument();
        expect(screen.queryByText(ULAGREDE_ENDRINGER)).not.toBeInTheDocument();
        expect(screen.getByLabelText('Begrunnelse')).toHaveValue('Begrunnelse');
    });

    test('viser feilen fra backend og beholder ulagrede endringer når lagring feiler', async () => {
        fetchMock.mockResolvedValue({
            ok: false,
            status: 400,
            json: async () => ({ kode: 'for_mange_dager_utfylt', melding: 'For mange dager' }),
        } as Response);
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

        try {
            renderLagring();
            klikk('Deltatt første dag');
            fireEvent.click(lagreKnapp());

            expect(
                await screen.findByText(
                    'Feil ved lagring: Det er fylt ut flere dager enn tillatt på dette meldekortet (kode 400)',
                ),
            ).toBeInTheDocument();
            expect(screen.getByText(ULAGREDE_ENDRINGER)).toBeInTheDocument();
        } finally {
            consoleError.mockRestore();
        }
    });

    test.each([
        {
            kommandoer: [SaksbehandlerBehandlingKommando.Saksbehandle],
            skrivebeskyttet: false,
            kanEndre: true,
        },
        {
            kommandoer: [SaksbehandlerBehandlingKommando.Beslutte],
            skrivebeskyttet: true,
            kanEndre: true,
        },
        { kommandoer: [], skrivebeskyttet: true, kanEndre: false },
    ])(
        'med kommandoene $kommandoer er skjemaet skrivebeskyttet=$skrivebeskyttet og kan endre journalføring=$kanEndre',
        ({ kommandoer, skrivebeskyttet, kanEndre }) => {
            renderLagring(meldekortbehandling({ gyldigeKommandoer: kommandoer }));

            expect(screen.getByText(`Skrivebeskyttet: ${skrivebeskyttet}`)).toBeInTheDocument();
            expect(screen.getByText(`Kan endre journalføring: ${kanEndre}`)).toBeInTheDocument();
            if (skrivebeskyttet) {
                expect(lagreKnapp()).toBeDisabled();
            } else {
                expect(lagreKnapp()).toBeEnabled();
            }
        },
    );
});
