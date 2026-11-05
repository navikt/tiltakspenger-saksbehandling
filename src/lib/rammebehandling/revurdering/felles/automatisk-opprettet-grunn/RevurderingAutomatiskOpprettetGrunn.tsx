import { AutomatiskOpprettetGrunn } from '~/lib/rammebehandling/typer/Revurdering';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { VedtakSeksjon } from '~/lib/rammebehandling/felles/layout/seksjon/VedtakSeksjon';
import { List } from '@navikt/ds-react';
import { endringTekst } from '~/lib/rammebehandling/felles/tiltaksdeltaker-endring/tiltaksdeltakerEndringTekst';
import { ManueltBehandlesGrunn } from '~/lib/rammebehandling/typer/Rammebehandling';
import { ManueltBehandlesGrunnerInfo } from '~/lib/rammebehandling/felles/manuelt-behandles-grunner/ManueltBehandlesGrunnerInfo';

type Props = {
    automatiskOpprettetGrunn: AutomatiskOpprettetGrunn;
    manueltBehandlesGrunner: ManueltBehandlesGrunn[];
};

export const RevurderingAutomatiskOpprettetGrunn = ({
    automatiskOpprettetGrunn,
    manueltBehandlesGrunner,
}: Props) => {
    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre gap={'space-16'}>
                <Infokort
                    variant={'info'}
                    size={'small'}
                    header={'Automatisk opprettet revurdering'}
                >
                    {
                        'Revurderingen ble automatisk opprettet på grunn av endringer i tiltaksdeltakelsen:'
                    }
                    <List size={'small'}>
                        {automatiskOpprettetGrunn.endringer.map((endring) => (
                            <List.Item key={endring.type}>{endringTekst(endring)}</List.Item>
                        ))}
                    </List>
                </Infokort>
                <ManueltBehandlesGrunnerInfo grunner={manueltBehandlesGrunner} />
            </VedtakSeksjon.Venstre>
        </VedtakSeksjon>
    );
};
