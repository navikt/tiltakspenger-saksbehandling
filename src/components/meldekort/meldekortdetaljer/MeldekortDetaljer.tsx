import { VStack, BodyShort } from '@navikt/ds-react';
import {
    formaterDatotekst,
    formaterTidspunkt,
    periodeTilFormatertDatotekst,
} from '../../../utils/date';
import { useMeldeperiodeKjede } from '../../../context/meldeperioder/useMeldeperiodeKjede';
import { MeldekortBehandlingOpprett } from '../meldekortside/meldekort-behandling/MeldekortBehandlingOpprett';
import { MeldekortBehandlingProps } from '../../../types/meldekort/MeldekortBehandling';
import { useFeatureToggles } from '../../../context/feature-toggles/useFeatureToggles';

import styles from './MeldekortDetaljer.module.css';
import { useSak } from '../../../context/sak/useSak';

export const MeldekortDetaljer = () => {
    const { sak } = useSak();
    const { sisteDagSomGirRett } = sak;

    const { meldeperiodeKjede, valgtMeldeperiode } = useMeldeperiodeKjede();
    const { periode, tiltaksnavn } = meldeperiodeKjede;
    const { antallDager, meldekortBehandling, brukersMeldekort } = valgtMeldeperiode;
    const { brukersMeldekortToggle } = useFeatureToggles();

    return (
        <VStack gap="3" className={styles.wrapper}>
            <MeldekortDetalj
                header={'Siste dag med rett'}
                tekst={sisteDagSomGirRett ? formaterDatotekst(sisteDagSomGirRett) : 'Ukjent'}
            />
            <MeldekortDetalj
                header={'Meldekortperiode'}
                tekst={periodeTilFormatertDatotekst(periode)}
            />
            <MeldekortDetalj header={'Tiltak'} tekst={tiltaksnavn ?? 'Ukjent'} />
            <MeldekortDetalj
                header={'Antall dager per meldeperiode'}
                tekst={antallDager.toString()}
            />
            {brukersMeldekortToggle && (
                <MeldekortDetalj
                    header={'Meldekort mottatt fra bruker'}
                    tekst={
                        brukersMeldekort?.mottatt
                            ? formaterTidspunkt(brukersMeldekort.mottatt)
                            : 'Ikke mottatt'
                    }
                />
            )}

            {meldekortBehandling ? (
                <MeldekortBehandlingDetaljer {...meldekortBehandling} />
            ) : (
                <MeldekortBehandlingOpprett meldeperiode={valgtMeldeperiode} />
            )}
        </VStack>
    );
};

const MeldekortBehandlingDetaljer = ({ saksbehandler, beslutter }: MeldekortBehandlingProps) => {
    return (
        <>
            {saksbehandler && <MeldekortDetalj header={'Behandler'} tekst={saksbehandler} />}
            {beslutter && <MeldekortDetalj header={'Beslutter'} tekst={beslutter} />}
        </>
    );
};

const MeldekortDetalj = ({ header, tekst }: { header: string; tekst: string }) => {
    return (
        <div className={styles.detalj}>
            <BodyShort weight={'semibold'}>{header}</BodyShort>
            <BodyShort>{tekst}</BodyShort>
        </div>
    );
};
