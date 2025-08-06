import {
    SøknadsbehandlingVedtakContext,
    useSøknadsbehandlingSkjema,
} from '../context/SøknadsbehandlingVedtakContext';
import { useSøknadsbehandling } from '../../BehandlingContext';
import { søknadsbehandlingValidering } from '../søknadsbehandlingValidering';
import { BehandlingSendOgGodkjenn } from '~/components/behandling/felles/send-og-godkjenn/BehandlingSendOgGodkjenn';
import { SøknadsbehandlingVedtakDTO } from '~/types/VedtakTyper';
import { SøknadsbehandlingResultat } from '~/types/BehandlingTypes';

export const SøknadsbehandlingSend = () => {
    const { behandling } = useSøknadsbehandling();
    const vedtakSkjema = useSøknadsbehandlingSkjema();

    return (
        <BehandlingSendOgGodkjenn
            behandling={behandling}
            hentVedtakDTO={() => tilSøknadsbehandlingVedtakDTO(vedtakSkjema)}
            validering={() => søknadsbehandlingValidering(behandling, vedtakSkjema)}
        />
    );
};

const tilSøknadsbehandlingVedtakDTO = (
    vedtak: SøknadsbehandlingVedtakContext,
): SøknadsbehandlingVedtakDTO => {
    switch (vedtak.resultat) {
        case SøknadsbehandlingResultat.INNVILGELSE:
            return {
                begrunnelseVilkårsvurdering: vedtak.getBegrunnelse(),
                fritekstTilVedtaksbrev: vedtak.getBrevtekst(),
                innvilgelsesperiode: vedtak.behandlingsperiode,
                barnetillegg: vedtak.harBarnetillegg
                    ? {
                          begrunnelse: vedtak.getBarnetilleggBegrunnelse(),
                          perioder: vedtak.barnetilleggPerioder,
                      }
                    : null,
                valgteTiltaksdeltakelser: vedtak.valgteTiltaksdeltakelser,
                antallDagerPerMeldeperiodeForPerioder: vedtak.antallDagerPerMeldeperiode.map(
                    (dager) => ({
                        antallDagerPerMeldeperiode: dager.antallDagerPerMeldeperiode!,
                        periode: {
                            fraOgMed: dager.periode.fraOgMed!,
                            tilOgMed: dager.periode.tilOgMed!,
                        },
                    }),
                ),
                resultat: vedtak.resultat,
            };
        case SøknadsbehandlingResultat.AVSLAG:
            return {
                avslagsgrunner: vedtak.avslagsgrunner!,
                begrunnelseVilkårsvurdering: vedtak.getBegrunnelse(),
                fritekstTilVedtaksbrev: vedtak.getBrevtekst(),
                valgteTiltaksdeltakelser: vedtak.valgteTiltaksdeltakelser,
                resultat: vedtak.resultat,
            };
        case null:
            throw new Error(
                `Resultat må være satt for søknadsbehandling vedtak - ${vedtak.resultat}`,
            );
    }

    throw new Error(
        `Ugyldig resultat for søknadsbehandling vedtak - ${vedtak.resultat satisfies never}`,
    );
};
