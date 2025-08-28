import { Alert, VStack } from '@navikt/ds-react';
import { PersonaliaHeader } from '../personaliaheader/PersonaliaHeader';
import { MeldekortVenstreSeksjon } from './1-venstre-seksjon/MeldekortVenstreSeksjon';
import { MeldekortHovedseksjon } from './2-hovedseksjon/MeldekortHovedseksjon';
import { useSak } from '../../context/sak/SakContext';
import { MeldekortHøyreSeksjon } from './3-høyre-seksjon/MeldekortHøyreSeksjon';

import style from './MeldekortSide.module.css';
import { useMeldeperiodeKjede } from './MeldeperiodeKjedeContext';
import { BrukersMeldekortProps } from '~/types/meldekort/BrukersMeldekort';
import { erMeldekortBehandlingUnderAktivBehandling } from '~/utils/MeldekortBehandlingUtils';

export const MeldekortSide = () => {
    const { sakId, saksnummer } = useSak().sak;
    const { brukersMeldekort, sisteMeldekortBehandling } = useMeldeperiodeKjede();

    //kan være undefined - bruker har enda ikke har sendt inn meldekort, og saksbehandler oppretter meldekortbehandling uten meldekort
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
            <PersonaliaHeader sakId={sakId} saksnummer={saksnummer} visTilbakeKnapp={true} />
            {erSisteMeldekortEtterMeldekortBehandling && (
                <Alert variant="warning" size="small">
                    Det har kommet inn et nytt korrigert meldekort etter opprettelsen av
                    meldekortbehandlingen.
                </Alert>
            )}
            <div className={style.behandlingLayout}>
                <MeldekortVenstreSeksjon />
                <MeldekortHovedseksjon />
                <MeldekortHøyreSeksjon />
            </div>
        </VStack>
    );
};
