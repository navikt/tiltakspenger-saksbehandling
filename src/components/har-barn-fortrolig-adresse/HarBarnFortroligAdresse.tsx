import { Tag } from '@navikt/ds-react';
import { Barn } from '../../types/Personalia';
import styles from './HarBarnFortroligAdresse.module.css';

interface HarBarnFortroligAdresse {
    barn: Barn[];
}

const HarBarnFortroligAdresse = ({ barn }: HarBarnFortroligAdresse) => {
    const fortroligAdresse = utledFortroligAdresseForBarn(barn);
    return fortroligAdresse ? (
        <Tag variant="error" className={styles.personaliaHeader__barnTag}>
            {fortroligAdresse}
        </Tag>
    ) : null;
};

function utledFortroligAdresseForBarn(barn: Barn[]): string {
    const fortrolig = barn.some((barn) => barn.fortrolig);
    const strengtFortrolig = barn.some((barn) => barn.strengtFortrolig);
    return fortrolig || strengtFortrolig ? `Barn har${strengtFortrolig && ` strengt`} fortrolig adresse` : '';
}

export default HarBarnFortroligAdresse;
