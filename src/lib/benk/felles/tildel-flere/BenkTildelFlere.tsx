import { BenkTildelFlereMeny } from './BenkTildelFlereMeny';
import { BenkSøknadsbehandling } from '../../typer/søknader';
import { BenkRevurdering } from '../../typer/revurderinger';
import { useBenkVisning } from '../filter/BenkVisningContext';
import { BodyLong, Button, Dialog, HStack, Loader, VStack } from '@navikt/ds-react';
import { useTildelRammebehandling } from '~/lib/rammebehandling/felles/tildel/useTildelRammebehandling';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { behandlingUrl } from '~/utils/urls';
import { useBenkFilterNavigasjon } from '../filter/useBenkFilterNavigasjon';
import { BENK_MINE_TAB } from '../../typer/tabs';
import { hentVerdi } from '~/utils/sladdetVerdi';

type Props = {
    behandlinger: Array<BenkSøknadsbehandling | BenkRevurdering>;
};

export const BenkTildelFlere = ({ behandlinger }: Props) => {
    const { valgtTildeling, valgtTildelingType, setValgtTildelingType, kanTildeleFlere } =
        useBenkVisning();
    const { trigger, isMutating, error, data } = useTildelRammebehandling();
    // Etter tildelingen vises mine-fanen uten filtre, så alle de nye behandlingene er synlige
    const { nullstillFilter: visMineBehandlinger } = useBenkFilterNavigasjon(BENK_MINE_TAB);

    // sakId og saksnummer er sladdet på rader uten tilgang, og en slik rad kan ikke tildeles.
    // Avkryssingen finnes bare på rader med tilgang og med gyldige kommandoer, så lista er i praksis den samme.
    // Filteret står her for at det vi viser og det vi sender, alltid skal være det samme.
    const tildelbare = valgtTildeling.flatMap((behandling) => {
        const sakId = hentVerdi(behandling.sakId);
        const saksnummer = hentVerdi(behandling.saksnummer);

        return sakId !== null && saksnummer !== null
            ? [{ id: behandling.id, sakId, saksnummer }]
            : [];
    });

    const harFeilet = error && !isMutating;
    const harTildelt = !!data;

    const tildelAlle = () => {
        trigger({
            behandlinger: tildelbare.map((b) => ({ behandlingId: b.id, sakId: b.sakId })),
            returnerSaker: false,
        }).then((response) => {
            if (response) {
                visMineBehandlinger().then(() => setValgtTildelingType(null));
            }
        });
    };

    if (!kanTildeleFlere) {
        return null;
    }

    if (!valgtTildelingType) {
        return <BenkTildelFlereMeny behandlinger={behandlinger} />;
    }

    return (
        <HStack gap={'space-8'} justify={'end'}>
            <Dialog>
                <Dialog.Trigger>
                    <Button disabled={tildelbare.length === 0} variant={'primary'} size={'small'}>
                        Tildel
                    </Button>
                </Dialog.Trigger>
                <Dialog.Popup>
                    <Dialog.Header>
                        <Dialog.Title>
                            {`Tildel meg ${tildelbare.length} behandlinger`}
                        </Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <BodyLong>
                            Du vil tildeles følgende behandlinger. Hvis tildelingen er vellykket vil
                            du videresendes til oversikt over dine tildelte behandlinger.
                        </BodyLong>
                        <VStack as={'ul'} gap={'space-4'}>
                            {tildelbare.map((b) => {
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
    );
};
