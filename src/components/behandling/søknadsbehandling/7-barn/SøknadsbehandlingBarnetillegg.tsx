import { classNames } from '~/utils/classNames';
import { useSøknadsbehandling } from '~/components/behandling/context/BehandlingContext';
import { Separator } from '~/components/separator/Separator';
import { SøknadsbehandlingResultat } from '~/types/BehandlingTypes';
import { BehandlingBarnetillegg } from '~/components/behandling/felles/barnetillegg/BehandlingBarnetillegg';
import { OppdaterBarnetilleggRequest } from '~/types/Barnetillegg';
import {
    BehandlingSkjemaContext,
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
                lagring={{
                    url: `/sak/${behandling.sakId}/behandling/${behandling.id}/barnetillegg`,
                    body: () => tilBarnetilleggRequest(skjemaContext),
                }}
            />
            <Separator />
        </div>
    );
};

const tilBarnetilleggRequest = (skjema: BehandlingSkjemaContext): OppdaterBarnetilleggRequest => {
    return {
        innvilgelsesperiode: skjema.behandlingsperiode,
        barnetillegg: skjema.harBarnetillegg
            ? {
                  begrunnelse: skjema.textAreas.barnetilleggBegrunnelse.getValue(),
                  perioder: skjema.barnetilleggPerioder,
              }
            : null,
        valgteTiltaksdeltakelser: skjema.valgteTiltaksdeltakelser,
        antallDagerPerMeldeperiodeForPerioder: skjema.antallDagerPerMeldeperiode.map((dager) => ({
            antallDagerPerMeldeperiode: dager.antallDagerPerMeldeperiode!,
            periode: { fraOgMed: dager.periode.fraOgMed!, tilOgMed: dager.periode.tilOgMed! },
        })),
    };
};
