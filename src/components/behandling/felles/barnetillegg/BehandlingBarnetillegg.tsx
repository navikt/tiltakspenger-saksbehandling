import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Alert, Heading, Radio, RadioGroup } from '@navikt/ds-react';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { classNames } from '~/utils/classNames';
import { BehandlingBarnetilleggPerioder } from './perioder/BehandlingBarnetilleggPerioder';
import { BarnetilleggBegrunnelse } from './begrunnelse/BarnetilleggBegrunnelse';
import { BehandlingData } from '~/types/BehandlingTypes';
import { useRolleForBehandling } from '~/context/saksbehandler/SaksbehandlerContext';
import { Dispatch } from 'react';
import {
    BarnetilleggActions,
    BarnetilleggBegrunnelseInput,
    BarnetilleggState,
} from '~/components/behandling/felles/state/BarnetilleggState';
import {
    InnvilgelseActions,
    InnvilgelseState,
} from '~/components/behandling/felles/state/InnvilgelseState';
import { OppdaterBarnetilleggRequest, VedtakBarnetilleggDTO } from '~/types/Barnetillegg';
import { BarnetilleggTidslinje } from '~/components/behandling/felles/barnetillegg/tidslinje/BarnetilleggTidslinje';
import { harSøktBarnetillegg } from '~/components/behandling/felles/barnetillegg/utils/barnetilleggUtils';
import { useSak } from '~/context/sak/SakContext';

import style from './BehandlingBarnetillegg.module.css';

export type BehandlingBarnetilleggProps = {
    behandling: BehandlingData;
    dispatch: Dispatch<BarnetilleggActions | InnvilgelseActions>;
    context: InnvilgelseState & BarnetilleggState & BarnetilleggBegrunnelseInput;
    valgTekst: string;
    lagring: {
        url: string;
        body: (tekst: string) => OppdaterBarnetilleggRequest | VedtakBarnetilleggDTO;
    };
};

export const BehandlingBarnetillegg = (props: BehandlingBarnetilleggProps) => {
    const { behandling, dispatch, context, valgTekst } = props;
    const { harBarnetillegg, behandlingsperiode } = context;

    const { sak } = useSak();

    const rolle = useRolleForBehandling(behandling);

    return (
        <>
            <VedtakSeksjon>
                <VedtakSeksjon.Venstre>
                    <Heading level={'3'} size={'xsmall'} className={style.header}>
                        {'Barnetillegg'}
                    </Heading>
                </VedtakSeksjon.Venstre>

                <VedtakSeksjon.FullBredde className={style.pølseSeksjon}>
                    <BarnetilleggTidslinje behandlingsperiode={behandlingsperiode} />
                </VedtakSeksjon.FullBredde>

                <VedtakSeksjon.Venstre>
                    <RadioGroup
                        legend={valgTekst}
                        size={'small'}
                        className={style.radioGroup}
                        defaultValue={harBarnetillegg}
                        readOnly={rolle !== SaksbehandlerRolle.SAKSBEHANDLER}
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
                        harSøktBarnetillegg(behandlingsperiode, behandling, sak) && (
                            <Alert className={style.infoboks} variant={'info'} size={'small'}>
                                Husk å begrunne avslaget på barnetillegg i vedtaksbrevet.
                            </Alert>
                        )}
                </VedtakSeksjon.Venstre>
            </VedtakSeksjon>

            <VedtakSeksjon className={classNames(style.input, !harBarnetillegg && style.skjult)}>
                <BehandlingBarnetilleggPerioder {...props} />
                <BarnetilleggBegrunnelse {...props} />
            </VedtakSeksjon>
        </>
    );
};
