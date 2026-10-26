import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { CalendarIcon } from '@navikt/aksel-icons';
import { ActionMenu, Loader } from '@navikt/ds-react';
import { RammevedtakMedBehandling } from '~/lib/rammebehandling/typer/Rammevedtak';
import { useStartRevurdering } from '~/lib/personoversikt/opprett-behandling/opprett-revurdering/useStartRevurdering';
import { SakId } from '~/lib/sak/SakTyper';
import router from 'next/router';
import { behandlingUrl } from '~/utils/urls';
import { formaterDatotekst } from '~/utils/date';

type Props = {
    sakId: SakId;
    vedtak: RammevedtakMedBehandling;
};

// Vises bare for vedtak backend sier kan forlenges.
export const ForlengVedtakMenyvalg = ({ sakId, vedtak }: Props) => {
    const { startRevurdering, startRevurderingLaster, startRevurderingError } =
        useStartRevurdering(sakId);

    const forlengKommando = vedtak.gyldigeKommandoer.FORLENG;

    if (!forlengKommando) {
        return null;
    }

    return (
        <>
            <ActionMenu.Item
                onSelect={(e) => {
                    e.preventDefault();
                    startRevurdering({
                        revurderingType: RevurderingResultat.FORLENGELSE,
                        rammevedtakIdSomForlenges: vedtak.id,
                    }).then((forlengelse) => {
                        if (!forlengelse) {
                            return;
                        }

                        router.push(behandlingUrl(forlengelse));
                    });
                }}
                icon={
                    startRevurderingLaster ? <Loader size="xsmall" /> : <CalendarIcon aria-hidden />
                }
                disabled={startRevurderingLaster}
            >
                {`Forleng fra ${formaterDatotekst(forlengKommando.forlengesFraOgMed)}`}
            </ActionMenu.Item>
            {startRevurderingError && (
                <Infokort variant={'feil'} size={'small'}>
                    {`Kunne ikke opprette forlengelse: ${startRevurderingError.message}`}
                </Infokort>
            )}
        </>
    );
};
