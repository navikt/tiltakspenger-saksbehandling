import { BodyShort, Heading, HStack, VStack } from '@navikt/ds-react';
import { RevurderingInnvilgelseBegrunnelse } from '../innvilgelse/1-begrunnelse/RevurderingInnvilgelseBegrunnelse';
import { RevurderingInnvilgelsesperiodeVelger } from '../innvilgelse/2-innvilgelsesperiode/RevurderingInnvilgelsesperiodeVelger';
import { RevurderingDagerPerMeldeperiode } from '../innvilgelse/3-dager-per-meldeperiode/RevurderingDagerPerMeldeperiode';
import { Separator } from '~/components/separator/Separator';
import { RevurderingInnvilgelseTiltak } from '../innvilgelse/4-tiltak/RevurderingInnvilgelseTiltak';
import { RevurderingInnvilgelseBarnetillegg } from '../innvilgelse/5-barn/RevurderingInnvilgelseBarnetillegg';
import {
    barnetilleggPeriodeFormDataTilBarnetilleggPeriode,
    RevurderingInnvilgelseBrev,
} from '../innvilgelse/6-brev/RevurderingInnvilgelseBrev';
import { BehandlingBeregningOgSimulering } from '../../felles/beregning-og-simulering/BehandlingBeregningOgSimulering';
import { useRevurderingOmgjøring } from '../../context/BehandlingContext';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '~/utils/date';
import { useSak } from '~/context/sak/SakContext';
import Link from 'next/link';
import { behandlingUrl } from '~/utils/urls';
import { TabsIcon } from '@navikt/aksel-icons';
import { OppsummeringsPar } from '~/components/oppsummeringer/oppsummeringspar/OppsummeringsPar';
import { BehandlingSendOgGodkjenn } from '../../felles/send-og-godkjenn/BehandlingSendOgGodkjenn';
import { RevurderingResultat, RevurderingVedtakOmgjøringRequest } from '~/types/Revurdering';
import { Periode } from '~/types/Periode';
import { tiltaksdeltakelsePeriodeFormToTiltaksdeltakelsePeriode } from '~/components/behandling/søknadsbehandling/send-og-godkjenn/SøknadsbehandlingSend';
import {
    BehandlingSkjemaContext,
    useBehandlingSkjema,
} from '../../context/BehandlingSkjemaContext';
import { revurderingOmgjøringValidering } from './revurderingInnvilgelseValidering';
import { useHentBehandlingLagringProps } from '../../felles/send-og-godkjenn/lagre/useHentBehandlingLagringProps';
import { erRammebehandlingMedInnvilgelse } from '~/utils/behandling';
import { Rammebehandlingsstatus } from '~/types/Rammebehandling';

export const RevurderingOmgjøringVedtak = () => {
    const { behandling } = useRevurderingOmgjøring();
    const { sak } = useSak();
    const vedtak = useBehandlingSkjema();

    const omgjørVedtakId = behandling.omgjørVedtak;

    const vedtakSomBlirOmgjort = sak.behandlinger.find((b) => b.rammevedtakId === omgjørVedtakId);

    const lagringProps = useHentBehandlingLagringProps({
        hentDTO: () => tilDTO(vedtak),
        skjema: vedtak,
        validerSkjema: () => revurderingOmgjøringValidering(behandling, vedtak),
    });

    if (!vedtakSomBlirOmgjort) {
        throw new Error(
            `Teknisk feil: Klarte ikke finne vedtak som skal omgjøres for revurdering-id: ${behandling.id} og omgjørVedtak-id: ${omgjørVedtakId}`,
        );
    }

    return (
        <div>
            <>
                <VStack gap="2">
                    <Heading size={'medium'} level={'3'}>
                        Omgjøring
                    </Heading>
                    <VStack gap="2">
                        {behandling.status === Rammebehandlingsstatus.VEDTATT ? null : (
                            <>
                                <BodyShort>
                                    Omgjør vedtak med dato{' '}
                                    {formaterTidspunkt(vedtakSomBlirOmgjort.iverksattTidspunkt!)} -
                                    Dette vedtaket vil bli erstattet i sin helhet.
                                </BodyShort>
                                {erRammebehandlingMedInnvilgelse(vedtakSomBlirOmgjort) && (
                                    <OppsummeringsPar
                                        label="Innvilgelsesperiode"
                                        verdi={periodeTilFormatertDatotekst(
                                            vedtakSomBlirOmgjort.innvilgelsesperiode!,
                                        )}
                                        variant="inlineColon"
                                    />
                                )}
                                <Link
                                    href={behandlingUrl({
                                        saksnummer: vedtakSomBlirOmgjort.saksnummer,
                                        id: vedtakSomBlirOmgjort.id,
                                    })}
                                    target="_blank"
                                >
                                    <HStack align="center" gap="2">
                                        <BodyShort>Se vedtak (åpner i ny fane)</BodyShort>
                                        <TabsIcon
                                            title="Se vedtak (åpner i ny fane)"
                                            fontSize="1.2rem"
                                        />
                                    </HStack>
                                </Link>
                            </>
                        )}
                    </VStack>
                </VStack>
                <Separator />
                <RevurderingInnvilgelseBegrunnelse />
                {behandling.status === Rammebehandlingsstatus.VEDTATT && (
                    <OppsummeringsPar
                        label={'Omgjøringsperiode'}
                        verdi={periodeTilFormatertDatotekst(behandling.virkningsperiode!)}
                        variant="inlineColon"
                    />
                )}
                <RevurderingInnvilgelsesperiodeVelger />
                <RevurderingDagerPerMeldeperiode />
                <Separator />
                <RevurderingInnvilgelseTiltak />
                <RevurderingInnvilgelseBarnetillegg />
                <Separator />
                <RevurderingInnvilgelseBrev />
                <Separator />
                <BehandlingBeregningOgSimulering />
                <BehandlingSendOgGodkjenn behandling={behandling} lagringProps={lagringProps} />
            </>
        </div>
    );
};

const tilDTO = (skjema: BehandlingSkjemaContext): RevurderingVedtakOmgjøringRequest => {
    return {
        resultat: RevurderingResultat.OMGJØRING,
        begrunnelseVilkårsvurdering: skjema.textAreas.begrunnelse.getValue(),
        fritekstTilVedtaksbrev: skjema.textAreas.brevtekst.getValue(),
        innvilgelsesperiode: skjema.behandlingsperiode as Periode,
        valgteTiltaksdeltakelser: tiltaksdeltakelsePeriodeFormToTiltaksdeltakelsePeriode(
            skjema.valgteTiltaksdeltakelser,
        ),
        barnetillegg: skjema.harBarnetillegg
            ? {
                  begrunnelse: skjema.textAreas.barnetilleggBegrunnelse.getValue(),
                  perioder: barnetilleggPeriodeFormDataTilBarnetilleggPeriode(
                      skjema.barnetilleggPerioder,
                  ),
              }
            : {
                  begrunnelse: null,
                  perioder: [],
              },
        antallDagerPerMeldeperiodeForPerioder: skjema.antallDagerPerMeldeperiode.map((periode) => ({
            antallDagerPerMeldeperiode: periode.antallDagerPerMeldeperiode!,
            periode: {
                fraOgMed: periode.periode!.fraOgMed!,
                tilOgMed: periode.periode!.tilOgMed!,
            },
        })),
    };
};
