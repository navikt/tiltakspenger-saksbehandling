import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Alert, Heading, Radio, RadioGroup } from '@navikt/ds-react';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { classNames } from '~/utils/classNames';
import { BehandlingBarnetilleggPerioder } from './perioder/BehandlingBarnetilleggPerioder';
import { BarnetilleggBegrunnelse } from './begrunnelse/BarnetilleggBegrunnelse';
import { BarnetilleggTidslinje } from '~/components/behandling/felles/barnetillegg/tidslinje/BarnetilleggTidslinje';
import { harSøktBarnetillegg } from '~/components/behandling/felles/barnetillegg/utils/barnetilleggUtils';
import { useSak } from '~/context/sak/SakContext';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';
import {
    useBehandlingInnvilgelseMedPerioderSkjema,
    useBehandlingInnvilgelseSkjemaDispatch,
} from '~/components/behandling/context/innvilgelse/innvilgelseContext';

import style from './BehandlingBarnetillegg.module.css';

export const BehandlingBarnetillegg = () => {
    const { sak } = useSak();
    const { behandling, rolleForBehandling } = useBehandling();

    const { harBarnetillegg, innvilgelsesperiode } =
        useBehandlingInnvilgelseMedPerioderSkjema().innvilgelse;
    const dispatch = useBehandlingInnvilgelseSkjemaDispatch();

    return (
        <>
            <VedtakSeksjon>
                <VedtakSeksjon.Venstre>
                    <Heading level={'3'} size={'xsmall'} className={style.header}>
                        {'Barnetillegg'}
                    </Heading>
                </VedtakSeksjon.Venstre>

                <VedtakSeksjon.FullBredde className={style.pølseSeksjon}>
                    <BarnetilleggTidslinje innvilgelsesperiode={innvilgelsesperiode} />
                </VedtakSeksjon.FullBredde>

                <VedtakSeksjon.Venstre>
                    <RadioGroup
                        legend={'Skal det innvilges barnetillegg?'}
                        size={'small'}
                        className={style.radioGroup}
                        value={harBarnetillegg}
                        readOnly={rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER}
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
                        harSøktBarnetillegg(innvilgelsesperiode, behandling, sak) && (
                            <Alert className={style.infoboks} variant={'info'} size={'small'}>
                                Husk å begrunne avslaget på barnetillegg i vedtaksbrevet.
                            </Alert>
                        )}
                </VedtakSeksjon.Venstre>
            </VedtakSeksjon>

            <VedtakSeksjon className={classNames(style.input, !harBarnetillegg && style.skjult)}>
                <BehandlingBarnetilleggPerioder />
                <BarnetilleggBegrunnelse />
            </VedtakSeksjon>
        </>
    );
};
