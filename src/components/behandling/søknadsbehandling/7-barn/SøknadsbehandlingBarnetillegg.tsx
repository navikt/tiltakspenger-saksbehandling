import { classNames } from '~/utils/classNames';
import { Separator } from '~/components/separator/Separator';

import { BehandlingBarnetillegg } from '~/components/behandling/felles/barnetillegg/BehandlingBarnetillegg';
import { useBehandlingSkjema } from '~/components/behandling/context/BehandlingSkjemaContext';

import style from './SøknadsbehandlingBarnetillegg.module.css';
import { RammebehandlingResultatType } from '~/types/Behandling';

export const SøknadsbehandlingBarnetillegg = () => {
    const skjemaContext = useBehandlingSkjema();

    return (
        <div
            className={classNames(
                skjemaContext.resultat !== RammebehandlingResultatType.INNVILGELSE && style.skjult,
            )}
        >
            <BehandlingBarnetillegg valgTekst={'Skal det innvilges barnetillegg?'} />
            <Separator />
        </div>
    );
};
