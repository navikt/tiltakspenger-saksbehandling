import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';

import styles from './Sladdebanner.module.css';

export const SLADDEBANNER_TEKST =
    'Personopplysninger og fritekster er sladdet for rollen din, og verdiene vises som [Sladdet]. Saken kan ellers leses som vanlig.';

export const Sladdebanner = () => {
    const { sladdes } = useSaksbehandler();

    if (!sladdes) {
        return null;
    }

    return (
        <Infokort variant={'info'} size={'small'} role={'status'} className={styles.sladdebanner}>
            {SLADDEBANNER_TEKST}
        </Infokort>
    );
};
