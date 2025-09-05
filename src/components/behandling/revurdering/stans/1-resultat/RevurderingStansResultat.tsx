import { Alert, Link, Select } from '@navikt/ds-react';
import style from './RevurderingStansResultat.module.css';
import { useRevurderingStansVedtak } from '../RevurderingStansVedtakContext';
import { useRevurderingBehandling } from '../../../BehandlingContext';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Datovelger } from '../../../../datovelger/Datovelger';
import { dateTilISOTekst } from '~/utils/date';
import React from 'react';
import { useSak } from '~/context/sak/SakContext';
import { useConfig } from '~/context/ConfigContext';
import { ValgtHjemmelForStans } from '~/types/BehandlingTypes';

export const RevurderingStansResultat = () => {
    const revurderingVedtak = useRevurderingStansVedtak();
    const { førsteDagSomGirRett, sisteDagSomGirRett } = useSak().sak;
    const {
        stansdato,
        setStansdato,
        valgtHjemmelHarIkkeRettighet,
        setValgtHjemmelHarIkkeRettighet,
    } = revurderingVedtak;

    const { rolleForBehandling } = useRevurderingBehandling();
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
                    defaultValue={valgtHjemmelHarIkkeRettighet[0] ?? defaultValue}
                    onChange={(event) => {
                        const valg = event.target.value as
                            | ValgtHjemmelForStans
                            | typeof defaultValue;
                        setValgtHjemmelHarIkkeRettighet(valg === defaultValue ? [] : [valg]);
                    }}
                >
                    <option value={defaultValue}>{'- Velg hjemmel for stans -'}</option>
                    {Object.entries(options).map(([kode, beskrivelse]) => (
                        <option key={kode} value={kode}>
                            {beskrivelse}
                        </option>
                    ))}
                </Select>
                <Datovelger
                    label={'Stans fra og med'}
                    minDate={førsteDagSomGirRett}
                    maxDate={sisteDagSomGirRett}
                    defaultSelected={stansdato}
                    readOnly={!erSaksbehandler}
                    className={style.dato}
                    onDateChange={(valgtDato) => {
                        if (valgtDato) {
                            setStansdato(dateTilISOTekst(valgtDato));
                        } else {
                            setStansdato('');
                        }
                    }}
                />
            </VedtakSeksjon.Venstre>
        </VedtakSeksjon>
    );
};

const defaultValue = '';

const options: Record<ValgtHjemmelForStans, string> = {
    [ValgtHjemmelForStans.DELTAR_IKKE_PÅ_ARBEIDSMARKEDSTILTAK]:
        'Ingen deltagelse - tiltakspengeforskriften § 2',
    [ValgtHjemmelForStans.ALDER]: 'Alder - tiltakspengeforskriften § 3',
    [ValgtHjemmelForStans.LIVSOPPHOLDYTELSER]:
        'Andre livsoppholdsytelser - tiltakspengeforskriften § 7, første ledd',
    [ValgtHjemmelForStans.KVALIFISERINGSPROGRAMMET]:
        'KVP - tiltakspengeforskriften § 7, tredje ledd',
    [ValgtHjemmelForStans.INTRODUKSJONSPROGRAMMET]:
        'Introduksjonsprogram - tiltakspengeforskriften § 7, tredje ledd',
    [ValgtHjemmelForStans.LØNN_FRA_TILTAKSARRANGØR]:
        'Lønn fra tiltaksarrangør - tiltakspengeforskriften § 8',
    [ValgtHjemmelForStans.LØNN_FRA_ANDRE]: 'Lønn fra andre - arbeidsmarkedsloven § 13',
    [ValgtHjemmelForStans.INSTITUSJONSOPPHOLD]: 'Institusjon - tiltakspengeforskriften § 9',
} as const;
