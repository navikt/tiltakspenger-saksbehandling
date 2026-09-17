import { BenkTildelFlereMeny } from '~/lib/benk/felles/tildel-flere/BenkTildelFlereMeny';
import { BenkSøknadsbehandling } from '~/lib/benk/typer/søknader';
import { BenkRevurdering } from '~/lib/benk/typer/revurderinger';
import { useBenkVisning } from '~/lib/benk/felles/filter/BenkVisningContext';
import { BodyLong, Button, Dialog, HStack, Loader, VStack } from '@navikt/ds-react';
import { useTildelRammebehandling } from '~/lib/rammebehandling/felles/tildel/useTildelRammebehandling';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { behandlingUrl } from '~/utils/urls';
import { useRouter } from 'next/router';
import { useBenkFilterNavigasjon } from '~/lib/benk/felles/filter/useBenkFilterNavigasjon';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import { BenkTab } from '~/lib/benk/typer/tabs';
import { BenkBehandlingsstatus } from '~/lib/benk/typer/felles';
import { parseBenkFilterForTab } from '~/lib/benk/utils/benkQuery';
import { hentVerdi } from '~/utils/sladdetVerdi';

type Props = {
    behandlinger: Array<BenkSøknadsbehandling | BenkRevurdering>;
    tab: BenkTab.SØKNADER | BenkTab.REVURDERINGER;
};

export const BenkTildelFlere = ({ behandlinger, tab }: Props) => {
    const { valgtTildeling, valgtTildelingType, setValgtTildelingType } = useBenkVisning();
    const { trigger, isMutating, error, data } = useTildelRammebehandling();
    const { oppdaterFilter } = useBenkFilterNavigasjon(tab);
    const { innloggetSaksbehandler } = useSaksbehandler();

    const router = useRouter();

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
    const nyttFilter = parseBenkFilterForTab(tab, router.query);

    const tildelAlle = () => {
        trigger({
            behandlinger: tildelbare.map((b) => ({ behandlingId: b.id, sakId: b.sakId })),
            returnerSaker: false,
        }).then((response) => {
            if (response) {
                oppdaterFilter({
                    ...nyttFilter,
                    status:
                        valgtTildelingType === 'saksbehandler'
                            ? BenkBehandlingsstatus.UNDER_BEHANDLING
                            : valgtTildelingType === 'beslutter'
                              ? BenkBehandlingsstatus.UNDER_BESLUTNING
                              : null,
                    saksbehandler: innloggetSaksbehandler.navIdent,
                }).then(() => setValgtTildelingType(null));
            }
        });
    };

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
