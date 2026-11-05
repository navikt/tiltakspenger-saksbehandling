import { BodyShort, HStack, List, ReadMore, Tag, VStack } from '@navikt/ds-react';
import { BehandlingSaksopplysning } from '../BehandlingSaksopplysning';
import { kildeTekst, prosentTekst } from '../tiltak/tiltaksdeltakelseVisning';
import { erNyEndring, sorterNyesteFørst } from './tiltakshistorikkVisning';
import {
    Tiltakshistorikkinnslag,
    TiltakshistorikkForBehandling,
} from '~/lib/rammebehandling/typer/Tiltakshistorikk';
import { tiltakDeltakerstatusTekst } from '~/lib/rammebehandling/typer/Tiltaksdeltakelse';
import { endringTekst } from '~/lib/rammebehandling/felles/tiltaksdeltaker-endring/tiltaksdeltakerEndringTekst';
import { formaterDatotekst, formaterTidspunktMedSekunder } from '~/utils/date';
import { Tidspunkt } from '~/types/DatoTid';
import { ÅpenPeriode } from '~/types/Periode';

const ANTALL_SYNLIGE = 3;

type Props = {
    tiltakshistorikk: TiltakshistorikkForBehandling;
    sistEndret: Tidspunkt;
};

export const BehandlingTiltakshistorikk = ({ tiltakshistorikk, sistEndret }: Props) => {
    const { innslag, harEndringEtterSistEndret } = tiltakshistorikk;

    if (innslag.length === 0) {
        return (
            <BodyShort size={'small'}>
                {'Ingen endringer i tiltaksdeltakelsene er registrert for behandlingen'}
            </BodyShort>
        );
    }

    const sortert = sorterNyesteFørst(innslag);
    const synlige = sortert.slice(0, ANTALL_SYNLIGE);
    const eldre = sortert.slice(ANTALL_SYNLIGE);

    const visInnslag = (innslag: Tiltakshistorikkinnslag) => (
        <TiltakshistorikkinnslagVisning
            key={innslag.id}
            innslag={innslag}
            erNy={harEndringEtterSistEndret && erNyEndring(innslag, sistEndret)}
        />
    );

    return (
        <VStack gap={'space-12'}>
            {synlige.map(visInnslag)}
            {eldre.length > 0 && (
                <ReadMore size={'small'} header={`Eldre endringer (${eldre.length})`}>
                    <VStack gap={'space-12'}>{eldre.map(visInnslag)}</VStack>
                </ReadMore>
            )}
        </VStack>
    );
};

const TiltakshistorikkinnslagVisning = ({
    innslag,
    erNy,
}: {
    innslag: Tiltakshistorikkinnslag;
    erNy: boolean;
}) => {
    const {
        innhentet,
        typeNavn,
        periode,
        deltakelseStatus,
        kildestatus,
        antallDagerPerUke,
        deltakelseProsent,
        kilde,
        eksternDeltagelseId,
        endringer,
        utløsteBehandlingen,
    } = innslag;

    return (
        <VStack gap={'space-4'} align={'start'}>
            <HStack gap={'space-4'} align={'center'}>
                <BodyShort size={'small'} weight={'semibold'}>
                    {formaterTidspunktMedSekunder(innhentet)}
                </BodyShort>
                {utløsteBehandlingen && (
                    <Tag data-color={'info'} variant={'outline'} size={'xsmall'}>
                        {'Utløste behandlingen'}
                    </Tag>
                )}
                {erNy && (
                    <Tag data-color={'warning'} variant={'outline'} size={'xsmall'}>
                        {'Ny endring'}
                    </Tag>
                )}
            </HStack>
            <div>
                <BehandlingSaksopplysning navn={'Type'} verdi={typeNavn} />
                <BehandlingSaksopplysning navn={'Periode'} verdi={periodeTekst(periode)} />
                <BehandlingSaksopplysning
                    navn={'Status'}
                    verdi={
                        deltakelseStatus ? tiltakDeltakerstatusTekst[deltakelseStatus] : kildestatus
                    }
                />
                <BehandlingSaksopplysning
                    navn={'Antall dager i uka'}
                    verdi={antallDagerPerUke?.toString() ?? 'Ukjent'}
                />
                <BehandlingSaksopplysning
                    navn={'Deltakelsesprosent'}
                    verdi={prosentTekst(deltakelseProsent)}
                />
                <BehandlingSaksopplysning navn={'Registerkilde'} verdi={kildeTekst[kilde]} />
                <BehandlingSaksopplysning navn={'Deltakelse-id'} verdi={eksternDeltagelseId} />
            </div>
            {endringer.length > 0 && (
                <div>
                    <BodyShort size={'small'}>{'Endringer som påvirker saken:'}</BodyShort>
                    <List size={'small'}>
                        {endringer.map((endring) => (
                            <List.Item key={endring.type}>{endringTekst(endring)}</List.Item>
                        ))}
                    </List>
                </div>
            )}
        </VStack>
    );
};

const periodeTekst = ({ fraOgMed, tilOgMed }: ÅpenPeriode) =>
    `${fraOgMed ? formaterDatotekst(fraOgMed) : 'Ukjent'} - ${tilOgMed ? formaterDatotekst(tilOgMed) : 'Ukjent'}`;
