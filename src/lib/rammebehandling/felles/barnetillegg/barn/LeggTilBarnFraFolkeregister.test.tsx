/** @jest-environment jsdom */
import '@testing-library/jest-dom/jest-globals';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import { LeggTilBarnFraFolkeregister } from './LeggTilBarnFraFolkeregister';
import { BarnetilleggBarnSkjema } from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggBarnUtils';
import { BarnetilleggBarnKilde } from '~/lib/rammebehandling/typer/Barnetillegg';
import { skjemaBarn } from '~test/barnetilleggSkjema';
import { ikkeSladdet } from '~test/sladdetVerdi';

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

const fnr = '12345678901';

const person = {
    fnr: ikkeSladdet(fnr),
    fødselsdato: ikkeSladdet('2020-01-01'),
    fornavn: ikkeSladdet('Ola'),
    mellomnavn: ikkeSladdet(null),
    etternavn: ikkeSladdet('Nordmann'),
    fortrolig: false,
    strengtFortrolig: false,
    strengtFortroligUtland: false,
    skjermet: false,
    dødsdato: null,
};

const renderSkjema = (eksisterendeBarn: BarnetilleggBarnSkjema[] = []) => {
    const onLeggTil = jest.fn<(barn: BarnetilleggBarnSkjema) => void>();
    render(
        <LeggTilBarnFraFolkeregister
            sakId={'sak_1'}
            behandlingId={'beh_1'}
            eksisterendeBarn={eksisterendeBarn}
            onLeggTil={onLeggTil}
            onAvbryt={() => {}}
        />,
    );
    fireEvent.change(screen.getByLabelText('Fødselsnummer'), { target: { value: fnr } });
    fireEvent.click(screen.getByRole('button', { name: 'Hent' }));
    return onLeggTil;
};

describe('LeggTilBarnFraFolkeregister', () => {
    test('legger til barnet fra folkeregisteret ved treff', async () => {
        fetchMock.mockResolvedValue(svar(200, person));
        const onLeggTil = renderSkjema();

        expect(await screen.findByText('Ola Nordmann, født 01.01.2020')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Legg til barnet' }));

        expect(onLeggTil).toHaveBeenCalledWith(
            expect.objectContaining({
                fnr: ikkeSladdet(fnr),
                kilde: BarnetilleggBarnKilde.FOLKEREGISTER,
            }),
        );
        expect(String(fetchMock.mock.calls[0]?.[0])).toContain(
            '/sak/sak_1/behandling/beh_1/barn/folkeregister',
        );
    });

    test('viser feilmeldingen fra backend når barnet ikke er søkers barn', async () => {
        fetchMock.mockResolvedValue(
            svar(404, {
                melding: 'Fant ikke barnet blant søkers barn i folkeregisteret',
                kode: 'barn_ikke_funnet',
            }),
        );
        renderSkjema();

        expect(
            await screen.findByText('Fant ikke barnet blant søkers barn i folkeregisteret'),
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Legg til barnet' })).toBeDisabled();
    });

    test('kan ikke legge til et barn som allerede finnes', async () => {
        fetchMock.mockResolvedValue(svar(200, person));
        renderSkjema([{ ...skjemaBarn('2020-01-01'), fnr: ikkeSladdet(fnr) }]);

        expect(await screen.findByText('Barnet finnes allerede i listen')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Legg til barnet' })).toBeDisabled();
    });
});
