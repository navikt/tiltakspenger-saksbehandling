import { BenkTildelFlereMeny } from '~/lib/benk/felles/tildel-flere/BenkTildelFlereMeny';
import { BenkSøknadsbehandling } from '~/lib/benk/typer/søknader';
import { BenkRevurdering } from '~/lib/benk/typer/revurderinger';
import { useBenkVisning } from '~/lib/benk/felles/filter/BenkVisningContext';
import { Button, Dialog, HStack, Loader, VStack } from '@navikt/ds-react';
import { useTildelRammebehandling } from '~/lib/rammebehandling/felles/tildel/useTildelRammebehandling';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { behandlingUrl } from '~/utils/urls';
import { useRouter } from 'next/router';

type Props = {
    behandlinger: Array<BenkSøknadsbehandling | BenkRevurdering>;
};

export const BenkTildelFlere = ({ behandlinger }: Props) => {
    const { valgtTildeling, valgtTildelingType, setValgtTildelingType } = useBenkVisning();
    const { trigger, isMutating, error, data } = useTildelRammebehandling();

    const tildelAlle = () => {
        console.log(valgtTildeling);
        trigger({
            behandlinger: valgtTildeling.map((b) => ({ behandlingId: b.id, sakId: b.sakId })),
            returnerSaker: false,
        });
    };

    const router = useRouter();
    const harFeilet = error && !isMutating;
    const harTildelt = !!data;

    return valgtTildelingType ? (
        <HStack gap={'space-8'} justify={'end'}>
            <Dialog
                onOpenChange={(vilÅpne) => {
                    if (!vilÅpne && harTildelt) {
                        router.reload();
                    }
                }}
            >
                <Dialog.Trigger>
                    <Button variant={'primary'} size={'small'}>
                        Tildel
                    </Button>
                </Dialog.Trigger>
                <Dialog.Popup>
                    <Dialog.Header>
                        <Dialog.Title>
                            {harTildelt
                                ? `Du har blitt tildelt ${valgtTildeling.length} behandlinger`
                                : `Tildel meg ${valgtTildeling.length} behandlinger`}
                        </Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <VStack as={'ul'} gap={'space-4'}>
                            {harTildelt
                                ? data.behandlinger.map((b) => {
                                      const url = behandlingUrl({
                                          id: b.behandlingId,
                                          saksnummer: b.saksnummer,
                                      });
                                      return (
                                          <li key={b.behandlingId}>
                                              <InternLenke href={url}>{url}</InternLenke>
                                          </li>
                                      );
                                  })
                                : valgtTildeling.map((b) => {
                                      const url = behandlingUrl({
                                          id: b.id,
                                          saksnummer: b.saksnummer,
                                      });
                                      return (
                                          <li key={b.id}>
                                              <InternLenke href={url}>{url}</InternLenke>
                                          </li>
                                      );
                                  })}
                        </VStack>
                        {harFeilet && (
                            <Infokort
                                variant={'feil'}
                                header={'Feil ved tildeling'}
                            >{`Feil: ${error.message} (kode ${error.status})`}</Infokort>
                        )}
                        {isMutating && (
                            <Loader size={'xlarge'} title={'Tildeler deg behandlinger'} />
                        )}
                    </Dialog.Body>
                    <Dialog.Footer>
                        {!harTildelt && (
                            <Button loading={isMutating} onClick={tildelAlle} variant={'primary'}>
                                Tildel
                            </Button>
                        )}
                        <Dialog.CloseTrigger>
                            <Button variant={'secondary'}>Lukk</Button>
                        </Dialog.CloseTrigger>
                    </Dialog.Footer>
                </Dialog.Popup>
            </Dialog>

            <Button
                onClick={() => setValgtTildelingType(null)}
                variant={'secondary'}
                size={'small'}
            >
                Avbryt
            </Button>
        </HStack>
    ) : (
        <BenkTildelFlereMeny behandlinger={behandlinger} />
    );
};
