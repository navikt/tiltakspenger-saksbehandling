import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import {
    MeldekortbehandlingForm,
    useCustomMeldekortUtfyllingValidationResolver,
} from '~/components/meldekort/2-hovedseksjon/behandling/utfylling/meldekortUtfyllingUtils';
import { MeldekortbehandlingProps } from '~/types/meldekort/Meldekortbehandling';
import { useMeldeperiodeKjede } from '~/components/meldekort/context/MeldeperiodeKjedeContext';
import { PropsWithChildren, useEffect } from 'react';
import { hentMeldekortForhåndsutfylling } from '~/components/meldekort/0-felles-komponenter/meldekortForhåndsutfyllingUtils';
import { Nullable } from '~/types/UtilTypes';

export const MeldekortbehandlingFormProvider = ({ children }: PropsWithChildren) => {
    const { sisteMeldekortbehandling } = useMeldeperiodeKjede();

    if (!sisteMeldekortbehandling) {
        return children;
    }

    return (
        <MeldekortbehandlingFormProviderInner meldekortbehandling={sisteMeldekortbehandling}>
            {children}
        </MeldekortbehandlingFormProviderInner>
    );
};

type Props = PropsWithChildren<{
    meldekortbehandling: MeldekortbehandlingProps;
}>;

const MeldekortbehandlingFormProviderInner = ({ meldekortbehandling, children }: Props) => {
    const { meldeperiodeKjede, tidligereMeldekortbehandlinger, sisteMeldeperiode } =
        useMeldeperiodeKjede();

    const brukersMeldekortForBehandling =
        meldeperiodeKjede.brukersMeldekort.find(
            (b) => b.id === meldekortbehandling.brukersMeldekortId,
        ) ?? meldeperiodeKjede.brukersMeldekort.at(-1); // Bruk siste brukers meldekort som fallback

    const { antallDager } = sisteMeldeperiode;

    const formContext = useForm<MeldekortbehandlingForm>({
        defaultValues: {
            dager: hentMeldekortForhåndsutfylling(
                meldekortbehandling,
                tidligereMeldekortbehandlinger,
                sisteMeldeperiode,
                brukersMeldekortForBehandling,
            ),
            begrunnelse: meldekortbehandling.begrunnelse ?? '',
            tekstTilVedtaksbrev: meldekortbehandling.tekstTilVedtaksbrev ?? '',
            skalSendeVedtaksbrev: meldekortbehandling.skalSendeVedtaksbrev,
        },
        resolver: useCustomMeldekortUtfyllingValidationResolver(),
        context: { tillattAntallDager: antallDager },
    });

    useEffect(() => {
        formContext.reset({
            dager: hentMeldekortForhåndsutfylling(
                meldekortbehandling,
                tidligereMeldekortbehandlinger,
                sisteMeldeperiode,
                brukersMeldekortForBehandling,
            ),
            begrunnelse: meldekortbehandling.begrunnelse ?? '',
            tekstTilVedtaksbrev: meldekortbehandling.tekstTilVedtaksbrev ?? '',
        });
        //Vi ønsker kun å resette form hvis disse feltene endres
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [meldekortbehandling, tidligereMeldekortbehandlinger, brukersMeldekortForBehandling]);

    return <FormProvider {...formContext}>{children}</FormProvider>;
};

export type MeldekortbehandlingFormContext = ReturnType<typeof useForm<MeldekortbehandlingForm>>;

// Returnerer null dersom den kalles i en komponent som ikke er descendant av MeldekortbehandlingFormProvider
export const useMeldekortbehandlingForm = (): Nullable<MeldekortbehandlingFormContext> => {
    return useFormContext<MeldekortbehandlingForm>() ?? null;
};
