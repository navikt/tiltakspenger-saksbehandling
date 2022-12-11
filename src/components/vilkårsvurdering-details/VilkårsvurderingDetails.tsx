import React from 'react';
import { Alert, Heading } from '@navikt/ds-react';
import ParagraphExpand from '../paragraph-expand/ParagraphExpand';
import StatligeYtelserTable from '../statlige-ytelser-table/StatligeYtelserTable';
import KommunaleYtelserContent from '../kommunale-ytelser-content/KommunaleYtelserContent';
import PensjonsordningerTable from '../pensjonsordninger-table/PensjonsordningerTable';
import LønnsinntekterTable from '../lønnsinntekter-table/LønnsinntekterTable';
import InstitusjonsoppholdTable from '../institusjonsopphold-table/InstitusjonsoppholdTable';
import BarnetilleggTable from '../barnetillegg/BarnetilleggTable';
import TiltakspengerYtelserTable from '../tiltakspenger-ytelser-table/TiltakspengerYtelserTable';
import Behandling from '../../types/Behandling';
import { formatDate } from '../../utils/date';
import HarStatligYtelseMelding from '../har-statlig-ytelse-melding/HarStatligYtelseMelding';
import HarKommunalYtelseMelding from '../har-kommunal-ytelse-melding/HarKommunalYtelseMelding';
import HarPensjonsordningMelding from '../har-pensjonsordning-melding/HarPensjonsordningMelding';
import HarInstitusjonsoppholdMelding from '../har-institusjonsopphold-melding/HarInstitusjonsoppholdMelding';
import HarLønnsinntektMelding from '../har-lønnsinntekt-melding/HarLønnsinntektMelding';
import styles from './VilkårsvurderingDetails.module.css';

interface VilkårsvurderingDetailsProps {
    søknadResponse: Behandling;
}

const VilkårsvurderingDetails = ({
    søknadResponse: {
        tiltakspengerYtelser,
        statligeYtelser,
        kommunaleYtelser,
        pensjonsordninger,
        lønnsinntekt,
        institusjonsopphold,
        barnetillegg,
        registrerteTiltak,
        søknad: { startdato, sluttdato },
    },
}: VilkårsvurderingDetailsProps) => {
    const dagpengePerioder = statligeYtelser.finnDagpengeperioder();
    const aapPerioder = statligeYtelser.finnAapPerioder();
    const kvpPerioder = kommunaleYtelser.finnKvpPerioderFraSøknaden();
    const introPerioder = kommunaleYtelser.finnIntroprogramPerioderFraSøknaden();
    const pensjonsordningPerioder = pensjonsordninger.finnPensjonsordningerOppgittISøknaden();
    const lønnsinntektPerioder = lønnsinntekt.finnLønnsinntektOppgittISøknaden();
    const institusjonsoppholdPerioder = institusjonsopphold.finnInstitusjonsoppholdOppgittISøknaden();
    const tiltakspengerPerioder = tiltakspengerYtelser.finnPerioderTilManuellVurdering();
    const visManglendeRegistrertTiltakMelding = !registrerteTiltak || registrerteTiltak.length === 0;
    return (
        <div className={styles.vilkårsvurderingDetails}>
            <Heading level="1" size="small">
                Søknad
            </Heading>
            <Alert variant="info" fullWidth style={{ marginTop: '1rem' }}>
                Foreløpig har vi ikke alle opplysninger til å vurdere søknaden
            </Alert>
            {visManglendeRegistrertTiltakMelding && (
                <Alert variant="warning" fullWidth style={{ marginTop: '1rem', paddingBottom: 0 }}>
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
            {kvpPerioder.length > 0 && (
                <HarKommunalYtelseMelding perioder={kvpPerioder} ytelseText="Kvalifiseringsprogrammet" />
            )}
            {introPerioder.length > 0 && (
                <HarKommunalYtelseMelding perioder={introPerioder} ytelseText="Introduksjonsprogrammet" />
            )}
            {pensjonsordningPerioder.length > 0 && <HarPensjonsordningMelding perioder={pensjonsordningPerioder} />}
            {institusjonsoppholdPerioder.length > 0 && (
                <HarInstitusjonsoppholdMelding perioder={institusjonsoppholdPerioder} />
            )}
            {lønnsinntektPerioder.length > 0 && <HarLønnsinntektMelding perioder={lønnsinntektPerioder} />}
            <div style={{ marginTop: '4rem' }}>
                <ParagraphExpand title="Tiltakspenger (§7)">
                    <TiltakspengerYtelserTable tiltakspengerYtelser={tiltakspengerYtelser} />
                </ParagraphExpand>
                <ParagraphExpand title="Statlige ytelser (§7)">
                    <StatligeYtelserTable statligeYtelser={statligeYtelser} />
                </ParagraphExpand>
                <ParagraphExpand title="Kommunale ytelser (§7)">
                    <KommunaleYtelserContent kommunaleYtelser={kommunaleYtelser} />
                </ParagraphExpand>
                <ParagraphExpand title="Pensjonsordninger (§7)">
                    <PensjonsordningerTable pensjonsordninger={pensjonsordninger} />
                </ParagraphExpand>
                <ParagraphExpand title="Lønnsinntekt (§8)">
                    <span>Foreløpig har vi ikke alle opplysninger</span>
                    <LønnsinntekterTable lønnsinntekt={lønnsinntekt}></LønnsinntekterTable>
                </ParagraphExpand>
                <ParagraphExpand title="Institusjon (§9)">
                    <span>Foreløpig har vi ikke alle opplysninger</span>
                    <InstitusjonsoppholdTable institusjonsopphold={institusjonsopphold} />
                </ParagraphExpand>
                <ParagraphExpand title="Barnetillegg (§3)">
                    <span>Foreløpig viser vi bare data fra søknaden</span>
                    <BarnetilleggTable barnetillegg={barnetillegg} />
                </ParagraphExpand>
            </div>
        </div>
    );
};

export default VilkårsvurderingDetails;
