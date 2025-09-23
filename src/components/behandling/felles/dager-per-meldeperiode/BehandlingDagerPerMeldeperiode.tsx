import { classNames } from '~/utils/classNames';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Alert, Heading } from '@navikt/ds-react';
import { AntallDagerForMeldeperiodeForm } from '~/components/behandling/felles/dager-per-meldeperiode/form/AntallDagerForMeldeperiodeForm';
import { useBehandlingSkjema } from '~/components/behandling/context/BehandlingSkjemaContext';

import style from './BehandlingDagerPerMeldeperiode.module.css';

export const BehandlingDagerPerMeldeperiode = () => {
    const { antallDagerPerMeldeperiode } = useBehandlingSkjema();

    const harKunDefaultAntallDager = antallDagerPerMeldeperiode.every(
        (it) => it.antallDagerPerMeldeperiode === ANTALL_DAGER_DEFAULT,
    );

    return (
        <VedtakSeksjon>
            <Heading size={'small'} level={'4'} className={style.heading}>
                Antall dager per meldeperiode
            </Heading>

            <VedtakSeksjon.Venstre>
                <AntallDagerForMeldeperiodeForm />
            </VedtakSeksjon.Venstre>

            <VedtakSeksjon.Høyre className={classNames(harKunDefaultAntallDager && style.skjult)}>
                <Alert variant={'info'} size={'small'}>
                    Husk å oppgi antall dager per uke det innvilges tiltakspenger for i
                    vedtaksbrevet.
                </Alert>
            </VedtakSeksjon.Høyre>
        </VedtakSeksjon>
    );
};

export const ANTALL_DAGER_DEFAULT = 10;
