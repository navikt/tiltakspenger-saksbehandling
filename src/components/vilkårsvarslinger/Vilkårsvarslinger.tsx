import { Alert } from '@navikt/ds-react';
import dayjs from 'dayjs';
import { Behandling, KlarBehandling } from '../../types/Behandling';
import { formatDate } from '../../utils/date';
import BrukerFyller18ÅrIPeriodenMelding from '../bruker-fyller-18-år-i-perioden-melding/BrukerFyller18ÅrIPeriodenMelding';
import BrukerUnder18ÅrIHelePeriodenMelding from '../bruker-under-18-år-i-hele-perioden-melding/BrukerUnder18ÅrIHelePeriodenMelding';
import HarInstitusjonsoppholdMelding from '../har-institusjonsopphold-melding/HarInstitusjonsoppholdMelding';
import HarIntroprogramDeltakelseMelding from '../har-introprogram-deltakelse-melding/HarIntroprogramDeltakelseMelding';
import HarKvpDeltakelseMelding from '../har-kvp-deltakelse-melding/HarKvpDeltakelseMelding';
import HarLønnsinntektMelding from '../har-lønnsinntekt-melding/HarLønnsinntektMelding';
import HarPensjonsordningMelding from '../har-pensjonsordning-melding/HarPensjonsordningMelding';
import HarStatligYtelseMelding from '../har-statlig-ytelse-melding/HarStatligYtelseMelding';

interface VilkårsvarslingerProps {
    behandling: KlarBehandling;
    fødselsdato: string;
}

function Vilkårsvarslinger({ behandling, fødselsdato }: VilkårsvarslingerProps) {
    const {
        tiltakspengerYtelser,
        statligeYtelser,
        kommunaleYtelser,
        pensjonsordninger,
        lønnsinntekt,
        registrerteTiltak,
        institusjonsopphold,
        alderVilkårsvurdering,
        søknad: { startdato, sluttdato },
    } = behandling;

    const dagpengePerioder = statligeYtelser.finnDagpengeperioder();
    const aapPerioder = statligeYtelser.finnAapPerioder();
    const kvpPerioder = kommunaleYtelser.finnKvpPerioderFraSøknaden();
    const introPerioder = kommunaleYtelser.finnIntroprogramPerioderFraSøknaden();
    const pensjonsordningPerioder = pensjonsordninger.finnPensjonsordningerOppgittISøknaden();
    const lønnsinntektPerioder = lønnsinntekt.finnLønnsinntektOppgittISøknaden();
    const institusjonsoppholdPerioder = institusjonsopphold.finnInstitusjonsoppholdOppgittISøknaden();
    const tiltakspengerPerioder = tiltakspengerYtelser.finnPerioderTilManuellVurdering();

    const periodeBrukerIkkeHarFylt18År = alderVilkårsvurdering.finnPeriodeHvorBrukerIkkeHarFylt18År();
    const datoBrukerFyller18År = dayjs(fødselsdato).add(18, 'years');
    const brukerErUnder18ÅrIHelePerioden = datoBrukerFyller18År.isAfter(dayjs(sluttdato));

    const visManglendeRegistrertTiltakMelding = !registrerteTiltak || registrerteTiltak.length === 0;
    const visMeldingOmAtBrukerFyller18ÅrIPerioden = !brukerErUnder18ÅrIHelePerioden && periodeBrukerIkkeHarFylt18År;

    return (
        <div>
            {brukerErUnder18ÅrIHelePerioden && <BrukerUnder18ÅrIHelePeriodenMelding />}
            {visMeldingOmAtBrukerFyller18ÅrIPerioden && (
                <BrukerFyller18ÅrIPeriodenMelding periode={periodeBrukerIkkeHarFylt18År} />
            )}
            {visManglendeRegistrertTiltakMelding && (
                <Alert variant="warning" style={{ marginTop: '1rem', paddingBottom: 0 }}>
                    <strong>
                        Det er ikke registrert tiltak på bruker i perioden {formatDate(startdato)} -{' '}
                        {formatDate(sluttdato)}
                    </strong>
                    <p>Søknaden trenger manuell behandling</p>
                </Alert>
            )}
            {tiltakspengerPerioder.length > 0 && (
                <HarStatligYtelseMelding perioder={tiltakspengerPerioder} ytelseText="Tiltakspenger" />
            )}
            {dagpengePerioder.length > 0 && (
                <HarStatligYtelseMelding perioder={dagpengePerioder} ytelseText="Dagpenger" />
            )}
            {aapPerioder.length > 0 && <HarStatligYtelseMelding perioder={aapPerioder} ytelseText="AAP" />}
            {kvpPerioder.length > 0 && <HarKvpDeltakelseMelding />}
            {introPerioder.length > 0 && <HarIntroprogramDeltakelseMelding perioder={introPerioder} />}
            {pensjonsordningPerioder.length > 0 && <HarPensjonsordningMelding perioder={pensjonsordningPerioder} />}
            {institusjonsoppholdPerioder.length > 0 && <HarInstitusjonsoppholdMelding />}
            {lønnsinntektPerioder.length > 0 && <HarLønnsinntektMelding perioder={lønnsinntektPerioder} />}
        </div>
    );
}

export default Vilkårsvarslinger;
