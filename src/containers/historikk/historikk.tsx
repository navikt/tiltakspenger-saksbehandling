import styles from "./historikk.module.css";
import {ChevronRightIcon} from "@navikt/aksel-icons";
import React from "react";
import {Heading} from "@navikt/ds-react";
import {Endring} from "../../types/Behandling";
import dayjs from "dayjs";

interface HistorikkProps {
    endringslogg: Endring[]
}

export const Historikk = ({endringslogg}: HistorikkProps) => {
    return(
        <div className={styles.historikkColumn}>
            <Heading size="xsmall" level="1" className={styles.historikkHeading}>
                <span className={styles.historikkHeadingSpan}><ChevronRightIcon /> &nbsp; Historikk  </span>
            </Heading>
            {endringslogg.map((endring, index) => {
                const datoTid = new Date(endring.endretTidspunkt).toISOString().split("T")
                return (
                    <div key={index} className={styles.historikkRow}>
                        <span className={styles.historikkDato}>{endring.type}</span>
                        <span className={styles.historikkTekst}>{endring.begrunnelse}</span>
                        <span className={styles.historikkTekst}>{`${datoTid[0]} ${datoTid[1].split(".")[0]}`}</span>
                        <span className={styles.historikkTekst}>{endring.endretAv}</span>
                    </div>
                )
            })}
        </div>
    );
}
