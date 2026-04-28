import { TilbakekrevingBehandling } from '~/lib/tilbakekreving/typer/Tilbakekreving';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { SakProps } from '~/lib/sak/SakTyper';
import { Alert, Button } from '@navikt/ds-react';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { useSak } from '~/lib/sak/SakContext';

type Props = {
    tilbakekreving: TilbakekrevingBehandling;
};

export const TilbakekrevingTildeling = ({ tilbakekreving }: Props) => {
    const { gyldigeKommandoer } = tilbakekreving;

    return gyldigeKommandoer.map((kommando) => (
        <KnappMedHandling tilbakekreving={tilbakekreving} handling={kommando} key={kommando} />
    ));
};

type KnappMedHandlingProps = {
    tilbakekreving: TilbakekrevingBehandling;
    handling: SaksbehandlerBehandlingKommando;
};

const KnappMedHandling = ({ tilbakekreving, handling }: KnappMedHandlingProps) => {
    const { setSak } = useSak();

    const subPath = handlingSubPaths[handling];

    if (!subPath) {
        throw Error(`Ugyldig handling for tildeling av tilbakekreving: ${handling}`);
    }

    const { id, sakId } = tilbakekreving;

    const { trigger, isMutating, error } = useFetchJsonFraApi<SakProps>(
        `/sak/${sakId}/tilbakekreving/${id}/${subPath}`,
        'POST',
    );

    return (
        <>
            {error && (
                <Alert
                    variant={'error'}
                    size={'small'}
                    inline={true}
                >{`Feil ved tildeling: ${error.message}`}</Alert>
            )}
            <Button
                variant={'secondary'}
                size={'small'}
                loading={isMutating}
                onClick={() => {
                    trigger().then((sak) => {
                        if (sak) {
                            setSak(sak);
                        }
                    });
                }}
            >
                {handlingTekst[handling]}
            </Button>
        </>
    );
};

const handlingSubPaths: { [Key in SaksbehandlerBehandlingKommando]?: string } = {
    [SaksbehandlerBehandlingKommando.TildelSaksbehandler]: 'tildel',
    [SaksbehandlerBehandlingKommando.TildelBeslutter]: 'tildel',
    [SaksbehandlerBehandlingKommando.OvertaSaksbehandler]: 'overta',
    [SaksbehandlerBehandlingKommando.OvertaBeslutter]: 'overta',
    [SaksbehandlerBehandlingKommando.LeggTilbakeSaksbehandler]: 'legg-tilbake',
    [SaksbehandlerBehandlingKommando.LeggTilbakeBeslutter]: 'legg-tilbake',
} as const;

const handlingTekst: { [Key in SaksbehandlerBehandlingKommando]?: string } = {
    [SaksbehandlerBehandlingKommando.TildelSaksbehandler]: 'Tildel meg (saksbehandler)',
    [SaksbehandlerBehandlingKommando.TildelBeslutter]: 'Tildel meg (beslutter)',
    [SaksbehandlerBehandlingKommando.OvertaSaksbehandler]: 'Overta (saksbehandler)',
    [SaksbehandlerBehandlingKommando.OvertaBeslutter]: 'Overta (beslutter)',
    [SaksbehandlerBehandlingKommando.LeggTilbakeSaksbehandler]: 'Legg tilbake',
    [SaksbehandlerBehandlingKommando.LeggTilbakeBeslutter]: 'Legg tilbake',
} as const;
