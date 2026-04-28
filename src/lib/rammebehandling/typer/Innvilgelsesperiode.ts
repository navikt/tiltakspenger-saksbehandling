import { Periode } from '~/types/Periode';

export type Innvilgelsesperiode = {
    periode: Periode;
    antallDagerPerMeldeperiode: number;
    internDeltakelseId: string;
};

export type InnvilgelsesperiodePartial = {
    periode: Partial<Periode>;
    antallDagerPerMeldeperiode?: number;
    internDeltakelseId?: string;
};
