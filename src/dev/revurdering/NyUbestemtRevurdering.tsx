import { Button } from '@navikt/ds-react';
import { useState } from 'react';
import { NyUbestemtRevurderingModal } from '~/dev/revurdering/NyUbestemtRevurderingModal';

export const NyUbestemtRevurdering = () => {
    const [åpen, setÅpen] = useState(false);

    return (
        <div>
            {åpen && <NyUbestemtRevurderingModal open={åpen} onClose={() => setÅpen(false)} />}
            <Button variant="secondary" onClick={() => setÅpen(true)}>
                Ny ubestemt revurdering
            </Button>
        </div>
    );
};
