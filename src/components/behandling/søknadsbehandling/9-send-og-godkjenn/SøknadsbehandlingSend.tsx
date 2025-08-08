import {
    SøknadsbehandlingVedtakContext,
    useSøknadsbehandlingSkjema,
} from '../context/SøknadsbehandlingVedtakContext';
import { useSøknadsbehandling } from '../../BehandlingContext';
import { søknadsbehandlingValidering } from '../søknadsbehandlingValidering';
import { BehandlingSendOgGodkjenn } from '~/components/behandling/felles/send-og-godkjenn/BehandlingSendOgGodkjenn';
import { SøknadsbehandlingVedtakDTO } from '~/types/VedtakTyper';
import { SøknadsbehandlingResultat } from '~/types/BehandlingTypes';
import { useHentBehandlingLagringProps } from '~/components/behandling/felles/send-og-godkjenn/lagre/useHentBehandlingLagringProps';

export const SøknadsbehandlingSend = () => {
    const { behandling } = useSøknadsbehandling();
    const vedtak = useSøknadsbehandlingSkjema();

    const lagringProps = useHentBehandlingLagringProps({
        hentDTO: () => tilDTO(vedtak),
        vedtak,
        validerVedtak: () => søknadsbehandlingValidering(behandling, vedtak),
    });

    return <BehandlingSendOgGodkjenn behandling={behandling} lagringProps={lagringProps} />;
};

const tilDTO = (vedtak: SøknadsbehandlingVedtakContext): SøknadsbehandlingVedtakDTO => {
    switch (vedtak.resultat) {
        case SøknadsbehandlingResultat.INNVILGELSE:
            return {
                begrunnelseVilkårsvurdering: vedtak.textAreas.begrunnelse.getValue(),
                fritekstTilVedtaksbrev: vedtak.textAreas.brevtekst.getValue(),
                innvilgelsesperiode: vedtak.behandlingsperiode,
                barnetillegg: vedtak.harBarnetillegg
                    ? {
                          begrunnelse: vedtak.textAreas.barnetilleggBegrunnelse.getValue(),
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
                begrunnelseVilkårsvurdering: vedtak.textAreas.begrunnelse.getValue(),
                fritekstTilVedtaksbrev: vedtak.textAreas.brevtekst.getValue(),
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
