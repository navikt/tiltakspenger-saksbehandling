import { classNames } from '~/utils/classNames';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Alert, Heading } from '@navikt/ds-react';
import { AntallDagerForMeldeperiodeForm } from '~/components/behandling/felles/dager-per-meldeperiode/form/AntallDagerForMeldeperiodeForm';
import { useBehandlingInnvilgelseSteg2Skjema } from '~/components/behandling/context/innvilgelse/innvilgelseContext';

import style from './BehandlingDagerPerMeldeperiode.module.css';

export const BehandlingDagerPerMeldeperiode = () => {
    const { antallDagerPerMeldeperiode } = useBehandlingInnvilgelseSteg2Skjema().innvilgelse;

    const antallDagerSettesIkkeAutomatiskIBrev =
        antallDagerPerMeldeperiode.length !== 1 ||
        antallDagerPerMeldeperiode[0].antallDagerPerMeldeperiode > 10 ||
        erOddetall(antallDagerPerMeldeperiode[0].antallDagerPerMeldeperiode);

    return (
        <VedtakSeksjon>
            <Heading size={'small'} level={'4'} className={style.heading}>
                Antall dager per meldeperiode
            </Heading>

            <VedtakSeksjon.Venstre>
                <AntallDagerForMeldeperiodeForm />
            </VedtakSeksjon.Venstre>

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

function erOddetall(antallDager: number) {
    return Math.abs(antallDager % 2) === 1;
}
