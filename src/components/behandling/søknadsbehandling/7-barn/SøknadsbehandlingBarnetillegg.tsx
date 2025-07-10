import {
    useSøknadsbehandlingSkjemaDispatch,
    useSøknadsbehandlingSkjema,
} from '~/components/behandling/søknadsbehandling/context/SøknadsbehandlingVedtakContext';
import { classNames } from '~/utils/classNames';
import { useSøknadsbehandling } from '~/components/behandling/BehandlingContext';
import { Separator } from '~/components/separator/Separator';
import { SøknadsbehandlingResultat } from '~/types/BehandlingTypes';
import { BehandlingBarnetillegg } from '~/components/behandling/felles/barnetillegg/BehandlingBarnetillegg';

import style from './SøknadsbehandlingBarnetillegg.module.css';
import { tilBarnetilleggRequest } from '~/utils/BarnetilleggUtils';

export const SøknadsbehandlingBarnetillegg = () => {
    const { behandling } = useSøknadsbehandling();

    const dispatch = useSøknadsbehandlingSkjemaDispatch();
    const skjemaContext = useSøknadsbehandlingSkjema();

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
                valgTekst={'Har det blitt søkt om barnetillegg?'}
                lagring={{
                    url: `/sak/${behandling.sakId}/behandling/${behandling.id}/barnetillegg`,
                    body: () => tilBarnetilleggRequest(skjemaContext),
                }}
            />
            <Separator />
        </div>
    );
};
