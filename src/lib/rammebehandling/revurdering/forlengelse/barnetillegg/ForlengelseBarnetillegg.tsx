import { BodyShort, Heading, HStack, List, VStack } from '@navikt/ds-react';
import { CheckboxMedLabelTilVenstre } from '~/lib/_felles/checkbox/CheckboxMedLabelTilVenstre';
import { VedtakSeksjon } from '~/lib/rammebehandling/felles/layout/seksjon/VedtakSeksjon';
import { VedtakHjelpetekst } from '~/lib/rammebehandling/felles/layout/hjelpetekst/VedtakHjelpetekst';
import { BehandlingBarnetillegg } from '~/lib/rammebehandling/felles/barnetillegg/BehandlingBarnetillegg';
import {
    erLagretMedSammeTilOgMed,
    useForlengelseBehandling,
    useRevurderingForlengelseSkjema,
    useRevurderingForlengelseSkjemaDispatch,
} from '~/lib/rammebehandling/context/revurdering/revurderingForlengelseSkjemaContext';
import { formaterPeriode } from '~/utils/date';
import { Infokort } from '~/lib/_felles/infokort/Infokort';

export const ForlengelseBarnetillegg = () => {
    const behandling = useForlengelseBehandling();
    const skjema = useRevurderingForlengelseSkjema();
    const { harEndretBarnetillegg, innvilgelse, erReadonly } = skjema;
    const dispatch = useRevurderingForlengelseSkjemaDispatch();

    const endreBarnetillegg = (
        <CheckboxMedLabelTilVenstre
            size={'small'}
            readOnly={erReadonly || behandling.kanIkkeUtledeBarnetillegg}
            checked={harEndretBarnetillegg}
            onChange={(e) =>
                dispatch({
                    type: 'settHarValgtBarnetillegg',
                    payload: {
                        harEndretBarnetillegg: e.target.checked,
                        behandling,
                    },
                })
            }
        >
            {'Endre barnetillegg'}
        </CheckboxMedLabelTilVenstre>
    );

    if (harEndretBarnetillegg) {
        return (
            <BehandlingBarnetillegg
                headerHandling={endreBarnetillegg}
                varsel={
                    behandling.kanIkkeUtledeBarnetillegg && (
                        <Infokort variant={'advarsel'} size={'small'}>
                            {
                                'Barnetillegget kunne ikke utledes fra søknaden, så antall barn i vedtaket som forlenges er videreført uendret.'
                            }
                            {
                                ' Du må vurdere barnetillegget selv, for eksempel om noen barn fyller 16 år i forlengelsen.'
                            }
                        </Infokort>
                    )
                }
            />
        );
    }

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre gap={'space-8'}>
                <HStack justify={'space-between'} align={'center'}>
                    <Heading level={'3'} size={'small'}>
                        {'Barnetillegg'}
                    </Heading>
                    {endreBarnetillegg}
                </HStack>
                <VStack gap={'space-8'}>
                    {!innvilgelse.harValgtPeriode ||
                    !erLagretMedSammeTilOgMed(skjema, behandling) ? (
                        <BodyShort size={'small'} weight={'semibold'}>
                            {'Barnetillegget oppdateres når behandlingen lagres.'}
                        </BodyShort>
                    ) : innvilgelse.barnetilleggPerioder.length > 0 ? (
                        <div>
                            <BodyShort>{'Barnetillegg som videreføres:'}</BodyShort>
                            <List>
                                {innvilgelse.barnetilleggPerioder.map((bt) => (
                                    <List.Item key={bt.periode.fraOgMed}>
                                        {`${bt.antallBarn} barn i perioden ${formaterPeriode(bt.periode)}`}
                                    </List.Item>
                                ))}
                            </List>
                        </div>
                    ) : (
                        <BodyShort size={'small'} weight={'semibold'}>
                            {'Ingen barnetillegg i forlengelsen.'}
                        </BodyShort>
                    )}
                </VStack>
            </VedtakSeksjon.Venstre>

            <VedtakSeksjon.Høyre>
                <VedtakHjelpetekst>
                    {'Barnetillegget videreføres fra vedtaket som forlenges.'}
                    {' Barn som fyller 16 år i forlengelsen faller bort fra og med fødselsdagen.'}
                    {
                        ' Dersom barnetillegget er endret i forhold til søknaden, må disse endringene videreføres manuelt.'
                    }
                </VedtakHjelpetekst>
            </VedtakSeksjon.Høyre>
        </VedtakSeksjon>
    );
};
