import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import {
    MeldekortBehandlingForm,
    useCustomMeldekortUtfyllingValidationResolver,
} from '~/components/meldekort/2-hovedseksjon/behandling/utfylling/meldekortUtfyllingUtils';
import { MeldekortBehandlingProps } from '~/types/meldekort/MeldekortBehandling';
import { useMeldeperiodeKjede } from '~/components/meldekort/context/MeldeperiodeKjedeContext';
import { PropsWithChildren, useEffect } from 'react';
import { hentMeldekortForhåndsutfylling } from '~/components/meldekort/0-felles-komponenter/meldekortForhåndsutfyllingUtils';

export const MeldekortUtfyllingFormProvider = ({ children }: PropsWithChildren) => {
    const { sisteMeldekortBehandling } = useMeldeperiodeKjede();

    if (!sisteMeldekortBehandling) {
        return children;
    }

    return (
        <MeldekortUtfyllingFormProviderInner meldekortBehandling={sisteMeldekortBehandling}>
            {children}
        </MeldekortUtfyllingFormProviderInner>
    );
};

type Props = PropsWithChildren<{
    meldekortBehandling: MeldekortBehandlingProps;
}>;

const MeldekortUtfyllingFormProviderInner = ({ meldekortBehandling, children }: Props) => {
    const { meldeperiodeKjede, tidligereMeldekortBehandlinger, sisteMeldeperiode } =
        useMeldeperiodeKjede();

    const brukersMeldekortForBehandling =
        meldeperiodeKjede.brukersMeldekort.find(
            (b) => b.id === meldekortBehandling.brukersMeldekortId,
        ) ?? meldeperiodeKjede.brukersMeldekort.at(-1); // Bruk siste brukers meldekort som fallback

    const { antallDager } = sisteMeldeperiode;

    const formContext = useForm<MeldekortBehandlingForm>({
        defaultValues: {
            dager: hentMeldekortForhåndsutfylling(
                meldekortBehandling,
                tidligereMeldekortBehandlinger,
                sisteMeldeperiode,
                brukersMeldekortForBehandling,
            ),
            begrunnelse: meldekortBehandling.begrunnelse ?? '',
            tekstTilVedtaksbrev: meldekortBehandling.tekstTilVedtaksbrev ?? '',
        },
        resolver: useCustomMeldekortUtfyllingValidationResolver(),
        context: { tillattAntallDager: antallDager },
    });

    useEffect(() => {
        formContext.reset({
            dager: hentMeldekortForhåndsutfylling(
                meldekortBehandling,
                tidligereMeldekortBehandlinger,
                sisteMeldeperiode,
                brukersMeldekortForBehandling,
            ),
            begrunnelse: meldekortBehandling.begrunnelse ?? '',
            tekstTilVedtaksbrev: meldekortBehandling.tekstTilVedtaksbrev ?? '',
        });
        //Vi ønsker kun å resette form hvis disse feltene endres
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [meldekortBehandling, tidligereMeldekortBehandlinger, brukersMeldekortForBehandling]);

    return <FormProvider {...formContext}>{children}</FormProvider>;
};

export const useMeldekortUtfyllingForm = () => {
    return useFormContext<MeldekortBehandlingForm>();
};
