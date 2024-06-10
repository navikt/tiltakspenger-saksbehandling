import { FaktaDTO } from '../types/Behandling';

export const velgFaktaTekst = (typeSaksopplysning: string, fakta: FaktaDTO) => {
  if (typeSaksopplysning === 'HAR_YTELSE') return fakta.harYtelse;
  if (typeSaksopplysning === 'HAR_IKKE_YTELSE') return fakta.harIkkeYtelse;
  return 'Ikke innhentet';
};
