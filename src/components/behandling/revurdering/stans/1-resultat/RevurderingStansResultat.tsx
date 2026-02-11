import { Alert, Checkbox, HStack, Link } from '@navikt/ds-react';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Datovelger } from '../../../../datovelger/Datovelger';
import { dateTilISOTekst, datoMin } from '~/utils/date';
import { useSak } from '~/context/sak/SakContext';
import { useConfig } from '~/context/ConfigContext';
import {
    useRevurderingStansSkjema,
    useRevurderingStansSkjemaDispatch,
} from '~/components/behandling/context/revurdering/revurderingStansSkjemaContext';
import { StansOgOpphørHjemmelVelger } from '~/components/behandling/revurdering/felles/opphør-hjemmel-velger/StansOgOpphørHjemmelVelger';

import style from './RevurderingStansResultat.module.css';

export const RevurderingStansResultat = () => {
    const { førsteDagSomGirRett, sisteDagSomGirRett } = useSak().sak;

    const { hjemlerForStans, fraDato, harValgtStansFraFørsteDagSomGirRett, erReadonly } =
        useRevurderingStansSkjema();
    const dispatch = useRevurderingStansSkjemaDispatch();

    const { gosysUrl, modiaPersonoversiktUrl } = useConfig();

    const gosysLinkComponent = <Link href={gosysUrl}>Gosys</Link>;
    const modiaPersonoversiktLinkComponent = (
        <Link href={modiaPersonoversiktUrl}>Modia personoversikt</Link>
    );

    const nåtid = new Date();

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <Alert className={style.alert} variant={'warning'} inline>
                    Husk å vurdere om du må forhåndsvarsle bruker før du foretar en stans. Dette må
                    gjøres via {gosysLinkComponent} eller {modiaPersonoversiktLinkComponent}.
                </Alert>

                <StansOgOpphørHjemmelVelger
                    label={'Hjemmel for stans'}
                    valgteHjemler={hjemlerForStans}
                    onChange={(hjemler) =>
                        dispatch({
                            type: 'setHjemlerForStans',
                            payload: { hjemler },
                        })
                    }
                />

                <HStack align={'end'} gap={'space-16'}>
                    <Datovelger
                        label={'Stans fra og med'}
                        minDate={førsteDagSomGirRett}
                        maxDate={sisteDagSomGirRett}
                        readOnly={erReadonly || harValgtStansFraFørsteDagSomGirRett}
                        defaultSelected={fraDato}
                        defaultMonth={
                            sisteDagSomGirRett ? datoMin(nåtid, sisteDagSomGirRett) : nåtid
                        }
                        selected={fraDato}
                        className={style.dato}
                        onDateChange={(valgtDato) => {
                            if (!valgtDato) {
                                return;
                            }

                            dispatch({
                                type: 'setStansFraDato',
                                payload: {
                                    fraDato: dateTilISOTekst(valgtDato),
                                },
                            });
                        }}
                    />

                    <Checkbox
                        readOnly={erReadonly}
                        defaultChecked={harValgtStansFraFørsteDagSomGirRett}
                        onChange={(e) => {
                            const { checked } = e.target;

                            if (checked) {
                                dispatch({
                                    type: 'setStansFraDato',
                                    payload: {
                                        fraDato: førsteDagSomGirRett!,
                                    },
                                });
                            }

                            dispatch({
                                type: 'setHarValgtFørsteDagSomGirRett',
                                payload: { harValgtFørsteDagSomGirRett: checked },
                            });
                        }}
                    >
                        Stans fra første dag som gir rett
                    </Checkbox>
                </HStack>
            </VedtakSeksjon.Venstre>
        </VedtakSeksjon>
    );
};
