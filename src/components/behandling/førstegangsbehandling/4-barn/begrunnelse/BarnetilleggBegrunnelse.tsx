import { VedtakSeksjon } from '../../../vedtak-layout/seksjon/VedtakSeksjon';
import { SaksbehandlerRolle } from '../../../../../types/Saksbehandler';
import { useFørstegangsVedtakSkjema } from '../../context/FørstegangsVedtakContext';
import { VedtakHjelpetekst } from '../../../vedtak-layout/hjelpetekst/VedtakHjelpetekst';
import { TekstListe } from '../../../../liste/TekstListe';
import { BodyLong, Heading } from '@navikt/ds-react';
import { TekstfeltMedMellomlagring } from '../../../../tekstfelt/TekstfeltMedMellomlagring';
import { VedtakBarnetilleggDTO } from '../../../../../types/VedtakTyper';
import { useFørstegangsbehandling } from '../../../BehandlingContext';

import style from './BarnetilleggBegrunnelse.module.css';

export const BarnetilleggBegrunnelse = () => {
    const { behandling, rolleForBehandling } = useFørstegangsbehandling();
    const { barnetillegg, sakId, id } = behandling;

    const { barnetilleggBegrunnelseRef, barnetilleggPerioder } = useFørstegangsVedtakSkjema();

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
                <TekstfeltMedMellomlagring
                    label={'Begrunnelse vilkårsvurdering barnetillegg'}
                    defaultValue={barnetillegg?.begrunnelse}
                    readOnly={rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER}
                    lagringUrl={`/sak/${sakId}/behandling/${id}/barnetillegg`}
                    lagringBody={(tekst) =>
                        ({
                            begrunnelse: tekst,
                            perioder: barnetilleggPerioder ?? [],
                        }) satisfies VedtakBarnetilleggDTO
                    }
                    ref={barnetilleggBegrunnelseRef}
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
