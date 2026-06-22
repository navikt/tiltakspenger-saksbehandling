import { Attestering, Attesteringsstatus } from '~/lib/behandling-felles/typer/Attestering';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { DetaljHorisontal } from '~/lib/_felles/detaljer/DetaljHorisontal';
import { formaterTidspunkt } from '~/utils/date';

type Props = {
    attesteringer: Attestering[];
};

export const MeldekortbehandlingUnderkjentStatus = ({ attesteringer }: Props) => {
    const sisteAttestering = attesteringer.at(-1);

    if (sisteAttestering?.status !== Attesteringsstatus.SENDT_TILBAKE) {
        return null;
    }

    const { endretTidspunkt, endretAv, begrunnelse } = sisteAttestering;

    return (
        <Infokort
            variant={'advarsel'}
            header={'Behandlingen er underkjent av beslutter'}
            size={'small'}
        >
            <DetaljHorisontal navn={'Underkjent av:'}>{endretAv}</DetaljHorisontal>
            <DetaljHorisontal navn={'Underkjent dato:'}>
                {formaterTidspunkt(endretTidspunkt)}
            </DetaljHorisontal>
            <DetaljHorisontal navn={'Begrunnelse:'}>{begrunnelse}</DetaljHorisontal>
        </Infokort>
    );
};
