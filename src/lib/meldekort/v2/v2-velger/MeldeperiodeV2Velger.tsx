import { Switch } from '@navikt/ds-react';
import Cookies from 'js-cookie';

import style from './MeldeperiodeV2Velger.module.css';

export const MELDEPERIODE_V2_COOKIE_NAME = 'meldeperiode-v2';

type Props = {
    harValgtV2: boolean;
    setHarValgtV2: (enabled: boolean) => void;
};

export const MeldeperiodeV2Velger = ({ harValgtV2, setHarValgtV2 }: Props) => {
    return (
        <div className={style.v2Toggle}>
            <Switch
                position={'right'}
                checked={harValgtV2}
                onChange={(e) => {
                    const checked = e.target.checked;
                    setHarValgtV2(checked);
                    Cookies.set(MELDEPERIODE_V2_COOKIE_NAME, String(checked), {
                        expires: 365,
                    });
                }}
            >
                {'V2'}
            </Switch>
        </div>
    );
};
