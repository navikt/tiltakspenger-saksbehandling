import { Button, Dialog, Loader } from '@navikt/ds-react';
import { PersonIcon } from '@navikt/aksel-icons';
import { useCallback, useEffect } from 'react';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { SakId, SakProps } from '~/lib/sak/SakTyper';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';
import { BehandlingsmenyKallesFra } from '~/lib/behandling-felles/typer/BehandlingFelles';

type Props = {
    behandlingId: RammebehandlingId;
    sakId: SakId;
    åpen: boolean;
    kallesFra: BehandlingsmenyKallesFra;
    onClose: () => void;
    onSuccess: (oppdatertSak: SakProps) => void;
};

/**
 * Utfører handlingen umiddelbart når åpen settes - dialogen viser en lasteanimasjon
 * mens kallet pågår, og feilen med mulighet for å prøve på nytt dersom det feiler.
 */
export const RammebehandlingTildelMeg = ({
    behandlingId,
    sakId,
    åpen,
    onClose,
    onSuccess,
}: Props) => {
    const { trigger, error, isMutating } = useFetchJsonFraApi<ResponseBody, RequestBody>(
        '/behandlinger/ta',
        'POST',
        {
            onSuccess: (response) => {
                onSuccess(response.saker.atNonNull(0));
            },
        },
    );

    const tildel = useCallback(() => {
        trigger({
            behandlinger: [{ behandlingId, sakId }],
            returnerSaker: true,
        });
    }, [behandlingId, sakId, trigger]);

    useEffect(() => {
        if (åpen) {
            tildel();
        }
    }, [åpen, tildel]);

    const harFeilet = error && !isMutating;

    return (
        <Dialog open={åpen} onOpenChange={(nesteÅpen) => !nesteÅpen && !isMutating && onClose()}>
            <Dialog.Popup>
                <Dialog.Header>
                    <strong>
                        {harFeilet
                            ? 'Kunne ikke tildele deg behandlingen'
                            : 'Tildeler deg behandlingen'}
                    </strong>
                </Dialog.Header>

                <Dialog.Body>
                    {harFeilet ? (
                        <Infokort
                            variant={'feil'}
                            header={'Feil ved tildeling'}
                        >{`Feil: ${error.message} (kode ${error.status})`}</Infokort>
                    ) : (
                        <Loader size={'xlarge'} title={'Tildeler deg behandlingen'} />
                    )}
                </Dialog.Body>

                {harFeilet && (
                    <Dialog.Footer>
                        <Button
                            variant={'primary'}
                            icon={<PersonIcon aria-hidden />}
                            onClick={tildel}
                        >
                            {'Prøv igjen'}
                        </Button>

                        <Dialog.CloseTrigger>
                            <Button variant={'secondary'}>{'Avbryt'}</Button>
                        </Dialog.CloseTrigger>
                    </Dialog.Footer>
                )}
            </Dialog.Popup>
        </Dialog>
    );
};

type RequestBody = {
    behandlinger: Array<{
        behandlingId: RammebehandlingId;
        sakId: SakId;
    }>;
    returnerSaker: boolean;
};

type ResponseBody = {
    behandlinger: Array<{
        behandlingId: RammebehandlingId;
        sakId: SakId;
    }>;
    saker: SakProps[];
};
