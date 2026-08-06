import { VedtakSeksjon } from '~/lib/rammebehandling/felles/layout/seksjon/VedtakSeksjon';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { Heading, Radio, RadioGroup } from '@navikt/ds-react';
import { BehandlingBarnetilleggPerioder } from './perioder/BehandlingBarnetilleggPerioder';
import { BarnetilleggBegrunnelse } from './begrunnelse/BarnetilleggBegrunnelse';
import { BarnetilleggTidslinje } from '~/lib/rammebehandling/felles/barnetillegg/tidslinje/BarnetilleggTidslinje';
import { harSøktBarnetillegg } from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggUtils';
import { useSak } from '~/lib/sak/SakContext';
import { useBehandling } from '~/lib/rammebehandling/context/BehandlingContext';
import {
    useBehandlingInnvilgelseMedPerioderSkjema,
    useBehandlingInnvilgelseSkjemaDispatch,
} from '~/lib/rammebehandling/context/innvilgelse/innvilgelseContext';
import { periodiseringTotalPeriode } from '~/utils/periode';

import style from './BehandlingBarnetillegg.module.css';

export const BehandlingBarnetillegg = () => {
    const { sak } = useSak();
    const { behandling } = useBehandling();

    const { innvilgelse, erReadonly } = useBehandlingInnvilgelseMedPerioderSkjema();
    const { harBarnetillegg, innvilgelsesperioder } = innvilgelse;

    const innvilgelseTotalPeriode = periodiseringTotalPeriode(innvilgelsesperioder);

    const dispatch = useBehandlingInnvilgelseSkjemaDispatch();

    return (
        <>
            <VedtakSeksjon>
                <VedtakSeksjon.Venstre>
                    <Heading level={'3'} size={'small'} className={style.header}>
                        {'Barnetillegg'}
                    </Heading>
                </VedtakSeksjon.Venstre>

                <VedtakSeksjon.FullBredde className={style.pølseSeksjon}>
                    <BarnetilleggTidslinje innvilgelsesperiode={innvilgelseTotalPeriode} />
                </VedtakSeksjon.FullBredde>

                <VedtakSeksjon.Venstre>
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
                            <Infokort variant={'info'} className={style.infoboks} size={'small'}>
                                Husk å begrunne avslaget på barnetillegg i vedtaksbrevet.
                            </Infokort>
                        )}
                </VedtakSeksjon.Venstre>
            </VedtakSeksjon>

            {harBarnetillegg && (
                <VedtakSeksjon>
                    <BehandlingBarnetilleggPerioder />
                    <BarnetilleggBegrunnelse />
                </VedtakSeksjon>
            )}
        </>
    );
};
