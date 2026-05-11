import { Alert, VStack } from '@navikt/ds-react';
import { PersonaliaHeader } from '../personaliaheader/PersonaliaHeader';
import { MeldekortVenstreSeksjon } from './1-venstre-seksjon/MeldekortVenstreSeksjon';
import { MeldekortHovedseksjon } from './2-hovedseksjon/MeldekortHovedseksjon';
import { useSak } from '~/lib/sak/SakContext';
import { MeldekortHøyreSeksjon } from './3-høyre-seksjon/MeldekortHøyreSeksjon';
import { useMeldeperiodeKjede } from './context/MeldeperiodeKjedeContext';
import { BrukersMeldekortProps } from '~/lib/meldekort/typer/BrukersMeldekort';
import { erMeldekortbehandlingUnderAktivBehandling } from '~/lib/meldekort/utils/MeldekortbehandlingUtils';
import { PERSONOVERSIKT_TABS } from '~/lib/personoversikt/Personoversikt';
import { MeldekortbehandlingFormProvider } from '~/lib/meldekort/context/MeldekortUtfyllingFormContext';

import style from './MeldekortSide.module.css';

export const MeldekortSide = () => {
    const { sakId, saksnummer } = useSak().sak;
    const { brukersMeldekort, sisteMeldekortbehandling } = useMeldeperiodeKjede();

    //kan være undefined - bruker har enda ikke sendt inn meldekort, og saksbehandler oppretter meldekortbehandling uten meldekort
    const sisteInnsendteMeldekort: BrukersMeldekortProps | undefined = brukersMeldekort.toSorted(
        (a, b) => b.mottatt.localeCompare(a.mottatt),
    )[0];

    const erSisteMeldekortEtterMeldekortbehandling =
        sisteInnsendteMeldekort &&
        sisteMeldekortbehandling &&
        new Date(sisteInnsendteMeldekort.mottatt).getTime() >
            new Date(sisteMeldekortbehandling.opprettet).getTime() &&
        erMeldekortbehandlingUnderAktivBehandling(sisteMeldekortbehandling);

    return (
        <VStack>
            <PersonaliaHeader
                sakId={sakId}
                saksnummer={saksnummer}
                visTilbakeKnapp={true}
                aktivTab={PERSONOVERSIKT_TABS.meldekort}
            />
            {erSisteMeldekortEtterMeldekortbehandling && (
                <Alert variant="warning" size="small">
                    Det har kommet inn et nytt korrigert meldekort etter opprettelsen av
                    meldekortbehandlingen.
                </Alert>
            )}
            <div className={style.behandlingLayout}>
                <MeldekortVenstreSeksjon />
                <MeldekortbehandlingFormProvider>
                    <MeldekortHovedseksjon />
                    <MeldekortHøyreSeksjon />
                </MeldekortbehandlingFormProvider>
            </div>
        </VStack>
    );
};
