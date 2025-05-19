import { Simulering, SimuleringEndring, SimuleringIngenEndring } from '../types/Simulering';

export const erSimuleringIngenEndring = (s: Simulering): s is SimuleringIngenEndring =>
    s.type === 'IngenEndring';
export const erSimuleringEndring = (s: Simulering): s is SimuleringEndring => s.type === 'Endring';
