import { MeldekortbehandlingSeksjon } from '~/lib/meldekort/meldekortbehandling/layout/MeldekortbehandlingSeksjon';
import { FritekstInput } from '~/lib/_felles/fritekst/FritekstInput';
import {
    useMeldekortbehandling,
    useMeldekortbehandlingSkjema,
    useMeldekortbehandlingSkjemaDispatch,
} from '~/lib/meldekort/meldekortbehandling/context/MeldekortbehandlingContext';
import { Checkbox, Heading, HStack, InlineMessage, VStack } from '@navikt/ds-react';
import { MeldekortbehandlingForhåndsvisBrev } from '~/lib/meldekort/meldekortbehandling/fritekst-og-innsending/begrunnelse-og-brev/forhåndsvis-brev/MeldekortbehandlingForhåndsvisBrev';
import { JournalførNotatValg } from '~/lib/_felles/journalføring/JournalførNotatValg';
import {
    distribuerVedtaksbrevEndringFraBeslutter,
    journalførNotatEndringFraBeslutter,
    journalførVedtaksbrevEndringFraBeslutter,
} from '~/lib/meldekort/utils/meldekortbehandlingUtils';
import { EndringAvJournalførNotat } from '~/lib/_felles/journalføring/beslutterEndringAvJournalførNotat';
import { Infokort } from '~/lib/_felles/infokort/Infokort';

import { Nullable } from '~/types/UtilTypes';

import style from './MeldekortbehandlingBegrunnelseOgBrev.module.css';

const jaNei = (valg: boolean) => (valg ? 'Ja' : 'Nei');

const BeslutterEndring = ({ endring }: { endring: Nullable<EndringAvJournalførNotat> }) =>
    endring && (
        <Infokort variant={'info'} size={'small'}>
            Beslutter endret valget fra {jaNei(endring.saksbehandler)} → {jaNei(endring.beslutter)}
        </Infokort>
    );

export const MeldekortbehandlingBegrunnelseOgBrev = () => {
    const {
        begrunnelse,
        brevtekst,
        erReadonly,
        kanEndreSkalJournalføreNotat,
        kanEndreSkalJournalføreVedtaksbrev,
        kanEndreSkalDistribuereVedtaksbrev,
        skalJournalføreVedtaksbrev,
        skalDistribuereVedtaksbrev,
        skalJournalføreNotat,
    } = useMeldekortbehandlingSkjema();
    const meldekortbehandling = useMeldekortbehandling();

    const dispatch = useMeldekortbehandlingSkjemaDispatch();

    const journalføringsendringFraBeslutter = journalførVedtaksbrevEndringFraBeslutter(
        meldekortbehandling,
        skalJournalføreVedtaksbrev,
        erReadonly && kanEndreSkalJournalføreVedtaksbrev,
    );

    const distribusjonsendringFraBeslutter = distribuerVedtaksbrevEndringFraBeslutter(
        meldekortbehandling,
        skalDistribuereVedtaksbrev,
        erReadonly && kanEndreSkalDistribuereVedtaksbrev,
    );

    return (
        <>
            <MeldekortbehandlingSeksjon className={style.begrunnelse}>
                <MeldekortbehandlingSeksjon.Høyre className={style.header}>
                    <Heading size={'small'} level={'3'}>
                        Begrunnelse (valgfri)
                    </Heading>
                </MeldekortbehandlingSeksjon.Høyre>

                <MeldekortbehandlingSeksjon.Venstre>
                    <InlineMessage status={'info'}>
                        Noter vurderingen. Ikke skriv personsensitive opplysninger som ikke er
                        relevant for saken
                    </InlineMessage>
                </MeldekortbehandlingSeksjon.Venstre>

                <MeldekortbehandlingSeksjon.Høyre>
                    <FritekstInput
                        label={'Begrunnelse (valgfri)'}
                        hideLabel={true}
                        defaultValue={begrunnelse.getValue() ?? ''}
                        readOnly={erReadonly}
                        ref={begrunnelse.ref}
                    />
                    <JournalførNotatValg
                        skalJournalføreNotat={skalJournalføreNotat}
                        onChange={(valgt) =>
                            dispatch({
                                type: 'setSkalJournalføreNotat',
                                payload: { skalJournalføreNotat: valgt },
                            })
                        }
                        readOnly={!kanEndreSkalJournalføreNotat}
                        endringFraBeslutter={journalførNotatEndringFraBeslutter(
                            meldekortbehandling,
                            skalJournalføreNotat,
                            erReadonly && kanEndreSkalJournalføreNotat,
                        )}
                    />
                </MeldekortbehandlingSeksjon.Høyre>
            </MeldekortbehandlingSeksjon>

            <MeldekortbehandlingSeksjon>
                <MeldekortbehandlingSeksjon.Høyre className={style.header}>
                    <HStack justify={'space-between'}>
                        <Heading size={'small'} level={'3'}>
                            Tekst til vedtaksbrev (valgfri)
                        </Heading>
                    </HStack>
                </MeldekortbehandlingSeksjon.Høyre>

                <MeldekortbehandlingSeksjon.Venstre>
                    <InlineMessage status={'info'}>
                        Teksten vises i vedtaksbrevet til bruker.
                    </InlineMessage>
                </MeldekortbehandlingSeksjon.Venstre>

                <MeldekortbehandlingSeksjon.Høyre gap={'space-16'}>
                    <FritekstInput
                        label={'Tekst til vedtaksbrev (valgfri)'}
                        hideLabel={true}
                        defaultValue={brevtekst.getValue() ?? ''}
                        readOnly={erReadonly || !skalJournalføreVedtaksbrev}
                        ref={brevtekst.ref}
                    />

                    <HStack justify={'space-between'} align={'start'} gap={'space-16'} wrap={false}>
                        <VStack className={style.brevvalg} gap={'space-8'}>
                            <VStack>
                                <Checkbox
                                    checked={skalJournalføreVedtaksbrev}
                                    readOnly={!kanEndreSkalJournalføreVedtaksbrev}
                                    size={'small'}
                                    onChange={(e) =>
                                        dispatch({
                                            type: 'setSkalJournalføreVedtaksbrev',
                                            payload: {
                                                skalJournalføreVedtaksbrev: e.target.checked,
                                            },
                                        })
                                    }
                                >
                                    Journalfør vedtaksbrevet
                                </Checkbox>
                                <BeslutterEndring endring={journalføringsendringFraBeslutter} />
                            </VStack>
                            <VStack>
                                <Checkbox
                                    checked={
                                        skalJournalføreVedtaksbrev && skalDistribuereVedtaksbrev
                                    }
                                    readOnly={!kanEndreSkalDistribuereVedtaksbrev}
                                    disabled={!skalJournalføreVedtaksbrev}
                                    size={'small'}
                                    description={
                                        skalJournalføreVedtaksbrev
                                            ? 'Bruker får brevet på Ditt Nav eller i digital postkasse. Har bruker reservert seg mot digital kommunikasjon, sendes brevet som papirbrev.'
                                            : 'Vedtaksbrevet må journalføres for å kunne sendes til bruker.'
                                    }
                                    onChange={(e) =>
                                        dispatch({
                                            type: 'setSkalDistribuereVedtaksbrev',
                                            payload: {
                                                skalDistribuereVedtaksbrev: e.target.checked,
                                            },
                                        })
                                    }
                                >
                                    Send vedtaksbrevet til bruker
                                </Checkbox>
                                <BeslutterEndring endring={distribusjonsendringFraBeslutter} />
                            </VStack>
                        </VStack>

                        <MeldekortbehandlingForhåndsvisBrev />
                    </HStack>
                </MeldekortbehandlingSeksjon.Høyre>
            </MeldekortbehandlingSeksjon>
        </>
    );
};
