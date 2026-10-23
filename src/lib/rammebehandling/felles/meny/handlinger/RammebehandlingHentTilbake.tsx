import { Button, Dialog } from '@navikt/ds-react';
import { PersonIcon } from '@navikt/aksel-icons';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { SakId, SakProps } from '~/lib/sak/SakTyper';
import { Saksnummer } from '~/lib/sak/Saksnummer';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';
import { personoversiktUrl } from '~/utils/urls';

type Props = {
    sakId: SakId;
    saksnummer: Saksnummer;
    behandlingId: RammebehandlingId;
    åpen: boolean;
    onClose: () => void;
    onSuccess: (oppdatertSak: SakProps) => void;
};

/**
 * Behandlingen finnes ikke lenger (404) eller er endret av noen andre (409), så et nytt forsøk vil aldri lykkes.
 */
const erTerminalFeil = (status?: number) => status === 404 || status === 409;

export const RammebehandlingHentTilbake = ({
    sakId,
    saksnummer,
    behandlingId,
    åpen,
    onClose,
    onSuccess,
}: Props) => {
    const { trigger, error, isMutating } = useFetchJsonFraApi<SakProps>(
        `/sak/${sakId}/behandling/${behandlingId}/henttilbake`,
        'POST',
    );

    const terminal = erTerminalFeil(error?.status);

    const tildel = () => {
        trigger().then((oppdatertSak) => {
            if (oppdatertSak) {
                onSuccess(oppdatertSak);
            }
        });
    };

    return (
        <Dialog open={åpen} onOpenChange={(nesteÅpen) => !nesteÅpen && !isMutating && onClose()}>
            <Dialog.Popup>
                <Dialog.Header>
                    <strong>{'Tildel deg behandlingen?'}</strong>
                </Dialog.Header>

                <Dialog.Body>
                    {
                        'Det automatiske resultatet nullstilles, og du må vurdere behandlingen på nytt.'
                    }

                    {error && (
                        <Infokort
                            variant={'feil'}
                            header={'Feil ved tildeling'}
                        >{`Feil: ${error.message} (kode ${error.status})`}</Infokort>
                    )}
                </Dialog.Body>

                <Dialog.Footer>
                    {terminal ? (
                        <InternLenke href={personoversiktUrl(saksnummer)} onClick={onClose}>
                            {'Gå til personoversikten'}
                        </InternLenke>
                    ) : (
                        <Button
                            variant={'primary'}
                            icon={<PersonIcon aria-hidden />}
                            loading={isMutating}
                            onClick={tildel}
                        >
                            {'Tildel meg som saksbehandler'}
                        </Button>
                    )}

                    <Dialog.CloseTrigger>
                        <Button variant={'secondary'} disabled={isMutating}>
                            {terminal ? 'Lukk' : 'Avbryt'}
                        </Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
};
