import { useState } from 'react';
import { BenkTildelFlereMeny } from './BenkTildelFlereMeny';
import { BehandlingSomKanBatchTildeles, useBenkVisning } from '../filter/BenkVisningContext';
import { BodyLong, Button, Dialog, HStack, Loader, VStack } from '@navikt/ds-react';
import { useTildelRammebehandling } from '~/lib/rammebehandling/felles/tildel/useTildelRammebehandling';
import { useTildelTilbakekrevinger } from '~/lib/tilbakekreving/tildel/useTildelTilbakekrevinger';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { behandlingUrl, personoversiktUrl } from '~/utils/urls';
import { PersonoversiktTab } from '~/lib/personoversikt/Personoversikt';
import { useBenkFilterNavigasjon } from '../filter/useBenkFilterNavigasjon';
import { BENK_MINE_TAB } from '../../typer/tabs';
import { BenkBehandlingstype } from '../../typer/felles';
import { hentVerdi } from '~/utils/sladdetVerdi';

type Props = {
    behandlinger: Array<BehandlingSomKanBatchTildeles>;
};

export const BenkTildelFlere = ({ behandlinger }: Props) => {
    const {
        valgtTildeling,
        valgtTildelingType,
        setValgtTildelingType,
        kanTildeleFlere,
        globaleFiltre,
    } = useBenkVisning();
    const rammebehandlingTildeling = useTildelRammebehandling();
    const tilbakekrevingTildeling = useTildelTilbakekrevinger();
    const [harTildelt, setHarTildelt] = useState(false);
    // Etter tildelingen vises mine-fanen uten lokale filtre, mens de globale filtrene beholdes
    const { nullstillFilter: visMineBehandlinger } = useBenkFilterNavigasjon(BENK_MINE_TAB);

    // sakId og saksnummer er sladdet på rader uten tilgang, og en slik rad kan ikke tildeles.
    // Avkryssingen finnes bare på rader med tilgang og med gyldige kommandoer, så lista er i praksis den samme.
    // Filteret står her for at det vi viser og det vi sender, alltid skal være det samme.
    const tildelbare = valgtTildeling.flatMap((behandling) => {
        const sakId = hentVerdi(behandling.sakId);
        const saksnummer = hentVerdi(behandling.saksnummer);

        return sakId !== null && saksnummer !== null ? [{ behandling, sakId, saksnummer }] : [];
    });

    // Hver fane på benken har én behandlingstype, så i praksis er en av listene alltid tom.
    const rammebehandlinger = tildelbare.flatMap(({ behandling, sakId }) =>
        behandling.type !== BenkBehandlingstype.TILBAKEKREVING
            ? [{ behandlingId: behandling.id, sakId }]
            : [],
    );
    const tilbakekrevinger = tildelbare.flatMap(({ behandling, sakId }) =>
        behandling.type === BenkBehandlingstype.TILBAKEKREVING
            ? [{ tilbakekrevingId: behandling.id, sakId }]
            : [],
    );

    const isMutating = rammebehandlingTildeling.isMutating || tilbakekrevingTildeling.isMutating;
    const error = rammebehandlingTildeling.error ?? tilbakekrevingTildeling.error;
    const harFeilet = error && !isMutating;

    const tildelAlle = async () => {
        const [rammebehandlingerTildelt, tilbakekrevingerTildelt] = await Promise.all([
            rammebehandlinger.length === 0 ||
                rammebehandlingTildeling
                    .trigger({ behandlinger: rammebehandlinger, returnerSaker: false })
                    .then(Boolean),
            tilbakekrevinger.length === 0 ||
                tilbakekrevingTildeling.trigger({ tilbakekrevinger }).then(Boolean),
        ]);

        if (rammebehandlingerTildelt && tilbakekrevingerTildelt) {
            setHarTildelt(true);
            await visMineBehandlinger(globaleFiltre);
            setValgtTildelingType(null);
        }
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
                            {tildelbare.map(({ behandling, saksnummer }) => {
                                const url =
                                    behandling.type === BenkBehandlingstype.TILBAKEKREVING
                                        ? personoversiktUrl(
                                              saksnummer,
                                              PersonoversiktTab.Tilbakekreving,
                                          )
                                        : behandlingUrl({ id: behandling.id, saksnummer });
                                return (
                                    <li key={behandling.id}>
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
