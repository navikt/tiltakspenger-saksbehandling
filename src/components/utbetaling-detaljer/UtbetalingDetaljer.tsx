import styles from './Detaljer.module.css';
import { Heading } from '@navikt/ds-react';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import React from 'react';
import DetaljeListeelement from './detalje-listeelement/DetaljeListeelement';
import {useRouter} from "next/router";
import {UtbetalingsDagStatus} from "../../types/Utbetaling";
import {useHentUtbetalingVedtak} from "../../hooks/useHentUtbetalingVedtak";

export const UtbetalingDetaljer = () => {
    const router = useRouter();
    const utbetalingVedtakId = router.query.utbetalingId as string;
    const { utbetalingVedtak } = useHentUtbetalingVedtak(utbetalingVedtakId);

    /*const utbetalingsDagDTO = [
        {
            beløp: 7580,
            dato: new Date('2024-01-01'),
            tiltakType: 'String',
            status: UtbetalingsDagStatus.FullUtbetaling
        }]

    const utbetalingVedtak = {
        id: '123',
        fom: new Date('2024-01-01'),
        tom: new Date('2023-01-14'),
        sats:  285,
        satsBarnetillegg: 53,
        antallBarn: 4,
        totalbeløp: 7580,
        vedtakDager: utbetalingsDagDTO
    }*/

    return (
        <div className={styles.detaljerColumn}>
            <Heading size="xsmall" level="1" className={styles.detaljerHeading}>
            <span className={styles.detaljerHeadingSpan}>
            <ChevronRightIcon/> &nbsp; Detaljer{' '}
            </span>
            </Heading>
            <DetaljeListeelement
                label="Tiltakspenger sats"
                discription="285"
            />
            <DetaljeListeelement
                label="Barnetillegg sats"
                discription="55"
            />
            <DetaljeListeelement
                label="Redusert tiltakspenger sats"
                discription="214"
            />
            <DetaljeListeelement
                label="Redusert barnetillegg sats"
                discription="42"
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
