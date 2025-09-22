import { classNames } from '~/utils/classNames';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Alert } from '@navikt/ds-react';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { AntallDagerForMeldeperiodeForm } from '~/components/forms/antallDagerForMeldeperiode/AntallDagerForMeldeperiodeForm';
import { AntallDagerForMeldeperiodeFormData } from '../state/AntallDagerState';
import { Periode } from '~/types/Periode';
import { Nullable } from '~/types/UtilTypes';

import style from './BehandlingDagerPerMeldeperiode.module.css';

export const BehandlingDagerPerMeldeperiode = (props: {
    antallDagerPerMeldeperiode: AntallDagerForMeldeperiodeFormData[];
    behandlingsperiode: Periode;
    rolleForBehandling: Nullable<SaksbehandlerRolle>;
}) => {
    const erSaksbehandler = props.rolleForBehandling === SaksbehandlerRolle.SAKSBEHANDLER;
    const erIkkeSaksbehandler = !erSaksbehandler;

    return (
        <div>
            <AntallDagerForMeldeperiodeForm
                antallDagerPerMeldeperiode={props.antallDagerPerMeldeperiode}
                behandlingsperiode={props.behandlingsperiode}
                erSaksbehandler={erSaksbehandler}
                erIkkeSaksbehandler={erIkkeSaksbehandler}
            />

            <VedtakSeksjon
                className={classNames(
                    style.input,
                    props.antallDagerPerMeldeperiode.reduce(
                        (acc, curr) => (acc += curr.antallDagerPerMeldeperiode || 0),
                        0,
                    ) === 10 && style.skjult,
                )}
            >
                <Alert className={style.infoboks} variant={'info'} size={'small'}>
                    Husk å oppgi antall dager per uke det innvilges tiltakspenger for i
                    vedtaksbrevet.
                </Alert>
            </VedtakSeksjon>
        </div>
    );
};
