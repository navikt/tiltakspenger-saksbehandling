import { Alert, Link, Select } from '@navikt/ds-react';
import style from './RevurderingStansResultat.module.css';
import { useRevurderingVedtak } from '../../RevurderingVedtakContext';
import { useRevurderingBehandling } from '../../../BehandlingContext';
import { useSendRevurderingVedtak } from '../useSendRevurderingVedtak';
import { SaksbehandlerRolle } from '../../../../../types/Saksbehandler';
import { VedtakSeksjon } from '../../../vedtak-layout/seksjon/VedtakSeksjon';
import { Datovelger } from '../../../../datovelger/Datovelger';
import { dateTilISOTekst } from '../../../../../utils/date';
import React from 'react';
import { useSak } from '../../../../../context/sak/SakContext';
import { useConfig } from '../../../../../context/ConfigContext';

enum ValgtHjemmelForStans {
    DELTAR_IKKE_PÅ_ARBEIDSMARKEDSTILTAK = 'DeltarIkkePåArbeidsmarkedstiltak',
    ALDER = 'Alder',
    LIVSOPPHOLDYTELSER = 'Livsoppholdytelser',
    KVALIFISERINGSPROGRAMMET = 'Kvalifiseringsprogrammet',
    INTRODUKSJONSPROGRAMMET = 'Introduksjonsprogrammet',
    LØNN_FRA_TILTAKSARRANGØR = 'LønnFraTiltaksarrangør',
    LØNN_FRA_ANDRE = 'LønnFraAndre',
    INSTITUSJONSOPPHOLD = 'Institusjonsopphold',
}

export type ValgtHjemmelForStansOption = {
    beskrivelse: string;
    kode: ValgtHjemmelForStans;
};

export const RevurderingStansResultat = () => {
    const revurderingVedtak = useRevurderingVedtak();
    const { førsteLovligeStansdato, sisteDagSomGirRett } = useSak().sak;
    const {
        stansdato,
        setStansdato,
        valgtHjemmelHarIkkeRettighet,
        setValgtHjemmelHarIkkeRettighet,
    } = revurderingVedtak;

    const { behandling, rolleForBehandling } = useRevurderingBehandling();
    const { gosysUrl, modiaPersonoversiktUrl } = useConfig();

    const {} = useSendRevurderingVedtak(behandling, revurderingVedtak);
    const erSaksbehandler = rolleForBehandling === SaksbehandlerRolle.SAKSBEHANDLER;

    const gosysLinkComponent = <Link href={gosysUrl}>Gosys</Link>;
    const modiaPersonoversiktLinkComponent = (
        <Link href={modiaPersonoversiktUrl}>Modia personoversikt</Link>
    );

    const options: ValgtHjemmelForStansOption[] = [
        {
            beskrivelse: 'Ingen deltagelse - tiltakspengeforskriften § 2',
            kode: ValgtHjemmelForStans.DELTAR_IKKE_PÅ_ARBEIDSMARKEDSTILTAK,
        },
        {
            beskrivelse: 'Alder - tiltakspengeforskriften § 3',
            kode: ValgtHjemmelForStans.ALDER,
        },
        {
            beskrivelse: 'Andre livsoppholdsytelser - tiltakspengeforskriften § 7, første ledd',
            kode: ValgtHjemmelForStans.LIVSOPPHOLDYTELSER,
        },
        {
            beskrivelse: 'KVP - tiltakspengeforskriften § 7, tredje ledd',
            kode: ValgtHjemmelForStans.KVALIFISERINGSPROGRAMMET,
        },
        {
            beskrivelse: 'Introduksjonsprogram - tiltakspengeforskriften § 7, tredje ledd',
            kode: ValgtHjemmelForStans.INTRODUKSJONSPROGRAMMET,
        },
        {
            beskrivelse: 'Lønn fra tiltaksarrangør - tiltakspengeforskriften § 8',
            kode: ValgtHjemmelForStans.LØNN_FRA_TILTAKSARRANGØR,
        },
        {
            beskrivelse: 'Lønn fra andre - arbeidsmarkedsloven § 13',
            kode: ValgtHjemmelForStans.LØNN_FRA_ANDRE,
        },
        {
            beskrivelse: 'Institusjon - tiltakspengeforskriften § 9',
            kode: ValgtHjemmelForStans.INSTITUSJONSOPPHOLD,
        },
    ];

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <Alert className={style.alert} variant={'warning'} inline>
                    <>
                        Husk å vurdere om du må forhåndsvarsle bruker før du foretar en stans. Dette
                        må gjøres via {gosysLinkComponent} eller {modiaPersonoversiktLinkComponent}.
                    </>
                </Alert>
                <Select
                    label={'Hjemmel for stans'}
                    size={'medium'}
                    readOnly={!erSaksbehandler}
                    defaultValue={(valgtHjemmelHarIkkeRettighet?.[0] ?? '') as ValgtHjemmelForStans}
                    onChange={(event) => {
                        setValgtHjemmelHarIkkeRettighet([
                            event.target.value as ValgtHjemmelForStans,
                        ]);
                    }}
                >
                    <option value={''}>{'- Velg hjemmel for stans -'}</option>
                    {options.map((option) => (
                        <option key={option.kode} value={option.kode}>
                            {option.beskrivelse}
                        </option>
                    ))}
                </Select>
                <Datovelger
                    label={'Stans fra og med'}
                    minDate={førsteLovligeStansdato}
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
