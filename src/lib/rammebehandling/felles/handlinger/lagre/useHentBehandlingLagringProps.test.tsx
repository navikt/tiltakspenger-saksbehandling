/** @jest-environment jsdom */
import '@testing-library/jest-dom/jest-globals';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ComponentType } from 'react';
import {
    AppRouterContext,
    AppRouterInstance,
} from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { NotificationProvider } from '~/lib/_felles/notifications/NotificationContext';
import { SakProvider } from '~/lib/sak/SakContext';
import { SakProps } from '~/lib/sak/SakTyper';
import { BehandlingProvider } from '~/lib/rammebehandling/context/BehandlingContext';
import {
    BehandlingSkjemaProvider,
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/lib/rammebehandling/context/BehandlingSkjemaContext';
import { BehandlingSkjemaType } from '~/lib/rammebehandling/context/behandlingSkjemaUtils';
import { SøknadsbehandlingHandlinger } from '~/lib/rammebehandling/søknadsbehandling/handlinger/SøknadsbehandlingHandlinger';
import { RevurderingStansHandlinger } from '~/lib/rammebehandling/revurdering/stans/4-handlinger/RevurderingStansHandlinger';
import { RevurderingInnvilgelseHandlinger } from '~/lib/rammebehandling/revurdering/innvilgelse/handlinger/RevurderingInnvilgelseHandlinger';
import { RevurderingOmgjøringHandlinger } from '~/lib/rammebehandling/revurdering/omgjøring/handlinger/RevurderingOmgjøringHandlinger';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { Avslagsgrunn } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { HjemmelForOpphør, HjemmelForStans } from '~/lib/rammebehandling/typer/Revurdering';
import {
    barnetilleggPeriode,
    omgjøringIkkeValgt,
    omgjøringInnvilgelse,
    omgjøringOpphør,
    periode,
    revurderingInnvilgelse,
    revurderingStans,
    sakMedInnvilgetVedtak,
    søknad,
    søknadBarn,
    søknadsbehandlingAvslag,
    søknadsbehandlingIkkeValgt,
    søknadsbehandlingInnvilgelse,
    innvilgelsesperiodeDTO,
    lagretInnvilgelsesperiode,
} from '~test/rammebehandling';
import { nonNullish } from '~/utils/object';
import { ikkeSladdet } from '~test/sladdetVerdi';

const førsteKvartal = periode('2025-01-01', '2025-03-31');
const førsteHalvår = periode('2025-01-01', '2025-06-30');

const saksbehandle = { gyldigeKommandoer: [SaksbehandlerBehandlingKommando.Saksbehandle] };

const opprinneligFetch = global.fetch;
const opprinneligConsoleError = console.error;

let fetchMock: jest.Mock<typeof fetch>;

beforeEach(() => {
    fetchMock = jest.fn<typeof fetch>();
});

afterEach(() => {
    global.fetch = opprinneligFetch;
    console.error = opprinneligConsoleError;
});

const svar = (status: number, body: unknown) => {
    fetchMock.mockResolvedValue({
        ok: status >= 200 && status < 300,
        status,
        json: async () => body,
    } as Response);
    global.fetch = fetchMock;
};

const sendtBody = (kall = 0) =>
    JSON.parse(nonNullish(fetchMock.mock.calls[kall][1]).body as string);

// Tekstfeltene og skjemavalgene som ellers ligger i andre deler av behandlingssiden
const Skjemafelter = () => {
    const { textAreas } = useBehandlingSkjema();
    const dispatch = useBehandlingSkjemaDispatch();

    return (
        <>
            <textarea aria-label={'Begrunnelse'} ref={textAreas.begrunnelse.ref} />
            <textarea aria-label={'Brevtekst'} ref={textAreas.brevtekst.ref} />
            <textarea
                aria-label={'Begrunnelse barnetillegg'}
                ref={textAreas.barnetilleggBegrunnelse.ref}
            />
            <textarea
                aria-label={'Begrunnelse prioritering'}
                ref={textAreas.prioriteringBegrunnelse.ref}
            />
            <button
                type={'button'}
                onClick={() =>
                    dispatch({
                        superType: BehandlingSkjemaType.Felles,
                        type: 'setErPrioritert',
                        payload: { erPrioritert: true },
                    })
                }
            >
                {'Prioriter'}
            </button>
            <button
                type={'button'}
                onClick={() =>
                    dispatch({
                        superType: BehandlingSkjemaType.Felles,
                        type: 'setSkalSendeVedtaksbrev',
                        payload: { skalSendeVedtaksbrev: false },
                    })
                }
            >
                {'Ikke send vedtaksbrev'}
            </button>
        </>
    );
};

const renderHandlinger = (
    behandling: Rammebehandling,
    Handlinger: ComponentType,
    sak: SakProps = sakMedInnvilgetVedtak(førsteHalvår),
) => {
    const router = { push: jest.fn() } as unknown as AppRouterInstance;

    return render(
        <AppRouterContext.Provider value={router}>
            <NotificationProvider>
                <SakProvider
                    sak={{ ...sak, rammebehandlinger: [...sak.rammebehandlinger, behandling] }}
                >
                    <BehandlingProvider behandlingId={behandling.id} klagebehandling={null}>
                        <BehandlingSkjemaProvider>
                            <Skjemafelter />
                            <Handlinger />
                        </BehandlingSkjemaProvider>
                    </BehandlingProvider>
                </SakProvider>
            </NotificationProvider>
        </AppRouterContext.Provider>,
    );
};

const lagre = () => fireEvent.click(screen.getByRole('button', { name: 'Lagre' }));

const skriv = (felt: string, tekst: string) =>
    fireEvent.input(screen.getByLabelText(felt), { target: { value: tekst } });

const sendTilBeslutterKnapp = () => screen.getByRole('button', { name: 'Send til beslutter' });

describe('lagring av søknadsbehandling', () => {
    test('sender innvilgelse med barnetillegg og tekstene fra skjemaet', async () => {
        const behandling = søknadsbehandlingInnvilgelse({
            ...saksbehandle,
            søknad: søknad([søknadBarn('2020-05-05')]),
            barnetillegg: {
                perioder: [barnetilleggPeriode(1, førsteKvartal)],
                begrunnelse: ikkeSladdet('Lagret begrunnelse for barnetillegg'),
            },
            skalJournalføreNotat: { vilkårsvurdering: true, barnetillegg: true },
        });
        svar(200, behandling);

        renderHandlinger(behandling, SøknadsbehandlingHandlinger);

        skriv('Begrunnelse', '  Vilkårene er oppfylt  ');
        skriv('Brevtekst', '   ');
        lagre();

        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        expect(fetchMock.mock.calls[0][0]).toBe('/api/sak/sak_1/behandling/beh_1/oppdater');
        expect(fetchMock.mock.calls[0][1]?.method).toBe('POST');
        expect(sendtBody()).toEqual({
            resultat: 'INNVILGELSE',
            begrunnelseVilkårsvurdering: 'Vilkårene er oppfylt',
            fritekstTilVedtaksbrev: null,
            skalJournalføreNotat: { vilkårsvurdering: true, barnetillegg: true },
            prioritering: null,
            innvilgelsesperioder: [innvilgelsesperiodeDTO(førsteKvartal)],
            barnetillegg: {
                begrunnelse: 'Lagret begrunnelse for barnetillegg',
                perioder: [barnetilleggPeriode(1, førsteKvartal)],
            },
            skalSendeVedtaksbrev: true,
        });
    });

    test('sender ikke barnetillegg, begrunnelse eller journalføring av barnetillegg-notat når barnetillegg ikke er innvilget', async () => {
        const behandling = søknadsbehandlingInnvilgelse({
            ...saksbehandle,
            barnetillegg: {
                // Perioder uten barn regnes ikke som innvilget barnetillegg
                perioder: [barnetilleggPeriode(0, førsteKvartal)],
                begrunnelse: ikkeSladdet('Gammel begrunnelse'),
            },
            skalJournalføreNotat: { vilkårsvurdering: false, barnetillegg: true },
        });
        svar(200, behandling);

        renderHandlinger(behandling, SøknadsbehandlingHandlinger);
        lagre();

        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        expect(sendtBody()).toMatchObject({
            barnetillegg: { begrunnelse: null, perioder: [] },
            skalJournalføreNotat: { vilkårsvurdering: false, barnetillegg: false },
        });
    });

    test('sender avslag med avslagsgrunner og valgt vedtaksbrev', async () => {
        const behandling = søknadsbehandlingAvslag({
            ...saksbehandle,
            avslagsgrunner: [Avslagsgrunn.Alder, Avslagsgrunn.Livsoppholdytelser],
            begrunnelseVilkårsvurdering: ikkeSladdet('For gammel'),
        });
        svar(200, behandling);

        renderHandlinger(behandling, SøknadsbehandlingHandlinger);
        fireEvent.click(screen.getByRole('button', { name: 'Ikke send vedtaksbrev' }));
        lagre();

        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        expect(sendtBody()).toEqual({
            resultat: 'AVSLAG',
            avslagsgrunner: ['Alder', 'Livsoppholdytelser'],
            begrunnelseVilkårsvurdering: 'For gammel',
            fritekstTilVedtaksbrev: null,
            skalJournalføreNotat: { vilkårsvurdering: false, barnetillegg: false },
            prioritering: null,
            skalSendeVedtaksbrev: false,
        });
    });

    test('lagrer behandling uten valgt resultat, med advarsel om at resultatet mangler', async () => {
        const behandling = søknadsbehandlingIkkeValgt(saksbehandle);
        svar(200, behandling);

        renderHandlinger(behandling, SøknadsbehandlingHandlinger);
        skriv('Begrunnelse', 'Påbegynt vurdering');
        lagre();

        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        expect(sendtBody()).toEqual({
            resultat: 'IKKE_VALGT',
            begrunnelseVilkårsvurdering: 'Påbegynt vurdering',
            fritekstTilVedtaksbrev: null,
            skalJournalføreNotat: { vilkårsvurdering: false, barnetillegg: false },
            prioritering: null,
        });
        expect(screen.getByText('Advarsel')).toBeInTheDocument();
        expect(screen.getByText('Behandlingsresultat mangler')).toBeInTheDocument();
    });

    test('lagrer ikke når valideringen feiler, og viser feilene', () => {
        const behandling = søknadsbehandlingAvslag({ ...saksbehandle, avslagsgrunner: [] });
        svar(200, behandling);

        renderHandlinger(behandling, SøknadsbehandlingHandlinger);
        lagre();

        expect(fetchMock).not.toHaveBeenCalled();
        expect(screen.getByText('Feil i behandlingen')).toBeInTheDocument();
        expect(screen.getByText('Avslagsgrunn må velges')).toBeInTheDocument();
        expect(sendTilBeslutterKnapp()).toBeDisabled();
    });

    test('viser feilmeldingen fra backend når lagringen feiler', async () => {
        console.error = jest.fn();
        const behandling = søknadsbehandlingIkkeValgt(saksbehandle);
        svar(500, { kode: 'ukjent_feil', melding: 'Noe gikk galt' });

        renderHandlinger(behandling, SøknadsbehandlingHandlinger);
        lagre();

        expect(
            await screen.findByText('Feil ved lagring: Noe gikk galt (kode 500)'),
        ).toBeInTheDocument();
    });
});

describe('prioritering', () => {
    test('krever begrunnelse for prioriteringen før lagring', () => {
        const behandling = søknadsbehandlingIkkeValgt(saksbehandle);
        svar(200, behandling);

        renderHandlinger(behandling, SøknadsbehandlingHandlinger);
        fireEvent.click(screen.getByRole('button', { name: 'Prioriter' }));
        lagre();

        expect(fetchMock).not.toHaveBeenCalled();
        expect(
            screen.getByText(
                'Begrunnelsen for prioriteringen må være utfylt når behandlingen er prioritert',
            ),
        ).toBeInTheDocument();
    });

    test('sender begrunnelsen for prioriteringen', async () => {
        const behandling = søknadsbehandlingIkkeValgt(saksbehandle);
        svar(200, behandling);

        renderHandlinger(behandling, SøknadsbehandlingHandlinger);
        fireEvent.click(screen.getByRole('button', { name: 'Prioriter' }));
        skriv('Begrunnelse prioritering', ' Haster ');
        lagre();

        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        expect(sendtBody().prioritering).toEqual({ begrunnelse: 'Haster' });
    });
});

describe('ulagrede endringer', () => {
    test('viser at behandlingen er lagret når skjemaet er uendret', () => {
        renderHandlinger(søknadsbehandlingIkkeValgt(saksbehandle), SøknadsbehandlingHandlinger);

        expect(screen.getByText('Behandlingen er lagret')).toBeInTheDocument();
        expect(sendTilBeslutterKnapp()).toBeEnabled();
    });

    test('endringer i tekstfelt må lagres før sending til beslutter, men ikke hvis teksten endres tilbake', () => {
        const behandling = søknadsbehandlingIkkeValgt({
            ...saksbehandle,
            begrunnelseVilkårsvurdering: ikkeSladdet('Lagret begrunnelse'),
        });

        renderHandlinger(behandling, SøknadsbehandlingHandlinger);

        skriv('Begrunnelse', 'Ny begrunnelse');
        expect(
            screen.getByText('Endringer må lagres før behandlingen kan sendes til beslutter'),
        ).toBeInTheDocument();
        expect(sendTilBeslutterKnapp()).toBeDisabled();

        skriv('Begrunnelse', 'Lagret begrunnelse ');
        expect(screen.getByText('Behandlingen er lagret')).toBeInTheDocument();
        expect(sendTilBeslutterKnapp()).toBeEnabled();
    });

    test('endringer i skjemavalg må lagres, og er lagret etter vellykket lagring', async () => {
        const behandling = søknadsbehandlingAvslag(saksbehandle);
        svar(200, {
            ...behandling,
            skalSendeVedtaksbrev: false,
            sistEndret: '2025-01-02T09:00:00',
        });

        renderHandlinger(behandling, SøknadsbehandlingHandlinger);
        fireEvent.click(screen.getByRole('button', { name: 'Ikke send vedtaksbrev' }));

        expect(
            screen.getByText('Endringer må lagres før behandlingen kan sendes til beslutter'),
        ).toBeInTheDocument();

        lagre();

        // Skjemaet bygges på nytt fra behandlingen backend svarte med
        expect(await screen.findByText('Sist lagret: 02.01.2025 kl. 09:00')).toBeInTheDocument();
        expect(screen.getByText('Behandlingen er lagret')).toBeInTheDocument();
        expect(sendTilBeslutterKnapp()).toBeEnabled();
    });
});

describe('sending til beslutter', () => {
    test('krever valgt resultat', () => {
        renderHandlinger(søknadsbehandlingIkkeValgt(saksbehandle), SøknadsbehandlingHandlinger);

        fireEvent.click(sendTilBeslutterKnapp());

        expect(screen.getByText('Behandlingsresultat mangler')).toBeInTheDocument();
        expect(sendTilBeslutterKnapp()).toBeDisabled();
    });

    test('krever begrunnelse når vilkårsvurderingen skal journalføres som notat, uten å kreve det ved lagring', async () => {
        const behandling = søknadsbehandlingAvslag({
            ...saksbehandle,
            skalJournalføreNotat: { vilkårsvurdering: true, barnetillegg: false },
        });
        svar(200, behandling);

        renderHandlinger(behandling, SøknadsbehandlingHandlinger);

        lagre();
        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

        fireEvent.click(sendTilBeslutterKnapp());
        expect(
            screen.getByText('Begrunnelsen må være utfylt når notatet skal journalføres'),
        ).toBeInTheDocument();
    });

    test('krever begrunnelse for barnetillegg når den skal journalføres som notat', () => {
        const behandling = søknadsbehandlingInnvilgelse({
            ...saksbehandle,
            søknad: søknad([søknadBarn('2020-05-05')]),
            barnetillegg: {
                perioder: [barnetilleggPeriode(1, førsteKvartal)],
                begrunnelse: ikkeSladdet(null),
            },
            begrunnelseVilkårsvurdering: ikkeSladdet('Vilkårene er oppfylt'),
            skalJournalføreNotat: { vilkårsvurdering: true, barnetillegg: true },
        });

        renderHandlinger(behandling, SøknadsbehandlingHandlinger);
        fireEvent.click(sendTilBeslutterKnapp());

        expect(
            screen.getByText(
                'Begrunnelsen for barnetillegg må være utfylt når den skal journalføres som notat',
            ),
        ).toBeInTheDocument();
        expect(
            screen.queryByText('Begrunnelsen må være utfylt når notatet skal journalføres'),
        ).not.toBeInTheDocument();
    });
});

describe('lagring av revurdering', () => {
    test('sender stans fra første dag som gir rett uten dato', async () => {
        const behandling = revurderingStans({
            ...saksbehandle,
            vedtaksperiode: førsteHalvår,
            harValgtStansFraFørsteDagSomGirRett: true,
            valgtHjemmelHarIkkeRettighet: [HjemmelForStans.Alder],
        });
        svar(200, behandling);

        renderHandlinger(behandling, RevurderingStansHandlinger);
        lagre();

        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        expect(sendtBody()).toEqual({
            resultat: 'STANS',
            begrunnelseVilkårsvurdering: null,
            fritekstTilVedtaksbrev: null,
            skalJournalføreNotat: { vilkårsvurdering: false, barnetillegg: false },
            prioritering: null,
            valgteHjemler: ['Alder'],
            stansFraOgMed: null,
            harValgtStansFraFørsteDagSomGirRett: true,
            skalSendeVedtaksbrev: true,
        });
    });

    test('sender stans fra valgt dato', async () => {
        const behandling = revurderingStans({
            ...saksbehandle,
            vedtaksperiode: periode('2025-03-01', '2025-06-30'),
            harValgtStansFraFørsteDagSomGirRett: false,
            valgtHjemmelHarIkkeRettighet: [HjemmelForStans.Livsoppholdytelser],
        });
        svar(200, behandling);

        renderHandlinger(behandling, RevurderingStansHandlinger);
        lagre();

        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        expect(sendtBody()).toMatchObject({
            valgteHjemler: ['Livsoppholdytelser'],
            stansFraOgMed: '2025-03-01',
            harValgtStansFraFørsteDagSomGirRett: false,
        });
    });

    test('lagrer ikke stans uten hjemmel', () => {
        const behandling = revurderingStans({
            ...saksbehandle,
            vedtaksperiode: førsteHalvår,
            valgtHjemmelHarIkkeRettighet: [],
        });
        svar(200, behandling);

        renderHandlinger(behandling, RevurderingStansHandlinger);
        lagre();

        expect(fetchMock).not.toHaveBeenCalled();
        expect(
            screen.getByText(
                'Du må velge en hjemmel som begrunnelse for hvorfor tiltakspengene stanses.',
            ),
        ).toBeInTheDocument();
    });

    test('sender revurdering til innvilgelse med innvilgelsesperiodene', async () => {
        const behandling = revurderingInnvilgelse({
            ...saksbehandle,
            vedtaksperiode: førsteHalvår,
            innvilgelsesperioder: [lagretInnvilgelsesperiode(førsteHalvår)],
            barnetillegg: { perioder: [], begrunnelse: ikkeSladdet(null) },
        });
        svar(200, behandling);

        renderHandlinger(behandling, RevurderingInnvilgelseHandlinger);
        skriv('Brevtekst', 'Du får tiltakspenger');
        lagre();

        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        expect(sendtBody()).toEqual({
            resultat: 'REVURDERING_INNVILGELSE',
            begrunnelseVilkårsvurdering: null,
            fritekstTilVedtaksbrev: 'Du får tiltakspenger',
            skalJournalføreNotat: { vilkårsvurdering: false, barnetillegg: false },
            prioritering: null,
            innvilgelsesperioder: [innvilgelsesperiodeDTO(førsteHalvår)],
            barnetillegg: { begrunnelse: null, perioder: [] },
            skalSendeVedtaksbrev: true,
        });
    });

    test('sender omgjøring til innvilgelse med vedtaksperioden', async () => {
        const behandling = omgjøringInnvilgelse({
            ...saksbehandle,
            vedtaksperiode: førsteHalvår,
            innvilgelsesperioder: [lagretInnvilgelsesperiode(førsteHalvår)],
            barnetillegg: { perioder: [], begrunnelse: ikkeSladdet(null) },
        });
        svar(200, behandling);

        renderHandlinger(behandling, RevurderingOmgjøringHandlinger);
        lagre();

        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        expect(sendtBody()).toEqual({
            resultat: 'OMGJØRING',
            begrunnelseVilkårsvurdering: null,
            fritekstTilVedtaksbrev: null,
            skalJournalføreNotat: { vilkårsvurdering: false, barnetillegg: false },
            prioritering: null,
            innvilgelsesperioder: [innvilgelsesperiodeDTO(førsteHalvår)],
            vedtaksperiode: førsteHalvår,
            barnetillegg: { begrunnelse: null, perioder: [] },
            skalSendeVedtaksbrev: true,
        });
    });

    test('sender opphør med perioden og hjemlene', async () => {
        const behandling = omgjøringOpphør({
            ...saksbehandle,
            vedtaksperiode: førsteKvartal,
            valgteHjemler: [HjemmelForOpphør.DeltarIkkePåArbeidsmarkedstiltak],
        });
        svar(200, behandling);

        renderHandlinger(behandling, RevurderingOmgjøringHandlinger);
        skriv('Begrunnelse', 'Deltok ikke');
        lagre();

        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        expect(sendtBody()).toEqual({
            resultat: 'OMGJØRING_OPPHØR',
            begrunnelseVilkårsvurdering: 'Deltok ikke',
            fritekstTilVedtaksbrev: null,
            skalJournalføreNotat: { vilkårsvurdering: false, barnetillegg: false },
            prioritering: null,
            vedtaksperiode: førsteKvartal,
            valgteHjemler: ['DeltarIkkePåArbeidsmarkedstiltak'],
            skalSendeVedtaksbrev: true,
        });
    });

    test('sender omgjøring uten valgt resultat uten tekster', async () => {
        const behandling = omgjøringIkkeValgt(saksbehandle);
        svar(200, behandling);

        renderHandlinger(behandling, RevurderingOmgjøringHandlinger);
        lagre();

        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        expect(sendtBody()).toEqual({
            resultat: 'OMGJØRING_IKKE_VALGT',
            begrunnelseVilkårsvurdering: null,
            fritekstTilVedtaksbrev: null,
            skalJournalføreNotat: { vilkårsvurdering: false, barnetillegg: false },
            prioritering: null,
        });
    });
});
