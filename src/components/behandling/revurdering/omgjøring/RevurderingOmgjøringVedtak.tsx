import { BodyShort, Heading, HStack, VStack } from '@navikt/ds-react';
import { RevurderingInnvilgelseBegrunnelse } from '~/components/behandling/revurdering/innvilgelse/begrunnelse/RevurderingInnvilgelseBegrunnelse';
import { Separator } from '~/components/separator/Separator';
import { RevurderingInnvilgelseBrev } from '~/components/behandling/revurdering/innvilgelse/brev/RevurderingInnvilgelseBrev';
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
import { revurderingOmgjøringValidering } from './revurderingInnvilgelseValidering';
import { useHentBehandlingLagringProps } from '../../felles/send-og-godkjenn/lagre/useHentBehandlingLagringProps';
import { erRammebehandlingMedInnvilgelse } from '~/utils/behandling';
import { Rammebehandlingsstatus } from '~/types/Rammebehandling';
import {
    RevurderingOmgjøringContext,
    useRevurderingOmgjøringSkjema,
} from '~/components/behandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { InnvilgelsesperiodeVelger } from '~/components/behandling/felles/innvilgelsesperiode/InnvilgelsesperiodeVelger';
import { Nullable } from '~/types/UtilTypes';
import { BehandlingDagerPerMeldeperiode } from '~/components/behandling/felles/dager-per-meldeperiode/BehandlingDagerPerMeldeperiode';
import { BehandlingTiltak } from '~/components/behandling/felles/tiltak/BehandlingTiltak';
import { BehandlingBarnetillegg } from '~/components/behandling/felles/barnetillegg/BehandlingBarnetillegg';

export const RevurderingOmgjøringVedtak = () => {
    const { behandling } = useRevurderingOmgjøring();
    const { sak } = useSak();
    const vedtak = useRevurderingOmgjøringSkjema();

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
            <Separator />
            <InnvilgelsesperiodeVelger />
            <Separator />
            <BehandlingDagerPerMeldeperiode />
            <Separator />
            <BehandlingTiltak />
            <BehandlingBarnetillegg />
            <Separator />
            <RevurderingInnvilgelseBrev />
            <Separator />
            <BehandlingBeregningOgSimulering />
            <BehandlingSendOgGodkjenn behandling={behandling} lagringProps={lagringProps} />
        </div>
    );
};

const tilDTO = (
    skjema: RevurderingOmgjøringContext,
): Nullable<RevurderingVedtakOmgjøringRequest> => {
    const { innvilgelse } = skjema;

    if (!innvilgelse.harValgtPeriode) {
        return null;
    }

    return {
        resultat: RevurderingResultat.OMGJØRING,
        begrunnelseVilkårsvurdering: skjema.textAreas.begrunnelse.getValue(),
        fritekstTilVedtaksbrev: skjema.textAreas.brevtekst.getValue(),
        innvilgelsesperiode: innvilgelse.innvilgelsesperiode,
        valgteTiltaksdeltakelser: innvilgelse.valgteTiltaksdeltakelser,
        barnetillegg: innvilgelse.harBarnetillegg
            ? {
                  begrunnelse: skjema.textAreas.barnetilleggBegrunnelse.getValue(),
                  perioder: innvilgelse.barnetilleggPerioder,
              }
            : {
                  begrunnelse: null,
                  perioder: [],
              },
        antallDagerPerMeldeperiodeForPerioder: innvilgelse.antallDagerPerMeldeperiode,
    };
};
