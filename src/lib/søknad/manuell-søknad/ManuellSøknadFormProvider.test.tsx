/** @jest-environment jsdom */
import '@testing-library/jest-dom/jest-globals';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useFormContext } from 'react-hook-form';
import {
    ManuellSøknadFormProvider,
    useManuellSøknadForm,
} from '~/lib/søknad/manuell-søknad/ManuellSøknadFormProvider';
import {
    ManuellSøknadBarn,
    ManueltRegistrertSøknad,
} from '~/lib/søknad/manuell-søknad/ManueltRegistrertSøknad';
import { Personopplysninger } from '~/lib/personaliaheader/useHentPersonopplysninger';
import { tilSaksnummer } from '~/lib/sak/Saksnummer';
import { nonNullish } from '~/utils/object';
import { ikkeSladdet } from '~test/sladdetVerdi';

const personopplysninger: Personopplysninger = {
    fnr: ikkeSladdet('12345678911'),
    fødselsdato: ikkeSladdet('1990-01-01'),
    fornavn: ikkeSladdet('Ola'),
    mellomnavn: ikkeSladdet(null),
    etternavn: ikkeSladdet('Nordmann'),
    fortrolig: false,
    strengtFortrolig: false,
    strengtFortroligUtland: false,
    skjermet: false,
    dødsdato: ikkeSladdet(null),
};

const barn = (uuid: string, overstyringer: Partial<ManuellSøknadBarn> = {}): ManuellSøknadBarn => ({
    uuid,
    fornavn: uuid,
    etternavn: 'Nordmann',
    fødselsdato: '2020-01-01',
    ...overstyringer,
});

const opprinneligFetch = global.fetch;
let fetchMock: jest.Mock<typeof fetch>;

beforeEach(() => {
    // Svarer med null slik at providern ikke prøver å navigere til en behandling.
    fetchMock = jest.fn<typeof fetch>().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => null,
    } as Response);
    global.fetch = fetchMock;
});

afterEach(() => {
    global.fetch = opprinneligFetch;
});

const sendtBody = (): ManueltRegistrertSøknad =>
    JSON.parse(nonNullish(fetchMock.mock.calls[0][1]).body as string);

const Skjema = ({ verdier }: { verdier: Partial<ManueltRegistrertSøknad['svar']> }) => {
    const { setValue } = useFormContext<ManueltRegistrertSøknad>();
    const { onSubmit } = useManuellSøknadForm();

    return (
        <button
            onClick={() => {
                setValue('journalpostId', '123456789');
                setValue('antallVedlegg', 99);
                Object.entries(verdier).forEach(([felt, verdi]) =>
                    setValue(`svar.${felt}` as 'svar', verdi as never),
                );
                void onSubmit();
            }}
        >
            Send inn
        </button>
    );
};

const sendInn = (
    verdier: Partial<ManueltRegistrertSøknad['svar']>,
    { medPersonopplysninger = true } = {},
) => {
    render(
        <ManuellSøknadFormProvider
            saksnummer={tilSaksnummer('202501011001')}
            personopplysninger={medPersonopplysninger ? personopplysninger : undefined}
        >
            <Skjema verdier={verdier} />
        </ManuellSøknadFormProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Send inn' }));
};

describe('ManuellSøknadFormProvider', () => {
    test('sender søknaden til sakens søknad-endepunkt', async () => {
        sendInn({});

        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        expect(fetchMock.mock.calls[0][0]).toBe('/api/sak/202501011001/soknad');
        expect(fetchMock.mock.calls[0][1]?.method).toBe('POST');
        expect(sendtBody()).toMatchObject({
            journalpostId: '123456789',
            svar: { barnetilleggPdl: [], barnetilleggManuelle: [] },
        });
    });

    test('sender bare med barn fra PDL som det er svart ja på barnetillegg for', async () => {
        sendInn({
            barnetilleggPdl: [
                barn('ja', { erSøktBarnetilleggFor: { svar: 'JA' } }),
                barn('nei', { erSøktBarnetilleggFor: { svar: 'NEI' } }),
                barn('ikke-besvart', { erSøktBarnetilleggFor: { svar: 'IKKE_BESVART' } }),
                barn('uten-svar'),
            ],
        });

        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        expect(sendtBody().svar.barnetilleggPdl.map((b) => b.uuid)).toEqual(['ja']);
    });

    test('beholder alle manuelt registrerte barn', async () => {
        const manuelle = [barn('manuell-1'), barn('manuell-2')];
        sendInn({ barnetilleggManuelle: manuelle });

        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        expect(sendtBody().svar.barnetilleggManuelle).toEqual(manuelle);
    });

    test('antall vedlegg er summen av vedleggene for de manuelt registrerte barna', async () => {
        sendInn({
            barnetilleggManuelle: [
                barn('manuell-1', { manueltRegistrertBarnAntallVedlegg: 2 }),
                barn('manuell-2'),
                barn('manuell-3', { manueltRegistrertBarnAntallVedlegg: 3 }),
            ],
        });

        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        expect(sendtBody().antallVedlegg).toBe(5);
    });

    test('antall vedlegg er 0 uten manuelt registrerte barn', async () => {
        sendInn({});

        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        expect(sendtBody().antallVedlegg).toBe(0);
    });

    test('sender ikke inn uten personopplysninger', async () => {
        sendInn({}, { medPersonopplysninger: false });

        // Lar den asynkrone handleSubmit bli ferdig før vi sjekker at ingenting ble sendt.
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(fetchMock).not.toHaveBeenCalled();
    });
});
