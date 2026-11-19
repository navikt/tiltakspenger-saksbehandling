import { Checkbox, CheckboxGroup, InlineMessage } from '@navikt/ds-react';
import { VedtakSeksjon } from '~/lib/rammebehandling/felles/layout/seksjon/VedtakSeksjon';
import { Avslagsgrunn } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import {
    useSøknadsbehandlingAvslagSkjema,
    useSøknadsbehandlingSkjemaDispatch,
} from '~/lib/rammebehandling/context/søknadsbehandling/søknadsbehandlingSkjemaContext';
import { useSak } from '~/lib/sak/SakContext';
import { useSøknadsbehandling } from '~/lib/rammebehandling/context/BehandlingContext';
import {
    skalVarsleOmFlereTidligereInnvilgelser,
    synligeAvslagsgrunner,
} from '~/lib/rammebehandling/søknadsbehandling/avslagsgrunner/avslagsgrunnerUtils';
import { useFeatureToggles } from '~/lib/_felles/context/FeatureTogglesContext';

import styles from './SøknadsbehandlingAvslagsgrunner.module.css';

export const SøknadsbehandlingAvslagsgrunner = () => {
    const { sak } = useSak();
    const { behandling } = useSøknadsbehandling();
    const { avslagsgrunner, erReadonly } = useSøknadsbehandlingAvslagSkjema();
    const dispatch = useSøknadsbehandlingSkjemaDispatch();
    const { avslagInnvilgetTiltakspengerToggle } = useFeatureToggles();

    const visFlereInnvilgelserVarsel = skalVarsleOmFlereTidligereInnvilgelser(
        sak,
        behandling,
        avslagsgrunner,
    );

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <CheckboxGroup
                    legend="Avslagsgrunner"
                    className={styles.checkboxGroup}
                    value={avslagsgrunner}
                    readOnly={erReadonly}
                    onChange={(avslagsgrunner: Avslagsgrunn[]) => {
                        dispatch({
                            type: 'oppdaterAvslagsgrunner',
                            payload: {
                                avslagsgrunner,
                            },
                        });
                    }}
                >
                    {synligeAvslagsgrunner(avslagInnvilgetTiltakspengerToggle, avslagsgrunner).map(
                        (grunn) => (
                            <Checkbox key={grunn} value={grunn} size={'small'}>
                                {AvslagsgrunnTekst[grunn]}
                            </Checkbox>
                        ),
                    )}
                </CheckboxGroup>
                {visFlereInnvilgelserVarsel && (
                    <InlineMessage status={'warning'} size={'small'}>
                        {
                            'Søknadsperioden overlapper flere innvilgelser. Vedtaksbrevet oppgir derfor ikke periode og vedtaksdato for innvilgelsen. Skriv dette i teksten til vedtaksbrevet.'
                        }
                    </InlineMessage>
                )}
            </VedtakSeksjon.Venstre>
        </VedtakSeksjon>
    );
};

const AvslagsgrunnTekst: Record<Avslagsgrunn, string> = {
    [Avslagsgrunn.DeltarIkkePåArbeidsmarkedstiltak]: 'Deltar ikke på arbeidsmarkedstiltak',
    [Avslagsgrunn.Alder]: 'Alder',
    [Avslagsgrunn.Livsoppholdytelser]: 'Livsoppholdytelser',
    [Avslagsgrunn.Kvalifiseringsprogrammet]: 'Kvalifiseringsprogrammet',
    [Avslagsgrunn.Introduksjonsprogrammet]: 'Introduksjonsprogrammet',
    [Avslagsgrunn.LønnFraTiltaksarrangør]: 'Lønn fra tiltaksarrangør',
    [Avslagsgrunn.LønnFraAndre]: 'Lønn fra andre',
    [Avslagsgrunn.Institusjonsopphold]: 'Institusjonsopphold',
    [Avslagsgrunn.FremmetForSent]: 'Fremmet for sent',
    [Avslagsgrunn.RettTilDagpenger]: 'Sanksjonsperiode/Dagpenger',
    [Avslagsgrunn.InnvilgetTiltakspenger]: 'Tiltakspenger',
} as const;
