import { Periode } from '~/types/Periode';

export type Innvilgelsesperiode = {
    periode: Periode;
    antallDagerPerMeldeperiode: number;
    tiltaksdeltakelseId: string;
};

export type InnvilgelsesperiodePartial = {
    periode: Partial<Periode>;
    antallDagerPerMeldeperiode?: number;
    tiltaksdeltakelseId?: string;
};
