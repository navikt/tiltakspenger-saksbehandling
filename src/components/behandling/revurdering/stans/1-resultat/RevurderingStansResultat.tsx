import { Alert, Checkbox, HStack, Link, Select } from '@navikt/ds-react';
import { useRevurderingBehandling } from '../../../context/BehandlingContext';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Datovelger } from '../../../../datovelger/Datovelger';
import { dateTilISOTekst } from '~/utils/date';
import { useSak } from '~/context/sak/SakContext';
import { useConfig } from '~/context/ConfigContext';
import { HjemmelForStans } from '~/types/BehandlingTypes';
import {
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/components/behandling/context/BehandlingSkjemaContext';

import style from './RevurderingStansResultat.module.css';

export const RevurderingStansResultat = () => {
    const { rolleForBehandling } = useRevurderingBehandling();
    const { førsteDagSomGirRett, sisteDagSomGirRett } = useSak().sak;

    const { hjemlerForStans, behandlingsperiode, harValgtStansFraFørsteDagSomGirRett } =
        useBehandlingSkjema();
    const dispatch = useBehandlingSkjemaDispatch();

    const { gosysUrl, modiaPersonoversiktUrl } = useConfig();

    const erSaksbehandler = rolleForBehandling === SaksbehandlerRolle.SAKSBEHANDLER;

    const gosysLinkComponent = <Link href={gosysUrl}>Gosys</Link>;
    const modiaPersonoversiktLinkComponent = (
        <Link href={modiaPersonoversiktUrl}>Modia personoversikt</Link>
    );

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <Alert className={style.alert} variant={'warning'} inline>
                    Husk å vurdere om du må forhåndsvarsle bruker før du foretar en stans. Dette må
                    gjøres via {gosysLinkComponent} eller {modiaPersonoversiktLinkComponent}.
                </Alert>
                <Select
                    label={'Hjemmel for stans'}
                    size={'medium'}
                    readOnly={!erSaksbehandler}
                    defaultValue={hjemlerForStans.at(0) ?? defaultValue}
                    onChange={(event) => {
                        const valg = event.target.value as HjemmelForStans | typeof defaultValue;
                        dispatch({
                            type: 'setHjemlerForStans',
                            payload: { hjemler: valg === defaultValue ? [] : [valg] },
                        });
                    }}
                >
                    <option value={defaultValue}>{'- Velg hjemmel for stans -'}</option>
                    {Object.entries(options).map(([kode, beskrivelse]) => (
                        <option key={kode} value={kode}>
                            {beskrivelse}
                        </option>
                    ))}
                </Select>

                <HStack align={'end'} gap={'4'}>
                    <Datovelger
                        label={'Stans fra og med'}
                        minDate={førsteDagSomGirRett}
                        maxDate={sisteDagSomGirRett}
                        readOnly={!erSaksbehandler || harValgtStansFraFørsteDagSomGirRett}
                        defaultSelected={behandlingsperiode.fraOgMed}
                        selected={behandlingsperiode.fraOgMed}
                        className={style.dato}
                        onDateChange={(valgtDato) => {
                            if (!valgtDato) {
                                return;
                            }

                            dispatch({
                                type: 'oppdaterBehandlingsperiode',
                                payload: {
                                    periode: {
                                        fraOgMed: dateTilISOTekst(valgtDato),
                                    },
                                },
                            });
                        }}
                    />

                    <Checkbox
                        readOnly={!erSaksbehandler}
                        defaultChecked={harValgtStansFraFørsteDagSomGirRett}
                        onChange={(e) => {
                            const { checked } = e.target;

                            if (checked) {
                                dispatch({
                                    type: 'oppdaterBehandlingsperiode',
                                    payload: {
                                        periode: { fraOgMed: førsteDagSomGirRett },
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

const defaultValue = '';

const options: Record<HjemmelForStans, string> = {
    [HjemmelForStans.DELTAR_IKKE_PÅ_ARBEIDSMARKEDSTILTAK]:
        'Ingen deltagelse - tiltakspengeforskriften § 2',
    [HjemmelForStans.ALDER]: 'Alder - tiltakspengeforskriften § 3',
    [HjemmelForStans.LIVSOPPHOLDYTELSER]:
        'Andre livsoppholdsytelser - tiltakspengeforskriften § 7, første ledd',
    [HjemmelForStans.KVALIFISERINGSPROGRAMMET]: 'KVP - tiltakspengeforskriften § 7, tredje ledd',
    [HjemmelForStans.INTRODUKSJONSPROGRAMMET]:
        'Introduksjonsprogram - tiltakspengeforskriften § 7, tredje ledd',
    [HjemmelForStans.LØNN_FRA_TILTAKSARRANGØR]:
        'Lønn fra tiltaksarrangør - tiltakspengeforskriften § 8',
    [HjemmelForStans.LØNN_FRA_ANDRE]: 'Lønn fra andre - arbeidsmarkedsloven § 13',
    [HjemmelForStans.INSTITUSJONSOPPHOLD]: 'Institusjon - tiltakspengeforskriften § 9',
} as const;
