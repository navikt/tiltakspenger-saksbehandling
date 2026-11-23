import { AutomatiskOpprettetGrunn } from '~/lib/rammebehandling/typer/Revurdering';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { VedtakSeksjon } from '~/lib/rammebehandling/felles/layout/seksjon/VedtakSeksjon';
import { BodyShort, HStack, List, Tag, VStack } from '@navikt/ds-react';
import { endringTekst } from '~/lib/rammebehandling/felles/tiltaksdeltaker-endring/tiltaksdeltakerEndringTekst';
import { ManueltBehandlesGrunn } from '~/lib/rammebehandling/typer/Rammebehandling';
import { ManueltBehandlesGrunnerInfo } from '~/lib/rammebehandling/felles/manuelt-behandles-grunner/ManueltBehandlesGrunnerInfo';
import { formaterTidspunkt } from '~/utils/date';

type Props = {
    automatiskOpprettedeGrunner: AutomatiskOpprettetGrunn[];
    manueltBehandlesGrunner: ManueltBehandlesGrunn[];
};

/**
 * Viser endringene i tiltaksdeltakelsen som førte til at revurderingen ble opprettet, og senere endringer som er lagt til den.
 * Grunner som er lagt til etter at behandlingen sist ble lagret, er markert, siden saksbehandler kanskje ikke har sett dem.
 */
export const RevurderingAutomatiskOpprettetGrunn = ({
    automatiskOpprettedeGrunner,
    manueltBehandlesGrunner,
}: Props) => {
    const harNyeGrunner = automatiskOpprettedeGrunner.some((it) => it.lagtTilEtterSistEndret);

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre gap={'space-16'}>
                {harNyeGrunner && (
                    <Infokort variant={'advarsel'} size={'small'}>
                        {
                            'Tiltaksdeltakelsen er endret igjen etter at behandlingen sist ble lagret. Se gjennom de nye endringene.'
                        }
                    </Infokort>
                )}
                <Infokort
                    variant={'info'}
                    size={'small'}
                    header={'Automatisk opprettet revurdering'}
                >
                    <VStack gap={'space-12'}>
                        <BodyShort size={'small'}>
                            {automatiskOpprettedeGrunner.length > 1
                                ? 'Revurderingen ble automatisk opprettet og senere oppdatert på grunn av endringer i tiltaksdeltakelsen:'
                                : 'Revurderingen ble automatisk opprettet på grunn av endringer i tiltaksdeltakelsen:'}
                        </BodyShort>
                        {automatiskOpprettedeGrunner.map((grunn, index) => (
                            <GrunnVisning key={`${grunn.lagtTil}-${index}`} grunn={grunn} />
                        ))}
                    </VStack>
                </Infokort>
                <ManueltBehandlesGrunnerInfo grunner={manueltBehandlesGrunner} />
            </VedtakSeksjon.Venstre>
        </VedtakSeksjon>
    );
};

const GrunnVisning = ({ grunn }: { grunn: AutomatiskOpprettetGrunn }) => (
    <div>
        <HStack gap={'space-8'} align={'center'}>
            <BodyShort size={'small'} weight={'semibold'}>
                {`Lagt til ${formaterTidspunkt(grunn.lagtTil)}`}
            </BodyShort>
            {grunn.lagtTilEtterSistEndret && (
                <Tag data-color={'warning'} variant={'outline'} size={'xsmall'}>
                    {'Ny endring'}
                </Tag>
            )}
        </HStack>
        <List size={'small'}>
            {grunn.endringer.map((endring) => (
                <List.Item key={endring.type}>{endringTekst(endring)}</List.Item>
            ))}
        </List>
    </div>
);
