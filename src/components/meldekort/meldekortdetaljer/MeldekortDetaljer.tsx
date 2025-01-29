import { VStack, BodyShort } from '@navikt/ds-react';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '../../../utils/date';
import { useMeldeperioder } from '../../../hooks/meldekort/useMeldeperioder';
import { MeldekortBehandlingOpprett } from '../meldekortside/meldekort-behandling/MeldekortBehandlingOpprett';
import { MeldekortBehandlingProps } from '../../../types/MeldekortBehandling';
import { useFeatureToggles } from '../../../hooks/useFeatureToggles';

import styles from './MeldekortDetaljer.module.css';

export const MeldekortDetaljer = () => {
    const { meldeperiodeKjede, valgtMeldeperiode } = useMeldeperioder();
    const { vedtaksPeriode, periode, tiltaksnavn } = meldeperiodeKjede;
    const { antallDager, meldekortBehandling, brukersMeldekort } = valgtMeldeperiode;
    const { brukersMeldekortToggle } = useFeatureToggles();

    return (
        <VStack gap="3" className={styles.wrapper}>
            {vedtaksPeriode && (
                <MeldekortDetalj
                    header={'Vedtaksperiode'}
                    tekst={periodeTilFormatertDatotekst(vedtaksPeriode)}
                />
            )}
            <MeldekortDetalj
                header={'Meldekortperiode'}
                tekst={periodeTilFormatertDatotekst(periode)}
            />
            <MeldekortDetalj header={'Tiltak'} tekst={tiltaksnavn} />
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
