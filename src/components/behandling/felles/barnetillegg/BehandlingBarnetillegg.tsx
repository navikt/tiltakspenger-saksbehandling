import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Alert, Heading, Radio, RadioGroup } from '@navikt/ds-react';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { classNames } from '~/utils/classNames';
import { BehandlingBarnetilleggPerioder } from './perioder/BehandlingBarnetilleggPerioder';
import { BarnetilleggBegrunnelse } from './begrunnelse/BarnetilleggBegrunnelse';
import { BarnetilleggTidslinje } from '~/components/behandling/felles/barnetillegg/tidslinje/BarnetilleggTidslinje';
import { harSøktBarnetillegg } from '~/components/behandling/felles/barnetillegg/utils/barnetilleggUtils';
import { useSak } from '~/context/sak/SakContext';
import {
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/components/behandling/context/BehandlingSkjemaContext';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';

import style from './BehandlingBarnetillegg.module.css';
import { Periode } from '~/types/Periode';

type Props = {
    valgTekst: string;
};

export const BehandlingBarnetillegg = ({ valgTekst }: Props) => {
    const { harBarnetillegg, behandlingsperiode } = useBehandlingSkjema();
    const dispatch = useBehandlingSkjemaDispatch();

    const { behandling, rolleForBehandling } = useBehandling();

    const { sak } = useSak();

    return (
        <>
            <VedtakSeksjon>
                <VedtakSeksjon.Venstre>
                    <Heading level={'3'} size={'xsmall'} className={style.header}>
                        {'Barnetillegg'}
                    </Heading>
                </VedtakSeksjon.Venstre>

                <VedtakSeksjon.FullBredde className={style.pølseSeksjon}>
                    <BarnetilleggTidslinje behandlingsperiode={behandlingsperiode as Periode} />
                </VedtakSeksjon.FullBredde>

                <VedtakSeksjon.Venstre>
                    <RadioGroup
                        legend={valgTekst}
                        size={'small'}
                        className={style.radioGroup}
                        defaultValue={harBarnetillegg}
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
                        harSøktBarnetillegg(behandlingsperiode as Periode, behandling, sak) && (
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
