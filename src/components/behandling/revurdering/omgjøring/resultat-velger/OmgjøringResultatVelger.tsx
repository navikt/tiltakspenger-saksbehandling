import { BodyLong, Button, Heading, Radio, RadioGroup } from '@navikt/ds-react';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import {
    useOmgjøringSkjema,
    useOmgjøringSkjemaDispatch,
} from '~/components/behandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { useRevurderingOmgjøring } from '~/components/behandling/context/BehandlingContext';
import { OmgjøringResultat, RevurderingResultat } from '~/types/Revurdering';
import { useSak } from '~/context/sak/SakContext';
import { useFeatureToggles } from '~/context/feature-toggles/FeatureTogglesContext';
import { hentRammevedtak } from '~/utils/sak';
import { VedtakHjelpetekst } from '~/components/behandling/felles/layout/hjelpetekst/VedtakHjelpetekst';

import style from './OmgjøringResultatVelger.module.css';

export const OmgjøringResultatVelger = () => {
    const { behandling } = useRevurderingOmgjøring();
    const { sak } = useSak();

    const { resultat, erReadonly } = useOmgjøringSkjema();
    const dispatch = useOmgjøringSkjemaDispatch();

    const { opphørToggle } = useFeatureToggles();

    const vedtak = hentRammevedtak(sak, behandling.omgjørVedtak)!;

    const kanInnvilge =
        !!vedtak.gyldigeKommandoer.OMGJØR && vedtak.gjeldendeVedtaksperioder.length > 0;
    const kanOpphøre = opphørToggle && !!vedtak.gyldigeKommandoer.OPPHØR;

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <Heading size={'small'} level={'2'} spacing={true}>
                    {'Resultat'}
                </Heading>

                <RadioGroup
                    legend={'Resultat'}
                    hideLegend={true}
                    size={'small'}
                    className={style.radioGroup}
                    value={resultat}
                    readOnly={erReadonly}
                    onChange={(valgtResultat: OmgjøringResultat) => {
                        dispatch({
                            type: 'setResultat',
                            payload: { resultat: valgtResultat, behandling, sak },
                        });
                    }}
                >
                    <Radio value={RevurderingResultat.OMGJØRING} disabled={!kanInnvilge}>
                        {'Innvilgelse'}
                    </Radio>
                    <Radio value={RevurderingResultat.OMGJØRING_OPPHØR} disabled={!kanOpphøre}>
                        {'Opphør'}
                    </Radio>
                    {resultat !== RevurderingResultat.OMGJØRING_IKKE_VALGT && !erReadonly && (
                        <Button
                            size={'xsmall'}
                            variant={'tertiary'}
                            type={'button'}
                            onClick={() => {
                                dispatch({
                                    type: 'setResultat',
                                    payload: {
                                        resultat: RevurderingResultat.OMGJØRING_IKKE_VALGT,
                                        behandling,
                                        sak,
                                    },
                                });
                            }}
                        >
                            {'Nullstill'}
                        </Button>
                    )}
                </RadioGroup>
            </VedtakSeksjon.Venstre>
            <VedtakSeksjon.Høyre>
                <VedtakHjelpetekst variant={'info'}>
                    {'Velg innvilgelse dersom hele eller deler av omgjøringen skal være en innvilgelse.' +
                        ' Velg opphør dersom omgjøringen skal være et rent opphør.'}
                    {!kanOpphøre &&
                        ` Vedtaket kan kun opphøres dersom det har gjeldende innvilgelsesperioder.`}
                    {!opphørToggle && (
                        <BodyLong size={'small'}>
                            {'(Opphør er foreløpig ikke tilgjengelig i produksjon.)'}
                        </BodyLong>
                    )}
                </VedtakHjelpetekst>
            </VedtakSeksjon.Høyre>
        </VedtakSeksjon>
    );
};
