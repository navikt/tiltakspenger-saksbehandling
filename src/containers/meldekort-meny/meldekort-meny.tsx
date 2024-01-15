import { CardIcon } from '@navikt/aksel-icons';
import { Detail, Heading, Label, VStack } from '@navikt/ds-react';
import React from 'react';
import Divider from '../../components/divider/Divider';
import styles from './meldekortliste.module.css';
import {useMeldekortListe} from "../../core/useMeldekortListe";
import {useMeldekortEnkelt} from "../../core/useMeldekortEnkelt";
import {parseDateTimestamp, getWeekNumber, getDayOfWeek} from "../../utils/date";
import {MeldekortUtenDager} from "../../types/MeldekortTypes";

interface MeldekortlisteProps {
    behandlingId: string;
}

const meldekortUkeNummer = (fom: Date, tom: Date) : string => {
    return `Uke ${getWeekNumber(fom)} / ${getWeekNumber(tom)}`;
}

const meldekortPeriode = (fom: Date, tom: Date): string => {
    return `${parseDateTimestamp(fom)} - ${parseDateTimestamp(tom)}`;
}

export const MeldekortMeny = ({behandlingId}: MeldekortlisteProps) => {
    // La inn denne her, så kan de som skal bygge komponenten bestemme hvordan de skal bruke den

    const { meldekortliste, fantGrunnlag } = useMeldekortListe(behandlingId);

    // Test av backendendepunkt som henter et enkelt meldekort (eksempelId fra Thors maskin =))
    // Flytt denne til meldekortsiden, slik at man sender meldekortId til den når man klikker på et meldekort i sidebaren
    const {meldekort} = useMeldekortEnkelt(meldekortliste ? meldekortliste[0].id : "");

    return (
        <div className={styles.MeldekortListeSection}>
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
               { !fantGrunnlag &&
                   meldekortliste?.map((meldekortUtenDager : MeldekortUtenDager, index) => {
                       return (
                           <>
                              <div style={{marginLeft: '1rem', padding: '0.3rem'}}>
                                  <Label size="small">
                                      {meldekortUkeNummer(meldekortUtenDager.fom, meldekortUtenDager.tom)}
                                  </Label>
                                  <Detail>
                                      {meldekortPeriode(meldekortUtenDager.fom, meldekortUtenDager.tom)}
                                  </Detail>
                              </div>
                              <Divider/>
                           </>
                       )
                   })
               }
           </div>
        </div>
    )
};
