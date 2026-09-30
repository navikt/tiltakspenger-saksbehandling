import { Nullable } from '~/types/UtilTypes';
import { BenkBeskyttelse } from '../../typer/felles';
import { benkBeskyttelseTekst } from '../../utils/benkTekster';
import { BenkFilterSelect } from './BenkFilterSelect';

type Props = {
    value: Nullable<BenkBeskyttelse>;
    onChange: (beskyttelse: Nullable<BenkBeskyttelse>) => void;
};

/** Filteret på adressebeskyttelse og skjerming, sist blant de lokale filtrene i alle fanene */
export const BenkBeskyttelseSelect = ({ value, onChange }: Props) => (
    <BenkFilterSelect
        label={'Adressebeskyttelse og skjerming'}
        value={value}
        onChange={onChange}
        alternativer={benkBeskyttelseTekst}
    />
);
