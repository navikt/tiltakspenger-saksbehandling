import { Control, Controller, useWatch } from 'react-hook-form';
import {
    FormkravFormData,
    KlagefristUnntakSvarordFormData,
    KlagefristUnntakSvarordFormDataTekstMapper,
    INGEN_VEDTAK,
} from './FormkravFormUtils';
import { HStack, Radio, RadioGroup, Select, VStack } from '@navikt/ds-react';
import { Rammevedtak } from '~/types/Rammevedtak';
import { Rammebehandling } from '~/types/Rammebehandling';
import JournalpostId from '~/components/journalpostId/JournalpostId';
import { Nullable } from '~/types/UtilTypes';
import styles from './FormkravForm.module.css';
import { formaterTidspunktKort } from '~/utils/date';
import { behandlingstypeTextFormatter } from '~/components/benk/BenkSideUtils';
import { behandlingResultatTilText } from '~/utils/tekstformateringUtils';

const FormkravForm = (props: {
    control: Control<FormkravFormData>;
    vedtakOgBehandling: Array<{ vedtak: Rammevedtak; behandling: Rammebehandling }>;
    fnrFraPersonopplysninger: Nullable<string>;
    readonly?: boolean;
}) => {
    const erKlagefristOverholdt = useWatch({
        control: props.control,
        name: 'erKlagefristOverholdt',
    });

    return (
        <VStack gap="8" align="start">
            <JournalpostId
                fnrFraPersonopplysninger={props.fnrFraPersonopplysninger}
                size="small"
                readonly={props.readonly}
                className={styles.journalpostIdInputContainer}
            />

            <Controller
                control={props.control}
                name="vedtakDetPåklages"
                render={({ field, fieldState }) => (
                    <Select
                        {...field}
                        label="Vedtaket som er påklaget"
                        size="small"
                        error={fieldState.error?.message}
                        readOnly={props.readonly}
                    >
                        <option value="">Ikke valgt</option>
                        <option value={INGEN_VEDTAK}>Har ikke klaget på et vedtak</option>
                        {props.vedtakOgBehandling.map(({ vedtak, behandling }) => (
                            <option key={`${vedtak.id}-${behandling.id}`} value={vedtak.id}>
                                {behandlingstypeTextFormatter[behandling.type]} -{' '}
                                {behandlingResultatTilText[vedtak.resultat]} -{' '}
                                {formaterTidspunktKort(vedtak.opprettet)}
                            </option>
                        ))}
                    </Select>
                )}
            />
            <Controller
                control={props.control}
                name="erKlagerPartISaken"
                render={({ field, fieldState }) => (
                    <RadioGroup
                        {...field}
                        legend="Er klager part i saken?"
                        size="small"
                        error={fieldState.error?.message}
                        readOnly={props.readonly}
                    >
                        <HStack gap="6">
                            <Radio value={true}>Ja</Radio>
                            <Radio value={false}>Nei</Radio>
                        </HStack>
                    </RadioGroup>
                )}
            />
            <Controller
                control={props.control}
                name="klagesDetPåKonkreteElementer"
                render={({ field, fieldState }) => (
                    <RadioGroup
                        {...field}
                        legend="Klages det på konkrete elementer i vedtaket?"
                        size="small"
                        error={fieldState.error?.message}
                        readOnly={props.readonly}
                    >
                        <HStack gap="6">
                            <Radio value={true}>Ja</Radio>
                            <Radio value={false}>Nei</Radio>
                        </HStack>
                    </RadioGroup>
                )}
            />
            <Controller
                control={props.control}
                name="erKlagefristOverholdt"
                render={({ field, fieldState }) => (
                    <RadioGroup
                        {...field}
                        legend="Er klagefristen overholdt?"
                        size="small"
                        error={fieldState.error?.message}
                        readOnly={props.readonly}
                    >
                        <HStack gap="6">
                            <Radio value={true}>Ja</Radio>
                            <Radio value={false}>Nei</Radio>
                        </HStack>
                    </RadioGroup>
                )}
            />

            {erKlagefristOverholdt === false && (
                <Controller
                    control={props.control}
                    name="erUnntakForKlagefrist"
                    render={({ field, fieldState }) => (
                        <RadioGroup
                            {...field}
                            legend="Er unntak for klagefristen oppfylt?"
                            size="small"
                            error={fieldState.error?.message}
                            readOnly={props.readonly}
                        >
                            {Object.values(KlagefristUnntakSvarordFormData).map((svarord) => (
                                <Radio key={svarord} value={svarord}>
                                    {KlagefristUnntakSvarordFormDataTekstMapper[svarord]}
                                </Radio>
                            ))}
                        </RadioGroup>
                    )}
                />
            )}

            <Controller
                control={props.control}
                name="erKlagenSignert"
                render={({ field, fieldState }) => (
                    <RadioGroup
                        {...field}
                        legend="Er klagen signert?"
                        size="small"
                        error={fieldState.error?.message}
                        readOnly={props.readonly}
                    >
                        <HStack gap="6">
                            <Radio value={true}>Ja</Radio>
                            <Radio value={false}>Nei</Radio>
                        </HStack>
                    </RadioGroup>
                )}
            />
        </VStack>
    );
};

export default FormkravForm;
