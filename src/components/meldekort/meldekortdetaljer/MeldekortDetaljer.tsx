import { VStack, BodyShort } from '@navikt/ds-react';
import {
    formaterDatotekst,
    formaterTidspunkt,
    periodeTilFormatertDatotekst,
} from '../../../utils/date';
import { useMeldeperiodeKjede } from '../hooks/useMeldeperiodeKjede';
import { MeldekortBehandlingOpprett } from '../meldekortside/meldekort-behandling/MeldekortBehandlingOpprett';
import { MeldekortBehandlingProps } from '../../../types/meldekort/MeldekortBehandling';
import { useSak } from '../../../context/sak/SakContext';
import { useFeatureToggles } from '../../../context/feature-toggles/FeatureTogglesContext';

import styles from './MeldekortDetaljer.module.css';
import { ArrayOrSingle } from '../../../types/UtilTypes';
import { forceArray } from '../../../utils/array';

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

const MeldekortDetalj = ({ header, tekst }: { header: string; tekst: ArrayOrSingle<string> }) => {
    return (
        <div className={styles.detalj}>
            <BodyShort weight={'semibold'}>{header}</BodyShort>
            {forceArray(tekst).map((tekstverdi, index) => (
                <BodyShort className={styles.detaljtekst} key={`${tekstverdi}-${index}`}>
                    {tekstverdi}
                </BodyShort>
            ))}
        </div>
    );
};
