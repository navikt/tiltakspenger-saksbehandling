import { VedtakSeksjon } from '../../../vedtak/seksjon/VedtakSeksjon';
import { SaksbehandlerRolle } from '../../../../../types/Saksbehandler';
import {
    useFørstegangsbehandling,
    useFørstegangsVedtakDispatch,
} from '../../context/FørstegangsbehandlingContext';
import { VedtakHjelpetekst } from '../../../vedtak/hjelpetekst/VedtakHjelpetekst';
import { TekstListe } from '../../../../liste/TekstListe';
import { BodyLong, Heading, Textarea } from '@navikt/ds-react';

import style from './BarnetilleggBegrunnelse.module.css';

export const BarnetilleggBegrunnelse = () => {
    const { behandling, rolleForBehandling } = useFørstegangsbehandling();
    const { barnetillegg } = behandling;

    const dispatch = useFørstegangsVedtakDispatch();

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
                <Textarea
                    label={'Begrunnelse vilkårsvurdering barnetillegg'}
                    hideLabel={true}
                    minRows={10}
                    resize={'vertical'}
                    defaultValue={barnetillegg?.begrunnelse}
                    readOnly={rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER}
                    // TODO Anders: må gjøre noe på en annen måte, enten med mellomlagringen eller vedtak context'en :D
                    // lagringUrl={`/sak/${sakId}/behandling/${id}/barnetillegg`}
                    // lagringBody={(tekst) =>
                    //     ({
                    //         begrunnelse: tekst,
                    //         barnetilleggForPeriode: barnetilleggForPeriode ?? [],
                    //     }) satisfies VedtakBarnetilleggBegrunnelseDTO
                    // }
                    onChange={(event) => {
                        dispatch({
                            type: 'setBarnetilleggBegrunnelse',
                            payload: {
                                begrunnelse: event.target.value,
                            },
                        });
                    }}
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
