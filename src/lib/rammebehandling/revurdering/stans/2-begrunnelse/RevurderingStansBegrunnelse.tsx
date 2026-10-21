import { VedtakSeksjon } from '~/lib/rammebehandling/felles/layout/seksjon/VedtakSeksjon';
import { FritekstInput } from '~/lib/_felles/fritekst/FritekstInput';
import { VedtakHjelpetekst } from '~/lib/rammebehandling/felles/layout/hjelpetekst/VedtakHjelpetekst';
import { BodyLong } from '@navikt/ds-react';
import { TekstListe } from '~/lib/_felles/liste/TekstListe';
import { useBehandlingSkjema } from '~/lib/rammebehandling/context/BehandlingSkjemaContext';
import { useBehandlingSkjemaFellesDispatch } from '~/lib/rammebehandling/context/felles/behandlingSkjemaFellesContext';
import { JournalførNotatValg } from '~/lib/_felles/journalføring/JournalførNotatValg';

import style from './RevurderingStansBegrunnelse.module.css';

export const RevurderingStansBegrunnelse = () => {
    const { textAreas, erReadonly, skalJournalføreNotat } = useBehandlingSkjema();
    const dispatch = useBehandlingSkjemaFellesDispatch();
    const { begrunnelse } = textAreas;

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre className={style.container}>
                <FritekstInput
                    hideLabel={false}
                    label={'Begrunnelse for stans'}
                    description={
                        'Ikke skriv personsensitiv informasjon som ikke er relevant for saken. Husk at bruker har rett til innsyn.'
                    }
                    defaultValue={begrunnelse.getValue() ?? ''}
                    readOnly={erReadonly}
                    ref={begrunnelse.ref}
                />
                <JournalførNotatValg
                    skalJournalføreNotat={skalJournalføreNotat.vilkårsvurdering}
                    onChange={(skalJournalføreNotat) =>
                        dispatch({
                            type: 'setSkalJournalføreNotatVilkårsvurdering',
                            payload: { skalJournalføreNotat },
                        })
                    }
                    readOnly={erReadonly}
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
                        size={'small'}
                    />
                </VedtakHjelpetekst>
            </VedtakSeksjon.Høyre>
        </VedtakSeksjon>
    );
};
