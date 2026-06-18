import { createContext, PropsWithChildren, useState } from 'react';
import { useMeldekortbehandlingSkjema } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { OppdaterMeldekortbehandlingDTO } from '~/lib/meldekort/typer/Meldekortbehandling';
import { MeldekortbehandlingSkjemaContext } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2ContextTyper';

type LagringContextState = {
    genererDTO: () => OppdaterMeldekortbehandlingDTO;
};

const LagringContext = createContext({} as LagringContextState);

export const MeldekortbehandlingLagringProvider = ({ children }: PropsWithChildren) => {
    const {} = useMeldekortbehandlingSkjema();

    const [] = useState()

    const genererDTO = (): OppdaterMeldekortbehandlingDTO => {

    };

    return (
        <LagringContext.Provider
            value={{
                genererDTO,
            }}
        >
            {children}
        </LagringContext.Provider>
    );
};

const tilDTO = (skjema: MeldekortbehandlingSkjemaContext): OppdaterMeldekortbehandlingDTO => {
    return {
        meldeperioder: skjema.meldeperioder.map((it) => ({
            kjedeId: it.kjedeId,
            dager: it.dager,
        })),
        begrunnelse: skjema.textAreas.begrunnelse.getValue(),
        tekstTilVedtaksbrev: skjema.textAreas.brevtekst.getValue(),
        skalSendeVedtaksbrev: true,
        v2: true,
    };
};
