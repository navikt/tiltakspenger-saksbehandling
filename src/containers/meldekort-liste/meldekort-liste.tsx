import { CardIcon } from '@navikt/aksel-icons';
import { Detail, Heading, Label, VStack } from '@navikt/ds-react';
import React from 'react';
import Divider from '../../components/divider/Divider';
import styles from './meldekortliste.module.css';
import {useMeldekort} from "../../core/useMeldekort";
import {useMeldekortEnkelt} from "../../core/useMeldekortEnkelt";

interface MeldekortlisteProps {
    behandlingId: string;
}
export const MeldekortListe = ({behandlingId}: MeldekortlisteProps) => {
    // La inn denne her, så kan de som skal bygge komponenten bestemme hvordan de skal bruke den
    const { meldekortliste, isLoading } = useMeldekort(behandlingId);

    // Test av backendendepunkt som henter et enkelt meldekort (eksempelId fra Thors maskin =))
    // Flytt denne til meldekortsiden, slik at man sender meldekortId til den når man klikker på et meldekort i sidebaren
    const {meldekort} = useMeldekortEnkelt(meldekortliste ? meldekortliste[0].id : "");

    return (
        <div className={styles.MeldekortListeSection}>
            <VStack>
                <Heading
                    size="xsmall"
                    level="1"
                    className={styles.meldekortListeHeading}
                >
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <CardIcon />
              &nbsp;Meldekort
          </span>
                </Heading>
                <Divider />
                <div style={{ margin: '0.2rem 1rem' }}>
                    <div style={{ marginLeft: '1rem', padding: '0.3rem' }}>
                        <Label size="small">Uke 1/2</Label>
                        <Detail>Klar til beregning</Detail>
                    </div>
                    <Divider />
                </div>
            </VStack>
        </div>
  );
};
