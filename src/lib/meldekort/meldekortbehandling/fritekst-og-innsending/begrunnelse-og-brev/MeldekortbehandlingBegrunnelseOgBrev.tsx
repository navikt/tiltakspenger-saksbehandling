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
} from '~/lib/meldekort/utils/meldekortbehandlingUtils';
import { Infokort } from '~/lib/_felles/infokort/Infokort';

import style from './MeldekortbehandlingBegrunnelseOgBrev.module.css';

const jaNei = (valg: boolean) => (valg ? 'Ja' : 'Nei');

export const MeldekortbehandlingBegrunnelseOgBrev = () => {
    const {
        begrunnelse,
        brevtekst,
        erReadonly,
        kanEndreSkalJournalføreNotat,
        kanEndreSkalDistribuereVedtaksbrev,
        skalJournalføreVedtaksbrev,
        skalDistribuereVedtaksbrev,
        skalJournalføreNotat,
    } = useMeldekortbehandlingSkjema();
    const meldekortbehandling = useMeldekortbehandling();

    const dispatch = useMeldekortbehandlingSkjemaDispatch();

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
                        <VStack className={style.brevvalg}>
                            <Checkbox
                                checked={skalJournalføreVedtaksbrev && skalDistribuereVedtaksbrev}
                                readOnly={!kanEndreSkalDistribuereVedtaksbrev}
                                size={'small'}
                                description={
                                    'Bruker får brevet på Ditt Nav eller i digital postkasse. Har bruker reservert seg mot digital kommunikasjon, sendes brevet som papirbrev.'
                                }
                                onChange={(e) =>
                                    dispatch({
                                        type: 'setSkalSendeVedtaksbrev',
                                        payload: { skalSendeVedtaksbrev: e.target.checked },
                                    })
                                }
                            >
                                Journalfør og send vedtaksbrevet til bruker
                            </Checkbox>
                            {distribusjonsendringFraBeslutter && (
                                <Infokort variant={'info'} size={'small'}>
                                    Beslutter endret valget fra{' '}
                                    {jaNei(distribusjonsendringFraBeslutter.saksbehandler)} →{' '}
                                    {jaNei(distribusjonsendringFraBeslutter.beslutter)}
                                </Infokort>
                            )}
                        </VStack>

                        <MeldekortbehandlingForhåndsvisBrev />
                    </HStack>
                </MeldekortbehandlingSeksjon.Høyre>
            </MeldekortbehandlingSeksjon>
        </>
    );
};
