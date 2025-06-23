import { classNames } from '../../../../utils/classNames';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Alert } from '@navikt/ds-react';

import style from './DagerPerMeldeperiode.module.css';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import AntallDagerForMeldeperiodeForm from '~/components/forms/antallDagerForMeldeperiode/AntallDagerForMeldeperiodeForm';
import { AntallDagerForMeldeperiodeFormData } from '../state/AntallDagerState';
import { Periode } from '~/types/Periode';
import { Nullable } from '~/types/UtilTypes';

export const DagerPerMeldeperiode = (props: {
    antallDagerPerMeldeperiode: AntallDagerForMeldeperiodeFormData[];
    behandlingsperiode: Periode;
    dispatch: (action: AntallDagerForMeldeperiodeFormData[]) => void;
    rolleForBehandling: Nullable<SaksbehandlerRolle>;
}) => {
    // const { rolleForBehandling } = useSøknadsbehandling();
    // const { antallDagerPerMeldeperiode, behandlingsperiode } = useSøknadsbehandlingSkjema();
    // const dispatch = useSøknadsbehandlingSkjemaDispatch();

    const erSaksbehandler = props.rolleForBehandling === SaksbehandlerRolle.SAKSBEHANDLER;
    const erIkkeSaksbehandler = !erSaksbehandler;

    return (
        <div>
            <AntallDagerForMeldeperiodeForm
                antallDagerPerMeldeperiode={props.antallDagerPerMeldeperiode}
                behandlingsperiode={props.behandlingsperiode}
                dispatch={props.dispatch}
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
