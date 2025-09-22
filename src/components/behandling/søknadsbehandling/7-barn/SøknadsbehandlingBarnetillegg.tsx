import { classNames } from '~/utils/classNames';
import { useSøknadsbehandling } from '~/components/behandling/context/BehandlingContext';
import { Separator } from '~/components/separator/Separator';
import { SøknadsbehandlingResultat } from '~/types/BehandlingTypes';
import { BehandlingBarnetillegg } from '~/components/behandling/felles/barnetillegg/BehandlingBarnetillegg';
import {
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/components/behandling/context/BehandlingSkjemaContext';

import style from './SøknadsbehandlingBarnetillegg.module.css';

export const SøknadsbehandlingBarnetillegg = () => {
    const { behandling } = useSøknadsbehandling();

    const dispatch = useBehandlingSkjemaDispatch();
    const skjemaContext = useBehandlingSkjema();

    return (
        <div
            className={classNames(
                skjemaContext.resultat !== SøknadsbehandlingResultat.INNVILGELSE && style.skjult,
            )}
        >
            <BehandlingBarnetillegg
                behandling={behandling}
                dispatch={dispatch}
                context={skjemaContext}
                valgTekst={'Skal det innvilges barnetillegg?'}
            />
            <Separator />
        </div>
    );
};
