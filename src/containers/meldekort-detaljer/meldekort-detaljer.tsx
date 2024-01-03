import styles from "./detaljer.module.css";
import {Heading} from "@navikt/ds-react";
import {BagdeIcon, ChevronRightIcon, InformationIcon, PersonCircleIcon} from "@navikt/aksel-icons";
import IconWithLabelAndDetails from "../../components/icon-with-label-details/IconWithLabelAndDetails";
import React from "react";

export const Detaljer = () => {
    return (
        <div className={styles.detaljerColumn}>
            <Heading size="xsmall" level="1" className={styles.detaljerHeading}>
                <span className={styles.detaljerHeadingSpan}><ChevronRightIcon/> &nbsp; Detaljer  </span>
            </Heading>
            <IconWithLabelAndDetails iconRenderer={()=><BagdeIcon/>} label="Meldekort type" discription="Elektronisk" />
            <IconWithLabelAndDetails iconRenderer={()=><InformationIcon/>} label="Status" discription="Må gåes opp" />
            <IconWithLabelAndDetails iconRenderer={()=><PersonCircleIcon/>} label="Signatur" discription="Z8834556612" />
        </div>
    )
}

