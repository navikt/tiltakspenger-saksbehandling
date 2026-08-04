import { Heading, HStack, VStack } from '@navikt/ds-react';
import { useSak } from '~/lib/sak/SakContext';
import {
    useMeldekortbehandling,
    useMeldekortbehandlingSkjema,
} from '~/lib/meldekort/meldekortbehandling/context/MeldekortbehandlingContext';
import { formaterDatotekst } from '~/utils/date';
import { DetaljHorisontal } from '~/lib/_felles/detaljer/DetaljHorisontal';
import { BehandlingStatusTags } from '~/lib/behandling-felles/status/BehandlingStatusTags';
import { MeldekortbehandlingSeksjon } from '~/lib/meldekort/meldekortbehandling/layout/MeldekortbehandlingSeksjon';
import { MeldekortbehandlingMeny } from '~/lib/meldekort/felles/meny/MeldekortbehandlingMeny';
import {
    erBehandlingSattPåVent,
    erBehandlingUnderkjent,
} from '~/lib/behandling-felles/utils/behandlingUtils';
import OppsummeringAvVentestatus from '~/lib/behandling-felles/oppsummeringer/ventestatus/OppsummeringAvVentestatus';
import { MeldekortbehandlingUnderkjentStatus } from '~/lib/meldekort/meldekortbehandling/header/underkjent-status/MeldekortbehandlingUnderkjentStatus';
import { TilbakekrevingOppsummering } from '~/lib/tilbakekreving/TilbakekrevingOppsummering';
import OppsummeringAvKlageForRammebehandling from '~/lib/behandling-felles/oppsummeringer/klage/oppsummeringAvKlageForRammebehandling/OppsummeringAvKlageForRammebehandling';
import { hentKlagebehandling } from '~/lib/sak/sakUtils';

import style from './MeldekortbehandlingHeader.module.css';
import { erMeldekortbehandlingGodkjent } from '~/lib/meldekort/utils/meldekortbehandlingUtils';
import { UbehandledeMeldekortVarsel } from '~/lib/meldekort/felles/ubehandlede-meldekort/UbehandledeMeldekortVarsel';

export const MeldekortbehandlingHeader = () => {
    const { sak } = useSak();
    const { førsteDagSomGirRett, sisteDagSomGirRett, kanSendeInnHelgForMeldekort } = sak;

    const meldekortbehandling = useMeldekortbehandling();
    const {
        saksbehandler,
        beslutter,
        ventestatus,
        attesteringer,
        tilbakekrevingId,
        klagebehandlingId,
    } = meldekortbehandling;

    const { meldeperioder } = useMeldekortbehandlingSkjema();

    return (
        <MeldekortbehandlingSeksjon className={style.outer} gap={'space-16'}>
            <MeldekortbehandlingSeksjon.Venstre gap={'space-16'}>
                <Heading size={'medium'} level={'1'}>
                    {'Meldekortbehandling'}
                </Heading>

                <BehandlingStatusTags behandling={meldekortbehandling} />
            </MeldekortbehandlingSeksjon.Venstre>

            <MeldekortbehandlingSeksjon.Høyre gap={'space-24'}>
                <HStack gap={'space-16'} justify={'space-between'}>
                    <VStack gap={'space-8'}>
                        <HStack gap={'space-16'}>
                            <DetaljHorisontal navn={'Saksbehandler:'}>
                                {saksbehandler ?? 'Ikke tildelt'}
                            </DetaljHorisontal>
                            <DetaljHorisontal navn={'Beslutter:'}>
                                {beslutter ?? 'Ikke tildelt'}
                            </DetaljHorisontal>
                        </HStack>

                        <HStack gap={'space-16'}>
                            <DetaljHorisontal navn={'Første dag med rett:'}>
                                {førsteDagSomGirRett ? formaterDatotekst(førsteDagSomGirRett) : '-'}
                            </DetaljHorisontal>
                            <DetaljHorisontal navn={'Siste dag med rett:'}>
                                {sisteDagSomGirRett ? formaterDatotekst(sisteDagSomGirRett) : '-'}
                            </DetaljHorisontal>
                        </HStack>
                        <HStack>
                            <DetaljHorisontal navn={'Kan melde helg:'}>
                                {kanSendeInnHelgForMeldekort ? 'Ja' : 'Nei'}
                            </DetaljHorisontal>
                        </HStack>
                    </VStack>

                    <VStack justify={'end'}>
                        <MeldekortbehandlingMeny
                            meldekortbehandling={meldekortbehandling}
                            kallesFra={'behandling'}
                        />
                    </VStack>
                </HStack>

                {erBehandlingUnderkjent(meldekortbehandling) && (
                    <MeldekortbehandlingUnderkjentStatus attesteringer={attesteringer} />
                )}

                {erBehandlingSattPåVent(meldekortbehandling) && (
                    <OppsummeringAvVentestatus
                        ventestatus={ventestatus.at(0)!}
                        historikk={ventestatus}
                    />
                )}

                {tilbakekrevingId && (
                    <TilbakekrevingOppsummering tilbakekrevingId={tilbakekrevingId} />
                )}

                {/* TODO: egen oppsummeringskomponent for meldekort? */}
                {klagebehandlingId && (
                    <OppsummeringAvKlageForRammebehandling
                        klagebehandling={hentKlagebehandling(sak, klagebehandlingId)}
                    />
                )}

                {!erMeldekortbehandlingGodkjent(meldekortbehandling) && (
                    <UbehandledeMeldekortVarsel
                        meldeperiodekjeder={sak.meldeperiodeKjeder}
                        skjema={meldeperioder}
                    />
                )}
            </MeldekortbehandlingSeksjon.Høyre>
        </MeldekortbehandlingSeksjon>
    );
};
