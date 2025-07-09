import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Heading, Radio, RadioGroup } from '@navikt/ds-react';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { classNames } from '~/utils/classNames';
import { BehandlingBarnetilleggPerioder } from './perioder/BehandlingBarnetilleggPerioder';
import { BarnetilleggBegrunnelse } from './begrunnelse/BarnetilleggBegrunnelse';
import { BehandlingData } from '~/types/BehandlingTypes';
import { useRolleForBehandling } from '~/context/saksbehandler/SaksbehandlerContext';
import { Dispatch, RefObject } from 'react';
import {
    BarnetilleggActions,
    BarnetilleggState,
} from '~/components/behandling/felles/state/BarnetilleggState';
import {
    InnvilgelseActions,
    InnvilgelseState,
} from '~/components/behandling/felles/state/InnvilgelseState';

import style from './BehandlingBarnetillegg.module.css';
import { VedtakBarnetilleggDTO, VedtakTilBeslutningDTO } from '~/types/VedtakTyper';

export type BehandlingBarnetilleggProps = {
    behandling: BehandlingData;
    dispatch: Dispatch<BarnetilleggActions | InnvilgelseActions>;
    context: BarnetilleggState &
        InnvilgelseState & { barnetilleggBegrunnelseRef: RefObject<HTMLTextAreaElement> };
    valgTekst: string;
    lagring: {
        url: string;
        body: (tekst: string) => VedtakTilBeslutningDTO | VedtakBarnetilleggDTO;
    };
};

export const BehandlingBarnetillegg = (props: BehandlingBarnetilleggProps) => {
    const { behandling, dispatch, context, valgTekst } = props;
    const { harBarnetillegg } = context;

    const rolle = useRolleForBehandling(behandling);

    return (
        <>
            <VedtakSeksjon>
                <VedtakSeksjon.Venstre>
                    <Heading level={'3'} size={'xsmall'} className={style.header}>
                        {'Barnetillegg'}
                    </Heading>
                </VedtakSeksjon.Venstre>

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
                </VedtakSeksjon.Venstre>
            </VedtakSeksjon>

            <VedtakSeksjon className={classNames(style.input, !harBarnetillegg && style.skjult)}>
                <BehandlingBarnetilleggPerioder {...props} />
                <BarnetilleggBegrunnelse {...props} />
            </VedtakSeksjon>
        </>
    );
};
