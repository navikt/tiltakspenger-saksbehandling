import { Nullable } from '~/types/UtilTypes';
import { Søknad, Søknadshendelse, SøknadshendelseType } from '~/lib/søknad/søknadTyper';

/** Siste hendelse er en gjenåpning dersom søknaden ble tatt opp igjen etter å ha vært avbrutt. */
export const hentGjenåpningAvSøknad = (søknad: Søknad): Nullable<Søknadshendelse> => {
    const sisteHendelse = søknad.avbrutt.at(-1);

    return sisteHendelse?.type === SøknadshendelseType.GJENÅPNET ? sisteHendelse : null;
};
