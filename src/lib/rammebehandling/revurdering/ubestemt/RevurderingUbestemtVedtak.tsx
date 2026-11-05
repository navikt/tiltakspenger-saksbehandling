import { useState } from 'react';
import { BodyShort, Button, Heading, HStack } from '@navikt/ds-react';
import { ArrowsSquarepathIcon, TrashIcon } from '@navikt/aksel-icons';
import { Separator } from '~/lib/_felles/separator/Separator';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { VedtakSeksjon } from '~/lib/rammebehandling/felles/layout/seksjon/VedtakSeksjon';
import { useRevurderingBehandling } from '~/lib/rammebehandling/context/BehandlingContext';
import { RevurderingAutomatiskOpprettetGrunn } from '~/lib/rammebehandling/revurdering/felles/automatisk-opprettet-grunn/RevurderingAutomatiskOpprettetGrunn';
import {
    KonverterRevurderingTil,
    konverteringsalternativer,
    konverterRevurderingTilTekst,
    RammebehandlingKonverter,
} from '~/lib/rammebehandling/felles/meny/handlinger/RammebehandlingKonverter';
import { RammebehandlingAvslutt } from '~/lib/rammebehandling/felles/meny/handlinger/RammebehandlingAvslutt';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { Rammebehandlingsstatus } from '~/lib/rammebehandling/typer/Rammebehandling';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { useSak } from '~/lib/sak/SakContext';
import { useNotification } from '~/lib/_felles/notifications/NotificationContext';
import { PersonoversiktTab } from '~/lib/personoversikt/Personoversikt';
import { personoversiktUrl } from '~/utils/urls';
import { useFeatureToggles } from '~/lib/_felles/context/FeatureTogglesContext';

/**
 * En ubestemt revurdering er opprettet av systemet fordi det ikke kunne utlede hvilken type revurdering en endring krever.
 * Saksbehandler må konvertere den til en annen type eller avslutte den, så valgene vises direkte på siden og ikke bare i menyen.
 */
export const RevurderingUbestemtVedtak = () => {
    const { behandling } = useRevurderingBehandling();
    const { sak, setSak } = useSak();
    const { navigateWithNotification } = useNotification();
    const { forlengelseToggle } = useFeatureToggles();

    const [konverterTil, setKonverterTil] = useState<KonverterRevurderingTil | null>(null);
    const [visAvslutt, setVisAvslutt] = useState(false);

    const { gyldigeKommandoer, automatiskOpprettetGrunn, manueltBehandlesGrunner, status } =
        behandling;

    const kanKonvertere = gyldigeKommandoer.includes(
        SaksbehandlerBehandlingKommando.KonverterRevurdering,
    );
    const kanAvslutte = gyldigeKommandoer.includes(SaksbehandlerBehandlingKommando.Avbryt);
    const erAvsluttet = status === Rammebehandlingsstatus.AVBRUTT;

    return (
        <>
            <Heading size={'medium'} level={'1'} spacing={true}>
                {'Ubestemt revurdering'}
            </Heading>
            {automatiskOpprettetGrunn && (
                <>
                    <RevurderingAutomatiskOpprettetGrunn
                        automatiskOpprettetGrunn={automatiskOpprettetGrunn}
                        manueltBehandlesGrunner={manueltBehandlesGrunner}
                    />
                    <Separator />
                </>
            )}
            {!erAvsluttet && (
                <VedtakSeksjon>
                    <VedtakSeksjon.Venstre gap={'space-16'}>
                        <Heading size={'small'} level={'2'}>
                            {'Hva skal skje med revurderingen?'}
                        </Heading>
                        <BodyShort>
                            {
                                'Systemet kunne ikke avgjøre hvilken revurdering endringen krever. Velg typen revurdering før du behandler den, eller avslutt revurderingen dersom endringen ikke skal føre til et nytt vedtak.'
                            }
                        </BodyShort>

                        {!kanKonvertere && (
                            <Infokort variant={'info'} size={'small'}>
                                {'Behandlingen må tildeles deg før du kan velge type revurdering.'}
                            </Infokort>
                        )}

                        <HStack gap={'space-8'}>
                            {konverteringsalternativer(
                                RevurderingResultat.UBESTEMT,
                                forlengelseToggle,
                            ).map((til) => (
                                <Button
                                    key={til}
                                    variant={'secondary'}
                                    size={'small'}
                                    icon={<ArrowsSquarepathIcon aria-hidden />}
                                    disabled={!kanKonvertere}
                                    onClick={() => setKonverterTil(til)}
                                >
                                    {konverterRevurderingTilTekst[til]}
                                </Button>
                            ))}
                        </HStack>

                        <div>
                            <Button
                                variant={'secondary'}
                                data-color={'danger'}
                                size={'small'}
                                icon={<TrashIcon aria-hidden />}
                                disabled={!kanAvslutte}
                                onClick={() => setVisAvslutt(true)}
                            >
                                {'Avslutt'}
                            </Button>
                        </div>
                    </VedtakSeksjon.Venstre>
                </VedtakSeksjon>
            )}

            {konverterTil && (
                <RammebehandlingKonverter
                    sakId={sak.sakId}
                    saksnummer={sak.saksnummer}
                    behandlingId={behandling.id}
                    til={konverterTil}
                    alleRammevedtak={sak.alleRammevedtak}
                    åpen={true}
                    onClose={() => setKonverterTil(null)}
                    onSuccess={(oppdatertSak) => {
                        setKonverterTil(null);
                        setSak(oppdatertSak);
                    }}
                />
            )}

            {kanAvslutte && (
                <RammebehandlingAvslutt
                    behandlingId={behandling.id}
                    erRevurdering={true}
                    saksnummer={sak.saksnummer}
                    åpen={visAvslutt}
                    onClose={() => setVisAvslutt(false)}
                    onSuccess={() => {
                        setVisAvslutt(false);
                        navigateWithNotification(
                            personoversiktUrl(sak.saksnummer, PersonoversiktTab.ÅpneBehandlinger),
                            'Revurderingen er avsluttet',
                        );
                    }}
                />
            )}
        </>
    );
};
