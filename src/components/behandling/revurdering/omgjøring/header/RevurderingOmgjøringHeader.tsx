import { Alert, BodyShort, Heading, Link, VStack } from '@navikt/ds-react';
import { Rammebehandlingsstatus } from '~/types/Rammebehandling';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '~/utils/date';
import { erRammebehandlingMedInnvilgelse } from '~/utils/behandling';
import { OppsummeringsPar } from '~/components/oppsummeringer/oppsummeringspar/OppsummeringsPar';
import { periodiseringTotalPeriode } from '~/utils/periode';
import { behandlingUrl } from '~/utils/urls';
import { TabsIcon } from '@navikt/aksel-icons';
import { useRevurderingOmgjøring } from '~/components/behandling/context/BehandlingContext';
import { useSak } from '~/context/sak/SakContext';
import { Klagebehandling } from '~/types/Klage';
import { Nullable } from '~/types/UtilTypes';

export const RevurderingOmgjøringHeader = (props: { klage: Nullable<Klagebehandling> }) => {
    const { behandling } = useRevurderingOmgjøring();
    const { sak } = useSak();

    const omgjørVedtakId = behandling.omgjørVedtak;

    const vedtakSomBlirOmgjort = sak.behandlinger.find((b) => b.rammevedtakId === omgjørVedtakId);

    if (!vedtakSomBlirOmgjort) {
        return (
            <Alert variant={'error'}>
                {`Teknisk feil: Klarte ikke finne vedtak som skal omgjøres for revurdering-id: ${behandling.id} og omgjørVedtak-id: ${omgjørVedtakId}`}
            </Alert>
        );
    }

    return (
        <VStack gap="space-8">
            <Heading size={'medium'} level={'1'} spacing={true}>
                {props.klage ? 'Omgjøring etter klage - ' : ''}Omgjøring
            </Heading>
            {behandling.status === Rammebehandlingsstatus.VEDTATT ? (
                <OppsummeringsPar
                    label={'Omgjøringsperiode'}
                    verdi={periodeTilFormatertDatotekst(behandling.vedtaksperiode!)}
                    variant="inlineColon"
                />
            ) : (
                <VStack gap={'space-8'} align={'start'}>
                    <BodyShort>
                        {`Omgjør vedtak med dato ${formaterTidspunkt(vedtakSomBlirOmgjort.iverksattTidspunkt!)} - Dette
                        vedtaket vil bli erstattet i sin helhet.`}
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

                    <Link href={behandlingUrl(vedtakSomBlirOmgjort)} target={'_blank'}>
                        <BodyShort>{'Se vedtak (åpner i ny fane)'}</BodyShort>
                        <TabsIcon title={'Se vedtak (åpner i ny fane)'} />
                    </Link>
                </VStack>
            )}
        </VStack>
    );
};
