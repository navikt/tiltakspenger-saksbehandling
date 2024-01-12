import { CardIcon } from '@navikt/aksel-icons';
import { Detail, Heading, Label, VStack } from '@navikt/ds-react';
import React from 'react';
import Divider from '../../components/divider/Divider';
import styles from './meldekortliste.module.css';
import {useMeldekort} from "../../core/useMeldekort";
import {useMeldekortEnkelt} from "../../core/useMeldekortEnkelt";
import {parseDateTimestamp, getWeekNumber, getDayOfWeek} from "../../utils/date";
import {MeldekortUtenDager} from "../../types/MeldekortTypes";

interface MeldekortlisteProps {
    behandlingId: string;
}
export const MeldekortListe = ({behandlingId}: MeldekortlisteProps) => {
    // La inn denne her, så kan de som skal bygge komponenten bestemme hvordan de skal bruke den

    const { meldekortliste, fantGrunnlag } = useMeldekort(behandlingId);

    // Test av backendendepunkt som henter et enkelt meldekort (eksempelId fra Thors maskin =))
    // Flytt denne til meldekortsiden, slik at man sender meldekortId til den når man klikker på et meldekort i sidebaren
    const {meldekort} = useMeldekortEnkelt(meldekortliste ? meldekortliste[0].id : "");

    const meldekortlist : MeldekortUtenDager[] = [
        {
            id: '123',
            fom: new Date('2023-12-04'),
            tom: new Date('2023-12-17'),
            status: 'Ikke utfylt',
        },
        {
            id: '124',
            fom: new Date('2023-12-18'),
            tom: new Date('2023-12-31'),
            status: 'Ikke utfylt',
        }
    ]

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
                   meldekortlist?.map((meldekortUtenDager, index) => {
                       return (
                           <>
                              <div style={{marginLeft: '1rem', padding: '0.3rem'}}>
                                  <Label size="small">
                                      {`Uke ${getWeekNumber(meldekortUtenDager.fom)} / ${getWeekNumber(meldekortUtenDager.tom)}`}
                                  </Label>
                                  <Detail>
                                      {`${parseDateTimestamp(meldekortUtenDager.fom)} - ${parseDateTimestamp(meldekortUtenDager.tom)}`}
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
