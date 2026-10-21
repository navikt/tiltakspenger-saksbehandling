import { Button, Heading, Radio, RadioGroup } from '@navikt/ds-react';
import { VedtakSeksjon } from '~/lib/rammebehandling/felles/layout/seksjon/VedtakSeksjon';
import {
    useOmgjøringSkjema,
    useOmgjøringSkjemaDispatch,
} from '~/lib/rammebehandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { useRevurderingOmgjøring } from '~/lib/rammebehandling/context/BehandlingContext';
import { OmgjøringResultat, RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { useSak } from '~/lib/sak/SakContext';
import { VedtakHjelpetekst } from '~/lib/rammebehandling/felles/layout/hjelpetekst/VedtakHjelpetekst';

import style from './OmgjøringResultatVelger.module.css';

export const OmgjøringResultatVelger = () => {
    const { behandling } = useRevurderingOmgjøring();
    const { sak } = useSak();

    const { resultat, erReadonly } = useOmgjøringSkjema();
    const dispatch = useOmgjøringSkjemaDispatch();

    const kanInnvilge = sak.tidslinje.elementer.length > 0;
    const kanOpphøre = sak.innvilgetTidslinje.elementer.length > 0;

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
                        ` Det kan kun opphøres dersom saken har gjeldende innvilgelsesperioder.`}
                </VedtakHjelpetekst>
            </VedtakSeksjon.Høyre>
        </VedtakSeksjon>
    );
};
