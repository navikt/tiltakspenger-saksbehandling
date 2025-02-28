import {
    BehandlingEllerSøknadForOversiktData,
    BehandlingForOversiktData,
} from '../types/BehandlingTypes';
import { SøknadForOversiktProps } from '../types/SøknadTypes';

export const isBehandling = (
    b: BehandlingEllerSøknadForOversiktData,
): b is BehandlingForOversiktData => b.id.startsWith('beh_');

export const isSøknad = (b: BehandlingEllerSøknadForOversiktData): b is SøknadForOversiktProps =>
    b.id.startsWith('soknad_');
