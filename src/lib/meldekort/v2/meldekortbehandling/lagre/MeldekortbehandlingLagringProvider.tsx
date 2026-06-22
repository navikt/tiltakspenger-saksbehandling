import {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import {
    useMeldekortbehandling,
    useMeldekortbehandlingSkjema,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { OppdaterMeldekortbehandlingDTO } from '~/lib/meldekort/typer/Meldekortbehandling';
import { MeldekortbehandlingSkjemaContext } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2ContextTyper';
import { MeldekortbehandlingPropsV2 } from '~/lib/meldekort/v2/typer';
import { meldekortbehandlingSkjemaInitialState } from '~/lib/meldekort/v2/meldekortbehandling/context/meldekortbehandlingSkjemaReducer';
import { isEqualJson } from '~/utils/is-equal-json';

type LagringContextState = {
    dto: OppdaterMeldekortbehandlingDTO;
    isDirty: boolean;
};

const LagringContext = createContext({} as LagringContextState);

export const MeldekortbehandlingLagringProvider = ({ children }: PropsWithChildren) => {
    const skjema = useMeldekortbehandlingSkjema();
    const behandling = useMeldekortbehandling();

    const [dto, setDto] = useState(genererDtoFraSkjema(skjema));

    const dtoFraBehandling = genererDtoFraBehandling(behandling);

    const oppdaterDto = useCallback(() => {
        setDto(genererDtoFraSkjema(skjema));
    }, [skjema]);

    useEffect(() => {
        const fritekstElementer = [skjema.begrunnelse, skjema.brevtekst]
            .map((fritekst) => fritekst.ref.current)
            .filter((element) => element !== null);

        fritekstElementer.forEach((element) => {
            element.addEventListener('input', oppdaterDto);
        });

        return () => {
            fritekstElementer.forEach((element) => {
                element.removeEventListener('input', oppdaterDto);
            });
        };
    }, [skjema.begrunnelse, skjema.brevtekst, oppdaterDto]);

    useEffect(() => {
        /* eslint-disable-next-line react-hooks/set-state-in-effect */
        oppdaterDto();
    }, [oppdaterDto]);

    return (
        <LagringContext.Provider
            value={{
                dto,
                isDirty: !isEqualJson(dtoFraBehandling, dto),
            }}
        >
            {children}
        </LagringContext.Provider>
    );
};

// Brukes for å avgjøre om skjemaet er endret siden forrige lagring av meldekortbehandlingen
const genererDtoFraBehandling = (
    behandling: MeldekortbehandlingPropsV2,
): OppdaterMeldekortbehandlingDTO => {
    return {
        ...meldekortbehandlingSkjemaInitialState(behandling),
        begrunnelse: behandling.begrunnelse,
        tekstTilVedtaksbrev: behandling.tekstTilVedtaksbrev,
    };
};

const genererDtoFraSkjema = (
    skjema: MeldekortbehandlingSkjemaContext,
): OppdaterMeldekortbehandlingDTO => {
    return {
        meldeperioder: skjema.meldeperioder.map((it) => ({
            kjedeId: it.kjedeId,
            dager: it.dager,
        })),
        skalSendeVedtaksbrev: skjema.skalSendeVedtaksbrev,
        begrunnelse: skjema.begrunnelse.getValue(),
        tekstTilVedtaksbrev: skjema.brevtekst.getValue(),
    };
};

export const useMeldekortbehandlingSkjemaLagring = () => {
    return useContext(LagringContext);
};
