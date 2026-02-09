import { Alert, VStack } from '@navikt/ds-react';
import { PersonaliaHeader } from '../personaliaheader/PersonaliaHeader';
import { MeldekortVenstreSeksjon } from './1-venstre-seksjon/MeldekortVenstreSeksjon';
import { MeldekortHovedseksjon } from './2-hovedseksjon/MeldekortHovedseksjon';
import { useSak } from '~/context/sak/SakContext';
import { MeldekortHøyreSeksjon } from './3-høyre-seksjon/MeldekortHøyreSeksjon';
import { useMeldeperiodeKjede } from './context/MeldeperiodeKjedeContext';
import { BrukersMeldekortProps } from '~/types/meldekort/BrukersMeldekort';
import { erMeldekortBehandlingUnderAktivBehandling } from '~/utils/meldekortBehandling';
import { PERSONOVERSIKT_TABS } from '~/components/personoversikt/Personoversikt';
import { MeldekortUtfyllingFormProvider } from '~/components/meldekort/context/MeldekortUtfyllingFormContext';

import style from './MeldekortSide.module.css';

export const MeldekortSide = () => {
    const { sakId, saksnummer } = useSak().sak;
    const { brukersMeldekort, sisteMeldekortBehandling } = useMeldeperiodeKjede();

    //kan være undefined - bruker har enda ikke sendt inn meldekort, og saksbehandler oppretter meldekortbehandling uten meldekort
    const sisteInnsendteMeldekort: BrukersMeldekortProps | undefined = brukersMeldekort.toSorted(
        (a, b) => b.mottatt.localeCompare(a.mottatt),
    )[0];

    const erSisteMeldekortEtterMeldekortBehandling =
        sisteInnsendteMeldekort &&
        sisteMeldekortBehandling &&
        new Date(sisteInnsendteMeldekort.mottatt).getTime() >
            new Date(sisteMeldekortBehandling.opprettet).getTime() &&
        erMeldekortBehandlingUnderAktivBehandling(sisteMeldekortBehandling);

    return (
        <VStack>
            <PersonaliaHeader
                sakId={sakId}
                saksnummer={saksnummer}
                visTilbakeKnapp={true}
                aktivTab={PERSONOVERSIKT_TABS.meldekort}
            />
            {erSisteMeldekortEtterMeldekortBehandling && (
                <Alert variant="warning" size="small">
                    Det har kommet inn et nytt korrigert meldekort etter opprettelsen av
                    meldekortbehandlingen.
                </Alert>
            )}
            <div className={style.behandlingLayout}>
                <MeldekortVenstreSeksjon />
                <MeldekortUtfyllingFormProvider>
                    <MeldekortHovedseksjon />
                    <MeldekortHøyreSeksjon />
                </MeldekortUtfyllingFormProvider>
            </div>
        </VStack>
    );
};
