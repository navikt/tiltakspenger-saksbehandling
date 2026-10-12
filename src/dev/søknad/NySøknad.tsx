import { Button } from '@navikt/ds-react';
import React from 'react';
import { NySøknadModal } from '~/dev/søknad/NySøknadModal';

export const NySøknad = () => {
    const [vilOppretteNySøknad, setVilOppretteNySøknad] = React.useState(false);

    return (
        <div>
            {vilOppretteNySøknad && (
                <NySøknadModal
                    open={vilOppretteNySøknad}
                    onClose={() => setVilOppretteNySøknad(false)}
                />
            )}
            <Button variant="secondary" onClick={() => setVilOppretteNySøknad(true)}>
                Ny søknad
            </Button>
        </div>
    );
};
