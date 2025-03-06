import { SøknadForBehandlingProps } from '../types/SøknadTypes';

export const erSøknadAvbrutt = (søknad: SøknadForBehandlingProps) => !!søknad.avbrutt;
