import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { VedtakHjelpetekst } from '~/components/behandling/felles/layout/hjelpetekst/VedtakHjelpetekst';
import { TekstListe } from '../../../../liste/TekstListe';
import { BodyLong, Heading } from '@navikt/ds-react';
import { FritekstInput } from '~/components/fritekst/FritekstInput';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';
import { useBehandlingSkjema } from '~/components/behandling/context/BehandlingSkjemaContext';

import style from './BarnetilleggBegrunnelse.module.css';

export const BarnetilleggBegrunnelse = () => {
    const { rolleForBehandling } = useBehandling();
    const { barnetilleggBegrunnelse } = useBehandlingSkjema().textAreas;

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
                    defaultValue={barnetilleggBegrunnelse.getValue()}
                    readOnly={rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER}
                    ref={barnetilleggBegrunnelse.ref}
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
