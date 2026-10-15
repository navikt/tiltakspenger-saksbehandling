import { VedtakSeksjon } from '~/lib/rammebehandling/felles/layout/seksjon/VedtakSeksjon';
import { VedtakHjelpetekst } from '~/lib/rammebehandling/felles/layout/hjelpetekst/VedtakHjelpetekst';
import { TekstListe } from '~/lib/_felles/liste/TekstListe';
import { BodyLong, Heading } from '@navikt/ds-react';
import { FritekstInput } from '~/lib/_felles/fritekst/FritekstInput';
import { useBehandlingSkjema } from '~/lib/rammebehandling/context/BehandlingSkjemaContext';
import { useBehandlingSkjemaFellesDispatch } from '~/lib/rammebehandling/context/felles/behandlingSkjemaFellesContext';
import { JournalførNotatValg } from '~/lib/_felles/journalføring/JournalførNotatValg';

import style from './BarnetilleggBegrunnelse.module.css';

export const BarnetilleggBegrunnelse = () => {
    const { textAreas, erReadonly, skalJournalføreNotat } = useBehandlingSkjema();
    const dispatch = useBehandlingSkjemaFellesDispatch();
    const { barnetilleggBegrunnelse } = textAreas;

    return (
        <>
            <VedtakSeksjon.Venstre>
                <Heading size={'xsmall'} level={'2'} className={style.header}>
                    {'Begrunnelse vilkårsvurdering barnetillegg'}
                </Heading>
                <BodyLong size={'small'}>{'Noter ned vurderingen.'}</BodyLong>
                <BodyLong size={'small'} className={style.personinfo}>
                    {'Ikke skriv personsensitiv informasjon som ikke er relevant for saken.'}
                </BodyLong>
            </VedtakSeksjon.Venstre>

            <VedtakSeksjon.Venstre>
                <FritekstInput
                    label={'Begrunnelse vilkårsvurdering barnetillegg'}
                    defaultValue={barnetilleggBegrunnelse.getValue() ?? ''}
                    readOnly={erReadonly}
                    ref={barnetilleggBegrunnelse.ref}
                />
                <JournalførNotatValg
                    skalJournalføreNotat={skalJournalføreNotat.barnetillegg}
                    onChange={(skalJournalføreNotat) =>
                        dispatch({
                            type: 'setSkalJournalføreNotatBarnetillegg',
                            payload: { skalJournalføreNotat },
                        })
                    }
                    readOnly={erReadonly}
                    label={'Journalfør begrunnelsen for barnetillegg som notat'}
                />
            </VedtakSeksjon.Venstre>

            <VedtakSeksjon.Høyre>
                <VedtakHjelpetekst header={'Vilkårsvurdering barnetillegg'}>
                    <BodyLong size={'small'}>
                        {'Vurder vilkårene for barnetillegg og noter ned:'}
                    </BodyLong>
                    <TekstListe
                        tekster={[
                            'Er det noe som begrenser retten? Vis til informasjonen du har funnet, hvordan det endrer retten og paragrafen det gjelder',
                            'Eventuelle kommentarer til beslutter',
                        ]}
                    />
                </VedtakHjelpetekst>
            </VedtakSeksjon.Høyre>
        </>
    );
};
