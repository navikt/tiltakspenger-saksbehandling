import { VedtakSeksjon } from '~/lib/rammebehandling/felles/layout/seksjon/VedtakSeksjon';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { BodyShort, Heading, HStack, List, Radio, RadioGroup, VStack } from '@navikt/ds-react';
import { ReactNode } from 'react';
import { BarnetilleggBegrunnelse } from './begrunnelse/BarnetilleggBegrunnelse';
import { BarnetilleggTidslinje } from '~/lib/rammebehandling/felles/barnetillegg/tidslinje/BarnetilleggTidslinje';
import {
    barnetilleggForInnvilgelsesperiodene,
    harSøktBarnetillegg,
    kunPerioderMedBarn,
} from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggUtils';
import { useSak } from '~/lib/sak/SakContext';
import { useBehandling } from '~/lib/rammebehandling/context/BehandlingContext';
import {
    useBehandlingInnvilgelseMedPerioderSkjema,
    useBehandlingInnvilgelseSkjemaDispatch,
} from '~/lib/rammebehandling/context/innvilgelse/innvilgelseContext';
import { periodiseringTotalPeriode } from '~/utils/periode';
import { formaterPeriode } from '~/utils/date';
import { BarnetilleggBarnListe } from '~/lib/rammebehandling/felles/barnetillegg/barn/BarnetilleggBarnListe';
import { periodiserBarnetilleggFraBarn } from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggBarnUtils';
import {
    hentLagretBarnetillegg,
    hentLagretV1SomIkkeKanEndres,
} from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggSkjemaUtils';
import { BarnetilleggPeriode, BarnetilleggVersjon } from '~/lib/rammebehandling/typer/Barnetillegg';

import style from './BehandlingBarnetillegg.module.css';

type Props = {
    // Vises til høyre for overskriften, f.eks. en checkbox for å slå av redigeringen.
    headerHandling?: ReactNode;
    // Vises under overskriften.
    varsel?: ReactNode;
};

export const BehandlingBarnetillegg = ({ headerHandling, varsel }: Props) => {
    const { sak } = useSak();
    const { behandling } = useBehandling();

    const { innvilgelse, erReadonly } = useBehandlingInnvilgelseMedPerioderSkjema();
    const { harBarnetillegg, innvilgelsesperioder, valgteBarn } = innvilgelse;

    const innvilgelseTotalPeriode = periodiseringTotalPeriode(innvilgelsesperioder);

    const dispatch = useBehandlingInnvilgelseSkjemaDispatch();

    const lagretBarnetillegg = hentLagretBarnetillegg(behandling);
    const erLagretSomV1 = lagretBarnetillegg?.versjon === BarnetilleggVersjon.V1;
    const visesSomV1 = hentLagretV1SomIkkeKanEndres(behandling, erReadonly) !== null;

    const innvilgetePerioder = innvilgelsesperioder.map((it) => it.periode);

    // Når behandlingen ikke kan endres vises de lagrede periodene, som også teller med barn med sladdede opplysninger
    const barnetilleggEtter = barnetilleggForInnvilgelsesperiodene(
        !harBarnetillegg
            ? []
            : erReadonly && lagretBarnetillegg
              ? lagretBarnetillegg.perioder
              : periodiserBarnetilleggFraBarn(valgteBarn, innvilgetePerioder),
        innvilgetePerioder,
    );

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.FullBredde gap={'space-24'}>
                <VStack gap={'space-8'}>
                    <HStack justify={'space-between'} align={'center'}>
                        <Heading level={'3'} size={'small'}>
                            {'Barnetillegg'}
                        </Heading>
                        {headerHandling}
                    </HStack>
                    {varsel}
                    <Infokort variant={'info'} size={'small'}>
                        <VStack gap={'space-8'}>
                            <BodyShort size={'small'}>
                                {
                                    'Nytt: Du velger nå hvilke barn det innvilges barnetillegg for, i stedet for å registrere antall barn per periode. Barna hentes fra søknaden og tidligere vedtak, og du kan legge til barn selv.'
                                }
                            </BodyShort>
                            <BodyShort size={'small'}>
                                {
                                    'Barnetillegget gis for hele innvilgelsesperioden, og avkortes automatisk for barn som blir født eller fyller 16 år i perioden. Du kan også velge egne perioder for hvert barn.'
                                }
                            </BodyShort>
                            {lagretBarnetillegg && erLagretSomV1 && (
                                <TidligereRegistrertBarnetillegg
                                    perioder={lagretBarnetillegg.perioder}
                                    visesSomV1={visesSomV1}
                                />
                            )}
                        </VStack>
                    </Infokort>
                </VStack>

                <BarnetilleggTidslinje
                    periode={innvilgelseTotalPeriode}
                    etter={barnetilleggEtter}
                />

                <VStack gap={'space-12'}>
                    <RadioGroup
                        legend={'Skal det innvilges barnetillegg?'}
                        size={'small'}
                        className={style.radioGroup}
                        value={harBarnetillegg}
                        readOnly={erReadonly}
                        onChange={(harSøkt: boolean) => {
                            dispatch({
                                type: 'setHarSøktBarnetillegg',
                                payload: { harSøkt },
                            });
                        }}
                    >
                        <Radio value={true}>{'Ja'}</Radio>
                        <Radio value={false}>{'Nei'}</Radio>
                    </RadioGroup>
                    {!harBarnetillegg &&
                        harSøktBarnetillegg(innvilgelseTotalPeriode, behandling, sak) && (
                            <Infokort variant={'info'} size={'small'}>
                                Husk å begrunne avslaget på barnetillegg i vedtaksbrevet.
                            </Infokort>
                        )}
                </VStack>

                {harBarnetillegg && !visesSomV1 && <BarnetilleggBarnListe />}
            </VedtakSeksjon.FullBredde>

            {harBarnetillegg && <BarnetilleggBegrunnelse />}
        </VedtakSeksjon>
    );
};

type TidligereRegistrertProps = {
    perioder: BarnetilleggPeriode[];
    visesSomV1: boolean;
};

const TidligereRegistrertBarnetillegg = ({ perioder, visesSomV1 }: TidligereRegistrertProps) => (
    <>
        <BodyShort size={'small'}>
            {visesSomV1
                ? 'Denne behandlingen er registrert som antall barn per periode, uten informasjon om hvilke barn det gjelder:'
                : 'Denne behandlingen ble registrert som antall barn per periode, så du må velge barna på nytt. Tidligere registrert:'}
        </BodyShort>
        {perioder.some(kunPerioderMedBarn) ? (
            <List size={'small'}>
                {perioder.filter(kunPerioderMedBarn).map((bt) => (
                    <List.Item key={bt.periode.fraOgMed}>
                        {`${bt.antallBarn} barn i perioden ${formaterPeriode(bt.periode)}`}
                    </List.Item>
                ))}
            </List>
        ) : (
            <BodyShort size={'small'}>{'Det var ikke registrert barnetillegg.'}</BodyShort>
        )}
    </>
);
