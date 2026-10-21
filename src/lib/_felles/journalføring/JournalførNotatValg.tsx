import { Checkbox } from '@navikt/ds-react';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { Nullable } from '~/types/UtilTypes';
import { EndringAvJournalførNotat } from '~/lib/_felles/journalføring/beslutterEndringAvJournalførNotat';

import style from './JournalførNotatValg.module.css';

const jaNei = (valg: boolean) => (valg ? 'Ja' : 'Nei');

export const JournalførNotatValg = (props: {
    skalJournalføreNotat: boolean;
    onChange: (skalJournalføreNotat: boolean) => void;
    readOnly: boolean;
    label?: string;
    /** Beslutters endring av saksbehandlers valg, lagret eller ikke, dersom beslutter har endret det. */
    endringFraBeslutter?: Nullable<EndringAvJournalførNotat>;
}) => {
    return (
        <div className={style.container}>
            <Checkbox
                size={'small'}
                checked={props.skalJournalføreNotat}
                readOnly={props.readOnly}
                onChange={(e) => props.onChange(e.target.checked)}
                description={
                    'Notatet journalføres i Joark og blir synlig i Gosys. Det sendes ikke til bruker.'
                }
            >
                {props.label ?? 'Journalfør begrunnelsen som notat'}
            </Checkbox>
            {props.endringFraBeslutter && (
                <Infokort variant={'info'} size={'small'}>
                    Beslutter endret valget fra {jaNei(props.endringFraBeslutter.saksbehandler)} →{' '}
                    {jaNei(props.endringFraBeslutter.beslutter)}
                </Infokort>
            )}
            {props.skalJournalføreNotat && (
                <Infokort variant={'advarsel'} size={'small'}>
                    Journalnotatet blir synlig i Gosys. Det skal ikke inneholde sensitive
                    opplysninger som ikke er nødvendige for saksbehandlingen.
                </Infokort>
            )}
        </div>
    );
};
