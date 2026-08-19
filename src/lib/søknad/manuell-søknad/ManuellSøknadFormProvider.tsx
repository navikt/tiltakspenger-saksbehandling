import React, { createContext, useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import router from 'next/router';
import { ManueltRegistrertSøknad } from '~/lib/søknad/manuell-søknad/ManueltRegistrertSøknad';
import { useOpprettSøknad } from '~/lib/personoversikt/opprett-behandling/manuell-søknad/useOpprettSøknad';
import { Personopplysninger } from '~/lib/personaliaheader/useHentPersonopplysninger';
import { behandlingUrl } from '~/utils/urls';
import { FetcherError } from '~/utils/fetch/fetch';

type ContextState = {
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    opprettSøknadLaster: boolean;
    opprettSøknadError?: FetcherError;
};

const Context = createContext<ContextState>({} as ContextState);

type Props = React.PropsWithChildren<{
    saksnummer: string;
    personopplysninger?: Personopplysninger;
}>;

export const ManuellSøknadFormProvider = ({ saksnummer, personopplysninger, children }: Props) => {
    const formContext = useForm<ManueltRegistrertSøknad>({
        defaultValues: initialSøknadValues,
        mode: 'onSubmit',
    });

    const { opprettSøknad, opprettSøknadLaster, opprettSøknadError } = useOpprettSøknad(saksnummer);

    const onSubmit = formContext.handleSubmit((data) => {
        if (!personopplysninger) return;

        // Sender ikke inn barn fra PDL som man har svart nei for.
        const pdlBarnDetErSøktBarnetilleggFor = data.svar.barnetilleggPdl.filter(
            (barn) => barn.erSøktBarnetilleggFor?.svar === 'JA',
        );

        const antallVedlegg = (data.svar.barnetilleggManuelle || []).reduce(
            (sum, b) => sum + (b.manueltRegistrertBarnAntallVedlegg ?? 0),
            0,
        );

        opprettSøknad({
            ...data,
            svar: {
                ...data.svar,
                barnetilleggPdl: pdlBarnDetErSøktBarnetilleggFor,
            },
            antallVedlegg,
        }).then((behandling) => {
            if (behandling) {
                router.push(behandlingUrl(behandling));
            }
        });
    });

    return (
        <FormProvider {...formContext}>
            <Context.Provider value={{ onSubmit, opprettSøknadLaster, opprettSøknadError }}>
                {children}
            </Context.Provider>
        </FormProvider>
    );
};

export const useManuellSøknadForm = () => {
    return useContext(Context);
};

const initialSøknadValues: ManueltRegistrertSøknad = {
    journalpostId: '',
    manueltSattSøknadsperiode: undefined,
    antallVedlegg: 0,
    søknadstype: undefined,
    overfortFraArena: undefined,
    svar: {
        harSøktPåTiltak: undefined,
        tiltak: undefined,
        barnetilleggPdl: [],
        barnetilleggManuelle: [],
        institusjon: {},
        intro: {},
        kvp: {},
        sykepenger: {},
        gjenlevendepensjon: {},
        alderspensjon: {},
        supplerendeStønadAlder: {},
        supplerendeStønadFlyktning: {},
        trygdOgPensjon: {},
        etterlønn: {},
        jobbsjansen: {},
        harSøktOmBarnetillegg: undefined,
        mottarAndreUtbetalinger: undefined,
        barnetilleggKladd: undefined,
    },
};
