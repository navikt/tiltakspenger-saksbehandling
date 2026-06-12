import { useForm } from 'react-hook-form';

import router from 'next/router';
import { personoversiktUrl } from '~/utils/urls';
import { useAvbrytKlagebehandling } from '../../api/KlageApi';
import { KlageId } from '../../typer/Klage';
import { SakId } from '~/lib/sak/SakTyper';
import AvbrytBehandlingModal from '~/lib/_felles/modaler/avbryt/AvbrytBehandlingModal';
import {
    AvbrytKlagebehandlingFormData,
    avbrytKlagebehandlingFormDataToRequest,
    avbrytKlagebehandlingFormValidation,
} from '../../forms/avbryt/AvbrytKlagebehandlingFormUtils';
import AvbrytKlagebehandlingForm from '../../forms/avbryt/AvbrytKlagebehandlingForm';

const AvbrytKlagebehandlingModal = (props: {
    sakId: SakId;
    klageId: KlageId;
    saksnummer: string;
    åpen: boolean;
    onClose: () => void;
}) => {
    const avbrytKlageBehandling = useAvbrytKlagebehandling({
        sakId: props.sakId,
        klageId: props.klageId,
        onSuccess: () => {
            router.push(personoversiktUrl(props.saksnummer));
        },
    });

    const form = useForm<AvbrytKlagebehandlingFormData>({
        defaultValues: {
            status: '',
            begrunnelse: '',
        },
        resolver: avbrytKlagebehandlingFormValidation,
    });

    const onSubmit = (values: AvbrytKlagebehandlingFormData) => {
        avbrytKlageBehandling?.trigger(avbrytKlagebehandlingFormDataToRequest(values));
    };

    return (
        <AvbrytBehandlingModal
            tittel="Avslutt klagebehandling"
            tekst="Er du sikker på at du vil avslutte klagebehandlingen?"
            åpen={props.åpen}
            onClose={props.onClose}
            onSubmit={form.handleSubmit(onSubmit)}
            footer={{
                isMutating: avbrytKlageBehandling?.isMutating ?? false,
                error: avbrytKlageBehandling?.error?.message ?? null,
            }}
            bodyInnhold={<AvbrytKlagebehandlingForm control={form.control} />}
        />
    );
};

export default AvbrytKlagebehandlingModal;
