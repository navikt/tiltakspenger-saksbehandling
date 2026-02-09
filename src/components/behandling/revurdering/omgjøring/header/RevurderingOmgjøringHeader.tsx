import { Alert, BodyShort, Heading, Link, VStack } from '@navikt/ds-react';
import { Rammebehandlingsstatus } from '~/types/Rammebehandling';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '~/utils/date';
import { OppsummeringsPar } from '~/components/oppsummeringer/oppsummeringspar/OppsummeringsPar';
import { behandlingUrl } from '~/utils/urls';
import { TabsIcon } from '@navikt/aksel-icons';
import { useRevurderingOmgjøring } from '~/components/behandling/context/BehandlingContext';
import { useSak } from '~/context/sak/SakContext';
import { hentGjeldendeRammevedtak, hentRammevedtak } from '~/utils/sak';

export const RevurderingOmgjøringHeader = () => {
    const { behandling } = useRevurderingOmgjøring();
    const { sak } = useSak();

    const { omgjørVedtak, klagebehandlingId } = behandling;

    const erVedtatt = behandling.status === Rammebehandlingsstatus.VEDTATT;

    const vedtakSomBlirOmgjort = erVedtatt
        ? hentRammevedtak(sak, omgjørVedtak)
        : hentGjeldendeRammevedtak(sak, omgjørVedtak);

    if (!vedtakSomBlirOmgjort) {
        return (
            <Alert variant={'error'}>
                {`Teknisk feil: Fant ikke vedtak som skal omgjøres for behandling-id: ${behandling.id} og omgjørVedtak-id: ${omgjørVedtak}`}
            </Alert>
        );
    }

    return (
        <VStack gap="space-8">
            <Heading size={'medium'} level={'1'} spacing={true}>
                {klagebehandlingId ? 'Omgjøring etter klage' : 'Omgjøring'}
            </Heading>

            {erVedtatt ? (
                <OppsummeringsPar
                    label={'Vedtaksperiode'}
                    verdi={periodeTilFormatertDatotekst(behandling.vedtaksperiode!)}
                    variant={'inlineColon'}
                />
            ) : (
                <BodyShort>
                    {`Omgjør vedtak med dato ${formaterTidspunkt(vedtakSomBlirOmgjort.opprettet)} - `}
                    <Link
                        href={behandlingUrl({
                            saksnummer: sak.saksnummer,
                            id: vedtakSomBlirOmgjort.behandlingId,
                        })}
                        target={'_blank'}
                    >
                        {'Se opprinnelig vedtak (åpner i ny fane)'}
                        <TabsIcon title={'Se vedtak (åpner i ny fane)'} />
                    </Link>
                </BodyShort>
            )}
        </VStack>
    );
};
