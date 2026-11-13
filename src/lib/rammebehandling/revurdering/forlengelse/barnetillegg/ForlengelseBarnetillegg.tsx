import { BodyShort, Heading, HStack, List, VStack } from '@navikt/ds-react';
import { CheckboxMedLabelTilVenstre } from '~/lib/_felles/checkbox/CheckboxMedLabelTilVenstre';
import { VedtakSeksjon } from '~/lib/rammebehandling/felles/layout/seksjon/VedtakSeksjon';
import { VedtakHjelpetekst } from '~/lib/rammebehandling/felles/layout/hjelpetekst/VedtakHjelpetekst';
import { BehandlingBarnetillegg } from '~/lib/rammebehandling/felles/barnetillegg/BehandlingBarnetillegg';
import {
    useForlengelseBehandling,
    useRevurderingForlengelseSkjema,
    useRevurderingForlengelseSkjemaDispatch,
    visesUtledetBarnetillegg,
} from '~/lib/rammebehandling/context/revurdering/revurderingForlengelseSkjemaContext';
import { formaterPeriode } from '~/utils/date';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { kunPerioderMedBarn } from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggUtils';
import { BarnetilleggVersjon } from '~/lib/rammebehandling/typer/Barnetillegg';
import { formaterBarnNavn } from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggBarnUtils';
import { formaterSladdbarDatotekst } from '~/utils/date';

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

    const utledetBarnetillegg = behandling.barnetillegg;
    const utledetePerioderMedBarn = utledetBarnetillegg?.perioder.filter(kunPerioderMedBarn) ?? [];

    if (harEndretBarnetillegg) {
        return (
            <BehandlingBarnetillegg
                headerHandling={endreBarnetillegg}
                varsel={
                    behandling.kanIkkeUtledeBarnetillegg && (
                        <Infokort variant={'advarsel'} size={'small'}>
                            {'Barnetillegget kunne ikke utledes fra vedtaket som forlenges.'}
                            {
                                ' Du må vurdere barnetillegget selv, og velge hvilke barn det skal innvilges barnetillegg for.'
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
                    !visesUtledetBarnetillegg(skjema, behandling) ? (
                        <BodyShort size={'small'} weight={'semibold'}>
                            {'Barnetillegget oppdateres når behandlingen lagres.'}
                        </BodyShort>
                    ) : utledetePerioderMedBarn.length > 0 ? (
                        <>
                            <div>
                                <BodyShort>{'Barnetillegg som videreføres:'}</BodyShort>
                                <List>
                                    {utledetePerioderMedBarn.map((bt) => (
                                        <List.Item key={bt.periode.fraOgMed}>
                                            {`${bt.antallBarn} barn i perioden ${formaterPeriode(bt.periode)}`}
                                        </List.Item>
                                    ))}
                                </List>
                            </div>
                            {utledetBarnetillegg?.versjon === BarnetilleggVersjon.V2 && (
                                <div>
                                    <BodyShort>{'Barn:'}</BodyShort>
                                    <List>
                                        {utledetBarnetillegg.barn.map((barn, index) => (
                                            <List.Item key={index}>
                                                {`${formaterBarnNavn(barn)} (født ${formaterSladdbarDatotekst(barn.fødselsdato)})`}
                                                {barn.perioderMedBarnetillegg.length > 0
                                                    ? `: ${barn.perioderMedBarnetillegg.map(formaterPeriode).join(', ')}`
                                                    : ': Gir ikke barnetillegg i forlengelsen'}
                                            </List.Item>
                                        ))}
                                    </List>
                                </div>
                            )}
                        </>
                    ) : (
                        <BodyShort size={'small'} weight={'semibold'}>
                            {'Ingen barnetillegg i forlengelsen.'}
                        </BodyShort>
                    )}
                </VStack>
            </VedtakSeksjon.Venstre>

            <VedtakSeksjon.Høyre>
                <VedtakHjelpetekst>
                    {'Barnetillegget videreføres for barna i vedtaket som forlenges.'}
                    {' Barn som fyller 16 år i forlengelsen faller bort fra og med fødselsdagen.'}
                    {
                        ' Er barnetillegget i vedtaket som forlenges registrert som antall barn per periode, utledes det fra søknaden. Endringer gjort i forhold til søknaden må da videreføres manuelt.'
                    }
                </VedtakHjelpetekst>
            </VedtakSeksjon.Høyre>
        </VedtakSeksjon>
    );
};
