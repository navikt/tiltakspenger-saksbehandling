import { Alert, BodyShort, Heading, Link, VStack } from '@navikt/ds-react';
import { Rammebehandlingsstatus } from '~/types/Rammebehandling';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '~/utils/date';
import { OppsummeringsPar } from '~/components/oppsummeringer/oppsummeringspar/OppsummeringsPar';
import { behandlingUrl } from '~/utils/urls';
import { TabsIcon } from '@navikt/aksel-icons';
import { useRevurderingOmgjøring } from '~/components/behandling/context/BehandlingContext';
import { useSak } from '~/context/sak/SakContext';
import { hentRammevedtak } from '~/utils/sak';

export const RevurderingOmgjøringHeader = () => {
    const { behandling } = useRevurderingOmgjøring();
    const { sak } = useSak();

    const { omgjørVedtak, klagebehandlingId } = behandling;

    const vedtakSomBlirOmgjort = hentRammevedtak(sak, omgjørVedtak);

    if (!vedtakSomBlirOmgjort) {
        return (
            <Alert variant={'error'}>
                {`Teknisk feil: Klarte ikke finne vedtak som skal omgjøres for revurdering-id: ${behandling.id} og omgjørVedtak-id: ${omgjørVedtak}`}
            </Alert>
        );
    }

    return (
        <VStack gap="space-8">
            <Heading size={'medium'} level={'1'} spacing={true}>
                {klagebehandlingId ? 'Omgjøring etter klage' : 'Omgjøring'}
            </Heading>

            {behandling.status === Rammebehandlingsstatus.VEDTATT ? (
                <OppsummeringsPar
                    label={'Vedtaksperiode'}
                    verdi={periodeTilFormatertDatotekst(behandling.vedtaksperiode!)}
                    variant={'inlineColon'}
                />
            ) : (
                <VStack gap={'space-8'} align={'start'}>
                    <BodyShort>
                        {`Omgjør vedtak med dato ${formaterTidspunkt(vedtakSomBlirOmgjort.opprettet)} - `}
                        <Link
                            href={behandlingUrl({
                                saksnummer: sak.saksnummer,
                                id: vedtakSomBlirOmgjort.behandlingId,
                            })}
                            target={'_blank'}
                        >
                            {'Se vedtak (åpner i ny fane)'}
                            <TabsIcon title={'Se vedtak (åpner i ny fane)'} />
                        </Link>
                    </BodyShort>

                    <OppsummeringsPar
                        label={'Gjeldende vedtaksperioder'}
                        verdi={vedtakSomBlirOmgjort.gjeldendeVedtaksperioder
                            .map(periodeTilFormatertDatotekst)
                            .join(', ')}
                        variant={'inlineColon'}
                    />

                    {vedtakSomBlirOmgjort.gjeldendeInnvilgetPerioder.length > 0 && (
                        <OppsummeringsPar
                            label={'Gjeldende innvilgelsesperioder'}
                            verdi={vedtakSomBlirOmgjort.gjeldendeInnvilgetPerioder
                                .map(periodeTilFormatertDatotekst)
                                .join(', ')}
                            variant={'inlineColon'}
                        />
                    )}
                </VStack>
            )}
        </VStack>
    );
};
