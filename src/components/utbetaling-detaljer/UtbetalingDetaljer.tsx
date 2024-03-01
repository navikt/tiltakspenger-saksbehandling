import styles from './Detaljer.module.css';
import { Heading } from '@navikt/ds-react';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import React from 'react';
import DetaljeListeelement from './detalje-listeelement/DetaljeListeelement';
import {useRouter} from "next/router";
import {useHentUtbetalingVedtak} from "../../hooks/useHentUtbetalingVedtak";

export const UtbetalingDetaljer = () => {
    const router = useRouter();
    const utbetalingVedtakId = router.query.utbetalingId as string;
    const { utbetalingVedtak } = useHentUtbetalingVedtak(utbetalingVedtakId);

    return (
        <div className={styles.detaljerColumn}>
            <Heading size="xsmall" level="1" className={styles.detaljerHeading}>
            <span className={styles.detaljerHeadingSpan}>
            <ChevronRightIcon/> &nbsp; Detaljer{' '}
            </span>
            </Heading>
            <DetaljeListeelement
                label="Tiltakspenger sats"
                discription={utbetalingVedtak?.sats.toString() ?? 'Fant ikke sats'}
            />
            <DetaljeListeelement
                label="Barnetillegg sats"
                discription={utbetalingVedtak?.satsBarnetillegg.toString() ?? 'Fant ikke sats'}
            />
            <DetaljeListeelement
                label="Redusert tiltakspenger sats"
                discription={utbetalingVedtak?.satsDelvis.toString() ?? 'Fant ikke sats'}
            />
            <DetaljeListeelement
                label="Redusert barnetillegg sats"
                discription={utbetalingVedtak?.satsBarnetilleggDelvis.toString() ?? 'Fant ikke sats'}
            />
            {utbetalingVedtak && (
                <DetaljeListeelement
                    label="Antall barn"
                    discription={utbetalingVedtak?.antallBarn.toString()}
                />
            )}
        </div>
    );
}
