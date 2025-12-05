import { Checkbox, CheckboxGroup } from '@navikt/ds-react';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Avslagsgrunn } from '~/types/Søknadsbehandling';
import {
    useSøknadsbehandlingAvslagSkjema,
    useSøknadsbehandlingSkjemaDispatch,
} from '~/components/behandling/context/søknadsbehandling/søknadsbehandlingSkjemaContext';

import styles from './SøknadsbehandlingAvslagsgrunner.module.css';

export const SøknadsbehandlingAvslagsgrunner = () => {
    const { avslagsgrunner, erReadonly } = useSøknadsbehandlingAvslagSkjema();
    const dispatch = useSøknadsbehandlingSkjemaDispatch();

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
                    {Object.values(Avslagsgrunn).map((grunn) => (
                        <Checkbox key={grunn} value={grunn} size={'small'}>
                            {AvslagsgrunnTekst[grunn]}
                        </Checkbox>
                    ))}
                </CheckboxGroup>
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
} as const;
