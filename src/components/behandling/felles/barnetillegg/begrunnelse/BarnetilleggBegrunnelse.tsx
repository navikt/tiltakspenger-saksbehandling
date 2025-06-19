import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { VedtakHjelpetekst } from '~/components/behandling/felles/layout/hjelpetekst/VedtakHjelpetekst';
import { TekstListe } from '../../../../liste/TekstListe';
import { BodyLong, Heading } from '@navikt/ds-react';
import { TekstfeltMedMellomlagring } from '../../../../tekstfelt/TekstfeltMedMellomlagring';
import { VedtakBarnetilleggDTO } from '~/types/VedtakTyper';
import { BehandlingBarnetilleggProps } from '~/components/behandling/felles/barnetillegg/BehandlingBarnetillegg';
import { useSaksbehandler } from '~/context/saksbehandler/SaksbehandlerContext';
import { hentRolleForBehandling } from '~/utils/tilganger';

import style from './BarnetilleggBegrunnelse.module.css';

type Props = BehandlingBarnetilleggProps;

export const BarnetilleggBegrunnelse = ({ behandling, context }: Props) => {
    const { barnetillegg, sakId, id } = behandling;
    const { barnetilleggPerioder, barnetilleggBegrunnelseRef } = context;

    const { innloggetSaksbehandler } = useSaksbehandler();
    const rolle = hentRolleForBehandling(behandling, innloggetSaksbehandler);

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
                    readOnly={rolle !== SaksbehandlerRolle.SAKSBEHANDLER}
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
