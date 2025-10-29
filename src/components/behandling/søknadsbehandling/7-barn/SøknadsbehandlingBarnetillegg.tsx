import { classNames } from '~/utils/classNames';
import { Separator } from '~/components/separator/Separator';
import { BehandlingBarnetillegg } from '~/components/behandling/felles/barnetillegg/BehandlingBarnetillegg';
import { useBehandlingSkjema } from '~/components/behandling/context/BehandlingSkjemaContext';
import { SøknadsbehandlingResultat } from '~/types/Søknadsbehandling';

import style from './SøknadsbehandlingBarnetillegg.module.css';

export const SøknadsbehandlingBarnetillegg = () => {
    const skjemaContext = useBehandlingSkjema();

    return (
        <div
            className={classNames(
                skjemaContext.resultat !== SøknadsbehandlingResultat.INNVILGELSE && style.skjult,
            )}
        >
            <BehandlingBarnetillegg valgTekst={'Skal det innvilges barnetillegg?'} />
            <Separator />
        </div>
    );
};
