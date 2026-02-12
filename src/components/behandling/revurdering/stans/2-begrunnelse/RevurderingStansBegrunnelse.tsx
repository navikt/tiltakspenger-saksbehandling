import { useRevurderingBehandling } from '../../../context/BehandlingContext';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { FritekstInput } from '~/components/fritekst/FritekstInput';
import { VedtakHjelpetekst } from '~/components/behandling/felles/layout/hjelpetekst/VedtakHjelpetekst';
import { BodyLong } from '@navikt/ds-react';
import { TekstListe } from '../../../../liste/TekstListe';
import { useBehandlingSkjema } from '~/components/behandling/context/BehandlingSkjemaContext';

import style from './RevurderingStansBegrunnelse.module.css';

export const RevurderingStansBegrunnelse = () => {
    const { textAreas, erReadonly } = useBehandlingSkjema();
    const { begrunnelse } = textAreas;

    const { behandling } = useRevurderingBehandling();
    const { begrunnelseVilkårsvurdering } = behandling;

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre className={style.container}>
                <FritekstInput
                    hideLabel={false}
                    label={'Begrunnelse for stans'}
                    description={
                        'Ikke skriv personsensitiv informasjon som ikke er relevant for saken. Husk at bruker har rett til innsyn.'
                    }
                    defaultValue={begrunnelseVilkårsvurdering ?? ''}
                    readOnly={erReadonly}
                    // TODO Gjorde lintingen strengere ved oppgradering til Next 16. Fikset bare åpenbare feil, denne burde undersøkes.
                    /* eslint-disable-next-line react-hooks/refs */
                    ref={begrunnelse.ref}
                />
            </VedtakSeksjon.Venstre>
            <VedtakSeksjon.Høyre>
                <VedtakHjelpetekst header={'Stans av tiltakspenger'}>
                    <BodyLong size={'small'}>{'Vurder hjemmel for stans og noter ned: '}</BodyLong>
                    <TekstListe
                        tekster={[
                            'Hvilke faktum som er lagt til grunn og hvordan regel er vurdert opp mot faktumet',
                            'Eventuelle kommentarer til beslutter',
                        ]}
                    />
                </VedtakHjelpetekst>
            </VedtakSeksjon.Høyre>
        </VedtakSeksjon>
    );
};
