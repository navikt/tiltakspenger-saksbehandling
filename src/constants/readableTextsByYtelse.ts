import { Ytelse } from '../types/Ytelse';

const readableTextsByYtelse = {
    [Ytelse.AAP]: 'Arbeidsavklaringspenger',
    [Ytelse.DAGPENGER]: 'Dagpenger',
    [Ytelse.SYKEPENGER]: 'Sykepenger',
    [Ytelse.UFØRETRYGD]: 'Uføretrygd',
    [Ytelse.OVERGANGSSTØNAD]: 'Overgangsstønad',
    [Ytelse.PLEIEPENGER]: 'Pleiepenger',
    [Ytelse.FORELDREPENGER]: 'Foreldrepenger',
    [Ytelse.SVANGERSKAPSPENGER]: 'Svangerskapspenger',
    [Ytelse.GJENLEVENDEPENSJON]: 'Gjenlevendepensjon',
    [Ytelse.SUPPLERENDESTØNAD]: 'Supplerende stønad',
    [Ytelse.ALDERSPENSJON]: 'Alderspensjon',
    [Ytelse.OPPLÆRINGSPENGER]: 'Opplæringspenger',
    [Ytelse.OMSORGSPENGER]: 'Omsorgspenger',
    [Ytelse.PENSJONSINNTEKT]: 'Pensjonsordninger',
    [Ytelse.LØNNSINNTEKT]: 'Lønnsinntekt',
    [Ytelse.INSTITUSJONSOPPHOLD]: 'Institusjonsopphold',
};

export default readableTextsByYtelse;
