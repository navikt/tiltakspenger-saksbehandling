import {
    useSøknadsbehandlingSkjemaDispatch,
    useSøknadsbehandlingSkjema,
    SøknadsbehandlingVedtakContext,
} from '~/components/behandling/søknadsbehandling/context/SøknadsbehandlingVedtakContext';
import { classNames } from '~/utils/classNames';
import { useSøknadsbehandling } from '~/components/behandling/BehandlingContext';
import { Separator } from '~/components/separator/Separator';
import { SøknadsbehandlingResultat } from '~/types/BehandlingTypes';
import { BehandlingBarnetillegg } from '~/components/behandling/felles/barnetillegg/BehandlingBarnetillegg';
import { OppdaterBarnetilleggRequest } from '~/types/Barnetillegg';

import style from './SøknadsbehandlingBarnetillegg.module.css';

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

const tilBarnetilleggRequest = (
    vedtak: SøknadsbehandlingVedtakContext,
): OppdaterBarnetilleggRequest => {
    return {
        innvilgelsesperiode: vedtak.behandlingsperiode,
        barnetillegg: vedtak.harBarnetillegg
            ? {
                  begrunnelse: vedtak.textAreas.barnetilleggBegrunnelse.getValue(),
                  perioder: vedtak.barnetilleggPerioder,
              }
            : null,
        valgteTiltaksdeltakelser: vedtak.valgteTiltaksdeltakelser,
        antallDagerPerMeldeperiodeForPerioder: vedtak.antallDagerPerMeldeperiode.map((dager) => ({
            antallDagerPerMeldeperiode: dager.antallDagerPerMeldeperiode!,
            periode: { fraOgMed: dager.periode.fraOgMed!, tilOgMed: dager.periode.tilOgMed! },
        })),
    };
};
