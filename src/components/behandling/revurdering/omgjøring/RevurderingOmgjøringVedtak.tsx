import { Alert, BodyShort, Heading, HStack, VStack } from '@navikt/ds-react';
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
import {
    RevurderingOmgjøring,
    RevurderingResultat,
    RevurderingVedtakOmgjøringRequest,
} from '~/types/Revurdering';
import { revurderingOmgjøringValidering } from './revurderingOmgjøringValidering';
import { useHentBehandlingLagringProps } from '../../felles/send-og-godkjenn/lagre/useHentBehandlingLagringProps';
import {
    erRammebehandlingMedInnvilgelse,
    hentTiltaksdeltakelserMedStartOgSluttdato,
} from '~/utils/behandling';
import { Rammebehandlingsstatus } from '~/types/Rammebehandling';
import {
    RevurderingOmgjøringContext,
    useRevurderingOmgjøringSkjema,
} from '~/components/behandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { InnvilgelsesperioderVelger } from '~/components/behandling/felles/innvilgelsesperiode/InnvilgelsesperioderVelger';
import { Nullable } from '~/types/UtilTypes';
import { BehandlingBarnetillegg } from '~/components/behandling/felles/barnetillegg/BehandlingBarnetillegg';
import { BegrunnelseVilkårsvurdering } from '~/components/behandling/felles/begrunnelse-vilkårsvurdering/BegrunnelseVilkårsvurdering';
import { SakProps } from '~/types/Sak';

import { periodiseringTotalPeriode } from '~/utils/periode';

export const RevurderingOmgjøringVedtak = () => {
    const { behandling } = useRevurderingOmgjøring();
    const { sak } = useSak();
    const skjema = useRevurderingOmgjøringSkjema();

    const omgjørVedtakId = behandling.omgjørVedtak;

    const vedtakSomBlirOmgjort = sak.behandlinger.find((b) => b.rammevedtakId === omgjørVedtakId);

    if (!vedtakSomBlirOmgjort) {
        throw new Error(
            `Teknisk feil: Klarte ikke finne vedtak som skal omgjøres for revurdering-id: ${behandling.id} og omgjørVedtak-id: ${omgjørVedtakId}`,
        );
    }

    // Kjapp fiks for å sjekke om det finnes tiltak det kan innvilges for. Dette bør avgjøres av backend.
    // Vi burde kanskje ha en innvilgelse/opphør velger, tilsvarende som vi har for søknadsbehandling
    const kanInnvilges = hentTiltaksdeltakelserMedStartOgSluttdato(behandling).length > 0;

    return (
        <div>
            <VStack gap="2">
                <Heading size={'medium'} level={'1'} spacing={true}>
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
                                        periodiseringTotalPeriode(
                                            vedtakSomBlirOmgjort.innvilgelsesperioder!,
                                        ),
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
            {behandling.status === Rammebehandlingsstatus.VEDTATT && (
                <OppsummeringsPar
                    label={'Omgjøringsperiode'}
                    verdi={periodeTilFormatertDatotekst(behandling.vedtaksperiode!)}
                    variant="inlineColon"
                />
            )}
            <Separator />
            {kanInnvilges ? (
                <Innvilgelse skjema={skjema} behandling={behandling} sak={sak} />
            ) : (
                <Alert variant={'warning'}>
                    {
                        'Omgjøringen har ingen gyldige innvilgelsesperioder. Vi støtter ikke rent opphør ennå.'
                    }
                </Alert>
            )}
        </div>
    );
};

type InnvilgelseProps = {
    skjema: RevurderingOmgjøringContext;
    behandling: RevurderingOmgjøring;
    sak: SakProps;
};

const Innvilgelse = ({ skjema, behandling, sak }: InnvilgelseProps) => {
    const lagringProps = useHentBehandlingLagringProps({
        hentDTO: () => tilDTO(skjema),
        skjema,
        validerSkjema: () => revurderingOmgjøringValidering(behandling, skjema, sak),
    });

    return (
        <>
            <InnvilgelsesperioderVelger />
            <Separator />
            <BegrunnelseVilkårsvurdering />
            <Separator />
            {skjema.innvilgelse.harValgtPeriode && (
                <>
                    <BehandlingBarnetillegg />
                    <Separator />
                    <RevurderingInnvilgelseBrev />
                    <Separator />
                    <BehandlingBeregningOgSimulering />{' '}
                </>
            )}
            <BehandlingSendOgGodkjenn behandling={behandling} lagringProps={lagringProps} />
        </>
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
        innvilgelsesperioder: innvilgelse.innvilgelsesperioder,
        barnetillegg: innvilgelse.harBarnetillegg
            ? {
                  begrunnelse: skjema.textAreas.barnetilleggBegrunnelse.getValue(),
                  perioder: innvilgelse.barnetilleggPerioder,
              }
            : {
                  begrunnelse: null,
                  perioder: [],
              },
    };
};
