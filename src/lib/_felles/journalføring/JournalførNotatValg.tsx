import { Checkbox } from '@navikt/ds-react';
import { Infokort } from '~/lib/_felles/infokort/Infokort';

import style from './JournalførNotatValg.module.css';

type Props = {
    skalJournalføreNotat: boolean;
    onChange: (skalJournalføreNotat: boolean) => void;
    readOnly: boolean;
};

export const JournalførNotatValg = ({ skalJournalføreNotat, onChange, readOnly }: Props) => {
    return (
        <div className={style.container}>
            <Checkbox
                size={'small'}
                checked={skalJournalføreNotat}
                readOnly={readOnly}
                onChange={(e) => onChange(e.target.checked)}
                description={
                    'Notatet journalføres i Joark og blir synlig i Gosys. Det sendes ikke til bruker.'
                }
            >
                {'Journalfør begrunnelsen som notat'}
            </Checkbox>
            {skalJournalføreNotat && (
                <Infokort variant={'advarsel'} size={'small'}>
                    {
                        'Journalnotatet blir synlig i Gosys. Det skal ikke inneholde sensitive opplysninger som ikke er nødvendige for saksbehandlingen.'
                    }
                </Infokort>
            )}
        </div>
    );
};
