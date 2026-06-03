import { MeldekortbehandlingSeksjon } from '~/lib/meldekort/v2/meldekortbehandling/layout/seksjon/MeldekortbehandlingSeksjon';
import { FritekstInput } from '~/lib/_felles/fritekst/FritekstInput';
import {
    useMeldekortbehandlingSkjema,
    useMeldekortbehandlingSkjemaDispatch,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { Checkbox, Heading, HStack, InlineMessage } from '@navikt/ds-react';
import { Separator } from '~/lib/_felles/separator/Separator';
import { MeldekortbehandlingForhåndsvisBrev } from '~/lib/meldekort/v2/meldekortbehandling/begrunnelse-og-brev/forhåndsvis-brev/MeldekortbehandlingForhåndsvisBrev';
import { MeldekortbehandlingLagre } from '~/lib/meldekort/v2/meldekortbehandling/lagre/MeldekortbehandlingLagre';

export const MeldekortbehandlingBegrunnelseOgBrev = () => {
    const { textAreas, erReadonly, skalSendeVedtaksbrev } = useMeldekortbehandlingSkjema();
    const { begrunnelse, brevtekst } = textAreas;

    const dispatch = useMeldekortbehandlingSkjemaDispatch();

    return (
        <MeldekortbehandlingSeksjon gap={'space-8'}>
            <MeldekortbehandlingSeksjon.FullBredde>
                <MeldekortbehandlingLagre tekst={'Lagre'} />
            </MeldekortbehandlingSeksjon.FullBredde>

            <MeldekortbehandlingSeksjon.Høyre>
                <Heading size={'small'} level={'3'}>
                    {'Begrunnelse (valgfri)'}
                </Heading>
            </MeldekortbehandlingSeksjon.Høyre>

            <MeldekortbehandlingSeksjon.Venstre>
                <InlineMessage status={'info'}>
                    {
                        'Noter vurderingen. Ikke skriv personsensitive opplysninger som ikke er relevant for saken'
                    }
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
            </MeldekortbehandlingSeksjon.Høyre>

            <MeldekortbehandlingSeksjon.FullBredde>
                <Separator />
            </MeldekortbehandlingSeksjon.FullBredde>

            <MeldekortbehandlingSeksjon.Høyre>
                <HStack justify={'space-between'}>
                    <Heading size={'small'} level={'3'}>
                        {'Tekst til vedtaksbrev (valgfri)'}
                    </Heading>
                </HStack>
            </MeldekortbehandlingSeksjon.Høyre>

            <MeldekortbehandlingSeksjon.Venstre>
                <InlineMessage status={'info'}>
                    {'Teksten vises i vedtaksbrevet til bruker.'}
                </InlineMessage>
            </MeldekortbehandlingSeksjon.Venstre>

            <MeldekortbehandlingSeksjon.Høyre gap={'space-16'}>
                <FritekstInput
                    label={'Tekst til vedtaksbrev (valgfri)'}
                    hideLabel={true}
                    defaultValue={brevtekst.getValue() ?? ''}
                    readOnly={erReadonly || !skalSendeVedtaksbrev}
                    ref={brevtekst.ref}
                />

                <HStack justify={'space-between'}>
                    <Checkbox
                        checked={!skalSendeVedtaksbrev}
                        readOnly={erReadonly}
                        size={'small'}
                        onChange={(e) =>
                            dispatch({
                                type: 'setSkalSendeVedtaksbrev',
                                payload: { skalSendeVedtaksbrev: !e.target.checked },
                            })
                        }
                    >
                        {'Ikke send vedtaksbrev'}
                    </Checkbox>

                    <MeldekortbehandlingForhåndsvisBrev />
                </HStack>
            </MeldekortbehandlingSeksjon.Høyre>
        </MeldekortbehandlingSeksjon>
    );
};
