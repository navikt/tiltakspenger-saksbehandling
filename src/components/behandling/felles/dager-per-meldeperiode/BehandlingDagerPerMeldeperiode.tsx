import { classNames } from '~/utils/classNames';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Alert, Heading } from '@navikt/ds-react';

import style from './BehandlingDagerPerMeldeperiode.module.css';

export const BehandlingDagerPerMeldeperiode = () => {
    const antallDagerSettesIkkeAutomatiskIBrev = true;
    // antallDagerPerMeldeperiode.length !== 1 ||
    // antallDagerPerMeldeperiode[0].antallDagerPerMeldeperiode > 10 ||
    // erOddetall(antallDagerPerMeldeperiode[0].antallDagerPerMeldeperiode);

    return (
        <VedtakSeksjon>
            <Heading size={'small'} level={'4'} spacing={true}>
                Antall dager per meldeperiode
            </Heading>

            <VedtakSeksjon.Høyre
                className={classNames(!antallDagerSettesIkkeAutomatiskIBrev && style.skjult)}
            >
                <Alert variant={'info'} size={'small'}>
                    Husk å oppgi antall dager per uke det innvilges tiltakspenger for i
                    vedtaksbrevet.
                </Alert>
            </VedtakSeksjon.Høyre>
        </VedtakSeksjon>
    );
};

export const ANTALL_DAGER_DEFAULT = 10;
