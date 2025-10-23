import {
    BehandlingEllerSøknadForOversikt,
    BehandlingForOversikt,
    SøknadForOversikt,
} from '../types/BehandlingForOversikt';

export const isBehandling = (b: BehandlingEllerSøknadForOversikt): b is BehandlingForOversikt =>
    b.id.startsWith('beh_');

export const isSøknad = (b: BehandlingEllerSøknadForOversikt): b is SøknadForOversikt =>
    b.id.startsWith('soknad_');
