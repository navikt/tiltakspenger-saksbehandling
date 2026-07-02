import { Textarea } from '@navikt/ds-react';
import { Controller, useForm } from 'react-hook-form';

import { Nullable } from '~/types/UtilTypes';
import { FetcherError } from '~/utils/fetch/fetch';
import AvbrytBehandlingModal from '../../_felles/modaler/avbryt/AvbrytBehandlingModal';

type Props = {
    åpen: boolean;
    onClose: () => void;
    onSubmit: (begrunnelse: string) => void;
    tittel?: string;
    tekst?: string;
    textareaLabel?: string;
    footer?: {
        isMutating: boolean;
        error: Nullable<FetcherError>;
        saksnummer?: string;
    };
};

const AvbrytRammebehandlingModal = (props: Props) => {
    const form = useForm<{ begrunnelse: string }>({ defaultValues: { begrunnelse: '' } });

    return (
        <AvbrytBehandlingModal
            bodyInnhold={
                <Controller
                    rules={{ required: 'Du må fylle ut en begrunnelse' }}
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Textarea
                            {...field}
                            error={fieldState.error?.message}
                            label={
                                props.textareaLabel ??
                                'Hvorfor avsluttes behandlingen? (obligatorisk)'
                            }
                        />
                    )}
                    name={'begrunnelse'}
                />
            }
            åpen={props.åpen}
            onClose={props.onClose}
            tittel={props.tittel}
            tekst={props.tekst}
            footer={props.footer}
            onSubmit={form.handleSubmit((values) => props.onSubmit(values.begrunnelse))}
        />
    );
};

export default AvbrytRammebehandlingModal;
