import { Button } from '@navikt/ds-react';
import React from 'react';
import { KlageHendelseModal } from '~/dev/klage/KlageHendelseModal';

export const KlageHendelse = () => {
    const [vilOppretteKlageHendelse, setVilOppretteKlageHendelse] = React.useState(false);

    return (
        <div>
            {vilOppretteKlageHendelse && (
                <KlageHendelseModal
                    open={vilOppretteKlageHendelse}
                    onClose={() => setVilOppretteKlageHendelse(false)}
                />
            )}
            <Button variant="secondary" onClick={() => setVilOppretteKlageHendelse(true)}>
                Ny klagehendelse
            </Button>
        </div>
    );
};
