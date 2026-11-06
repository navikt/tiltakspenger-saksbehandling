import { BodyShort, Box, Button, Dialog, HStack, List, Tag, VStack } from '@navikt/ds-react';
import { BehandlingSaksopplysning } from '../BehandlingSaksopplysning';
import { kildeTekst, prosentTekst } from '../tiltak/tiltaksdeltakelseVisning';
import { erNyEndring, erUtdatert, innslagForTiltak } from './tiltakshistorikkVisning';
import {
    Tiltakshistorikkinnslag,
    TiltakshistorikkForBehandling,
} from '~/lib/rammebehandling/typer/Tiltakshistorikk';
import { tiltakDeltakerstatusTekst } from '~/lib/rammebehandling/typer/Tiltaksdeltakelse';
import { endringTekst } from '~/lib/rammebehandling/felles/tiltaksdeltaker-endring/tiltaksdeltakerEndringTekst';
import { formaterDatotekst, formaterTidspunktMedSekunder } from '~/utils/date';
import { Tidspunkt } from '~/types/DatoTid';
import { ÅpenPeriode } from '~/types/Periode';

type Props = {
    internDeltakelseId: string;
    typeNavn: string;
    tiltakshistorikk: TiltakshistorikkForBehandling;
    sistEndret: Tidspunkt;
    oppslagstidspunkt: Tidspunkt;
};

/**
 * Knapp som åpner tiltakshistorikken for tiltaket i en modal.
 * Er saksopplysningene utdaterte for tiltaket, vises også det nyeste innslaget.
 */
export const TiltakshistorikkForTiltak = ({
    internDeltakelseId,
    typeNavn,
    tiltakshistorikk,
    sistEndret,
    oppslagstidspunkt,
}: Props) => {
    const innslag = innslagForTiltak(tiltakshistorikk.innslag, internDeltakelseId);

    if (innslag.length === 0) {
        return null;
    }

    const [nyeste] = innslag;
    const erNy = (innslag: Tiltakshistorikkinnslag) =>
        tiltakshistorikk.harEndringEtterSistEndret && erNyEndring(innslag, sistEndret);

    return (
        <VStack gap={'space-8'} align={'start'}>
            {erUtdatert(innslag, oppslagstidspunkt) && (
                <Box
                    background={'warning-soft'}
                    borderColor={'warning-subtle'}
                    borderWidth={'1'}
                    borderRadius={'8'}
                    padding={'space-8'}
                >
                    <VStack gap={'space-4'}>
                        <BodyShort size={'small'} weight={'semibold'}>
                            {'Tiltaksdeltakelsen er endret etter at saksopplysningene ble hentet'}
                        </BodyShort>
                        <TiltakshistorikkinnslagVisning innslag={nyeste} erNy={erNy(nyeste)} />
                    </VStack>
                </Box>
            )}
            <Dialog>
                <Dialog.Trigger>
                    <Button size={'xsmall'} variant={'secondary'} type={'button'}>
                        {`Vis tiltakshistorikk (${innslag.length})`}
                    </Button>
                </Dialog.Trigger>
                <Dialog.Popup>
                    <Dialog.Header>
                        <Dialog.Title>{`Tiltakshistorikk for ${typeNavn}`}</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <VStack gap={'space-16'}>
                            {innslag.map((it) => (
                                <TiltakshistorikkinnslagVisning
                                    key={it.id}
                                    innslag={it}
                                    erNy={erNy(it)}
                                />
                            ))}
                        </VStack>
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Dialog.CloseTrigger>
                            <Button variant={'secondary'}>{'Lukk'}</Button>
                        </Dialog.CloseTrigger>
                    </Dialog.Footer>
                </Dialog.Popup>
            </Dialog>
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
