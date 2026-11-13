import { BehandlingSaksopplysning } from '../BehandlingSaksopplysning';
import { formaterPeriode } from '~/utils/date';
import { erLukketPeriode } from '~/utils/periode';
import {
    tiltakDeltakerstatusTekst,
    Tiltaksdeltakelse,
    TiltaksdeltakelseSomFratarRett,
} from '~/lib/rammebehandling/typer/Tiltaksdeltakelse';
import { BodyShort, Heading, ReadMore, VStack } from '@navikt/ds-react';
import { Periode } from '~/types/Periode';
import { Nullable } from '~/types/UtilTypes';
import {
    delOppTiltaksdeltakelser,
    kildeTekst,
    prosentTekst,
    tiltaksnavnTekst,
} from './tiltaksdeltakelseVisning';
import { GirIkkeRettTag } from './GirIkkeRettTag';
import { TiltakshistorikkForTiltak } from '../tiltakshistorikk/TiltakshistorikkForTiltak';
import { TiltakshistorikkForBehandling } from '~/lib/rammebehandling/typer/Tiltakshistorikk';
import { Tidspunkt } from '~/types/DatoTid';
import { useCtrlHoldesInne } from '~/utils/useCtrlHoldesInne';
import { RichTooltip } from '~/lib/_felles/tooltip/RichTooltip';
import { DetaljHorisontal } from '~/lib/_felles/detaljer/DetaljHorisontal';
import { SakId } from '~/lib/sak/SakTyper';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';
import { useHentTiltaksdata } from './useHentTiltaksdata';

import style from './BehandlingTiltakOpplysninger.module.css';

type Historikk = {
    tiltakshistorikk: TiltakshistorikkForBehandling;
    sistEndret: Tidspunkt;
    oppslagstidspunkt: Tidspunkt;
};

/**
 * Slår opp hele tiltaksnavnet til en deltakelse, gitt den eksterne id-en.
 */
type HentTiltaksnavn = (eksternDeltakelseId: string) => string;

type Props = {
    sakId: SakId;
    behandlingId: RammebehandlingId;
    tiltaksdeltakelser: Tiltaksdeltakelse[];
    tiltaksdeltakelserSomFratarRett: TiltaksdeltakelseSomFratarRett[];
    vurderingsperiode: Nullable<Periode>;
    historikk: Historikk;
};

export const BehandlingTiltakOpplysninger = ({
    sakId,
    behandlingId,
    tiltaksdeltakelser,
    tiltaksdeltakelserSomFratarRett,
    vurderingsperiode,
    historikk,
}: Props) => {
    const tiltaksdataOppslag = useHentTiltaksdata(sakId, behandlingId, historikk.oppslagstidspunkt);
    const tiltaksnavn: HentTiltaksnavn = (eksternDeltakelseId) =>
        tiltaksnavnTekst(tiltaksdataOppslag, eksternDeltakelseId);

    return (
        <VStack gap="space-16">
            <TiltakSomGirRett
                tiltaksdeltakelser={tiltaksdeltakelser}
                vurderingsperiode={vurderingsperiode}
                historikk={historikk}
                tiltaksnavn={tiltaksnavn}
            />
            {tiltaksdeltakelserSomFratarRett.length > 0 && (
                <TiltakSomFratarRettListe
                    tiltaksdeltakelser={tiltaksdeltakelserSomFratarRett}
                    tiltaksnavn={tiltaksnavn}
                />
            )}
        </VStack>
    );
};

const TiltakSomGirRett = ({
    tiltaksdeltakelser,
    vurderingsperiode,
    historikk,
    tiltaksnavn,
}: Pick<Props, 'tiltaksdeltakelser' | 'vurderingsperiode' | 'historikk'> & {
    tiltaksnavn: HentTiltaksnavn;
}) => {
    if (tiltaksdeltakelser.length === 0) {
        return <BodyShort size={'small'}>{'Ingen relevante tiltaksdeltakelser'}</BodyShort>;
    }

    const { aktuelle, historiske } = delOppTiltaksdeltakelser(
        tiltaksdeltakelser,
        vurderingsperiode,
    );

    return (
        <VStack gap={'space-8'}>
            {aktuelle.length > 0 ? (
                <TiltakListe
                    tiltaksdeltakelser={aktuelle}
                    historikk={historikk}
                    tiltaksnavn={tiltaksnavn}
                />
            ) : (
                <BodyShort size={'small'}>{'Ingen aktuelle tiltaksdeltakelser'}</BodyShort>
            )}
            {historiske.length > 0 && (
                <ReadMore size={'small'} header={`Tidligere tiltak (${historiske.length})`}>
                    <TiltakListe
                        tiltaksdeltakelser={historiske}
                        historikk={historikk}
                        tiltaksnavn={tiltaksnavn}
                    />
                </ReadMore>
            )}
        </VStack>
    );
};

const TiltakSomFratarRettListe = ({
    tiltaksdeltakelser,
    tiltaksnavn,
}: {
    tiltaksdeltakelser: TiltaksdeltakelseSomFratarRett[];
    tiltaksnavn: HentTiltaksnavn;
}) => {
    const visIder = useCtrlHoldesInne();

    return (
        <VStack gap={'space-12'}>
            {tiltaksdeltakelser.map((tiltak) => {
                const {
                    eksternDeltakelseId,
                    typeNavn,
                    periode,
                    deltakelseStatus,
                    deltakelseProsent,
                    antallDagerPerUke,
                    kilde,
                } = tiltak;

                return (
                    <RichTooltip
                        key={eksternDeltakelseId}
                        content={<TiltakIder eksternDeltakelseId={eksternDeltakelseId} />}
                        placement={'right'}
                        className={style.tiltakIder}
                        deaktivert={!visIder}
                    >
                        <VStack gap={'space-4'} align={'start'}>
                            <TiltakHeader typeNavn={typeNavn} />
                            <GirIkkeRettTag />
                            <div>
                                <BehandlingSaksopplysning
                                    navn={'Tiltaksnavn'}
                                    verdi={tiltaksnavn(eksternDeltakelseId)}
                                />
                                <BehandlingSaksopplysning
                                    navn={'Periode'}
                                    verdi={
                                        erLukketPeriode(periode)
                                            ? formaterPeriode(periode)
                                            : 'Ukjent'
                                    }
                                />
                                <BehandlingSaksopplysning
                                    navn={'Registerkilde'}
                                    verdi={kildeTekst[kilde]}
                                />
                                <BehandlingSaksopplysning
                                    navn={'Status'}
                                    verdi={tiltakDeltakerstatusTekst[deltakelseStatus]}
                                />
                                <BehandlingSaksopplysning
                                    navn={'Antall dager i uka'}
                                    verdi={antallDagerPerUke?.toString() ?? 'Ukjent'}
                                />
                                <BehandlingSaksopplysning
                                    navn={'Deltakelsesprosent'}
                                    verdi={prosentTekst(deltakelseProsent)}
                                />
                            </div>
                        </VStack>
                    </RichTooltip>
                );
            })}
        </VStack>
    );
};

const TiltakListe = ({
    tiltaksdeltakelser,
    historikk,
    tiltaksnavn,
}: {
    tiltaksdeltakelser: Tiltaksdeltakelse[];
    historikk: Historikk;
    tiltaksnavn: HentTiltaksnavn;
}) => {
    const visIder = useCtrlHoldesInne();

    return (
        <VStack gap="space-12">
            {tiltaksdeltakelser.map((tiltak) => {
                const {
                    antallDagerPerUke,
                    deltakelseProsent,
                    deltakelseStatus,
                    periode,
                    typeNavn,
                    kilde,
                    gjennomføringId,
                    gjennomforingsprosent,
                    eksternDeltagelseId,
                    internDeltakelseId,
                } = tiltak;

                return (
                    <RichTooltip
                        key={eksternDeltagelseId}
                        content={
                            <TiltakIder
                                eksternDeltakelseId={eksternDeltagelseId}
                                gjennomføringId={gjennomføringId}
                                internDeltakelseId={internDeltakelseId}
                            />
                        }
                        placement={'right'}
                        className={style.tiltakIder}
                        deaktivert={!visIder}
                    >
                        <VStack gap={'space-8'} align={'start'}>
                            <TiltakHeader typeNavn={typeNavn} />
                            <TiltakshistorikkForTiltak
                                internDeltakelseId={internDeltakelseId}
                                typeNavn={typeNavn}
                                {...historikk}
                            />
                            <div>
                                <BehandlingSaksopplysning
                                    navn={'Tiltaksnavn'}
                                    verdi={tiltaksnavn(eksternDeltagelseId)}
                                />
                                {erLukketPeriode(periode) && (
                                    <BehandlingSaksopplysning
                                        navn={'Periode'}
                                        verdi={formaterPeriode(periode)}
                                    />
                                )}
                                <BehandlingSaksopplysning
                                    navn={'Registerkilde'}
                                    verdi={kildeTekst[kilde]}
                                />
                                <BehandlingSaksopplysning
                                    navn={'Status'}
                                    verdi={deltakelseStatus}
                                />
                                <BehandlingSaksopplysning
                                    navn={'Antall dager i uka'}
                                    verdi={antallDagerPerUke?.toString() ?? 'Ukjent'}
                                />
                                <BehandlingSaksopplysning
                                    navn={'Deltakelsesprosent'}
                                    verdi={prosentTekst(deltakelseProsent)}
                                />
                                <BehandlingSaksopplysning
                                    navn={'Gjennomføringsprosent'}
                                    verdi={prosentTekst(gjennomforingsprosent) ?? 'Ukjent'}
                                />
                            </div>
                        </VStack>
                    </RichTooltip>
                );
            })}
        </VStack>
    );
};

const TiltakHeader = ({ typeNavn }: { typeNavn: string }) => (
    <Heading size={'xsmall'} level={'4'}>
        {typeNavn}
    </Heading>
);

/**
 * Id-ene til deltakelsen, til feilsøking.
 * Deltakelser som fratar rett har verken gjennomføring eller intern id.
 */
const TiltakIder = ({
    eksternDeltakelseId,
    gjennomføringId,
    internDeltakelseId,
}: {
    eksternDeltakelseId: string;
    gjennomføringId?: string | null;
    internDeltakelseId?: string;
}) => (
    <VStack gap={'space-4'}>
        <DetaljHorisontal navn={'Deltakelse-id:'} size={'small'}>
            {eksternDeltakelseId}
        </DetaljHorisontal>
        {gjennomføringId !== undefined && (
            <DetaljHorisontal navn={'Gjennomføring-id:'} size={'small'}>
                {gjennomføringId ?? 'Ukjent'}
            </DetaljHorisontal>
        )}
        {internDeltakelseId !== undefined && (
            <DetaljHorisontal navn={'Intern id:'} size={'small'}>
                {internDeltakelseId}
            </DetaljHorisontal>
        )}
    </VStack>
);
