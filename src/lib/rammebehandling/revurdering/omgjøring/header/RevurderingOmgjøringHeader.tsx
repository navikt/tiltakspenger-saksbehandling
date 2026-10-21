import { BodyShort, Heading, Link, VStack } from '@navikt/ds-react';
import { isNonNullish, nonNullish } from '~/utils/object';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { Rammebehandlingsstatus } from '~/lib/rammebehandling/typer/Rammebehandling';
import { formaterTidspunkt, formaterPeriode } from '~/utils/date';
import { OppsummeringsPar } from '~/lib/behandling-felles/oppsummeringer/oppsummeringspar/OppsummeringsPar';
import { behandlingUrl } from '~/utils/urls';
import { useRevurderingOmgjøring } from '~/lib/rammebehandling/context/BehandlingContext';
import { useSak } from '~/lib/sak/SakContext';
import { hentGjeldendeRammevedtak, hentRammevedtak } from '~/lib/sak/sakUtils';

export const RevurderingOmgjøringHeader = () => {
    const { behandling } = useRevurderingOmgjøring();
    const { sak } = useSak();

    const { omgjørRammevedtak, klagebehandlingId } = behandling;

    const erVedtatt = behandling.status === Rammebehandlingsstatus.VEDTATT;

    const vedtakIder = omgjørRammevedtak
        .map((it) => it.vedtakId)
        .filter((vedtakId, index, array) => array.indexOf(vedtakId) === index);

    const vedtakSomBlirOmgjort = vedtakIder.map((vedtakId) =>
        erVedtatt ? hentRammevedtak(sak, vedtakId) : hentGjeldendeRammevedtak(sak, vedtakId),
    );

    if (vedtakSomBlirOmgjort.some((vedtak) => !vedtak)) {
        return (
            <Infokort variant={'feil'}>
                {`Teknisk feil: Fant ikke vedtak som skal omgjøres for behandling-id: ${behandling.id} og vedtak-id-er: ${vedtakIder.join(', ')}`}
            </Infokort>
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
                    verdi={formaterPeriode(nonNullish(behandling.vedtaksperiode))}
                    variant={'inlineColon'}
                />
            ) : vedtakSomBlirOmgjort.length === 0 ? (
                <BodyShort>
                    {'Vedtakene som omgjøres bestemmes av vedtaksperioden du velger.'}
                </BodyShort>
            ) : (
                vedtakSomBlirOmgjort.filter(isNonNullish).map((vedtak) => (
                    <BodyShort key={vedtak.id}>
                        {`Omgjør vedtak med dato ${formaterTidspunkt(vedtak.opprettet)} - `}
                        <Link
                            href={behandlingUrl({
                                saksnummer: sak.saksnummer,
                                id: vedtak.behandlingId,
                            })}
                        >
                            {'Se opprinnelig vedtak'}
                        </Link>
                    </BodyShort>
                ))
            )}
        </VStack>
    );
};
