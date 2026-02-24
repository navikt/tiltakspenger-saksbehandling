import { Control, Controller, useWatch } from 'react-hook-form';
import {
    FormkravFormData,
    KlagefristUnntakSvarordFormData,
    KlagefristUnntakSvarordFormDataTekstMapper,
    INGEN_VEDTAK,
    KlageInnsendingskildeFormData,
    KlageInnsendingskildeFormDataTekstMapper,
} from './FormkravFormUtils';
import { HStack, LocalAlert, Radio, RadioGroup, Select, VStack } from '@navikt/ds-react';
import { Rammevedtak } from '~/types/Rammevedtak';
import { Rammebehandling } from '~/types/Rammebehandling';
import JournalpostId from '~/components/journalpostId/JournalpostId';
import { Nullable } from '~/types/UtilTypes';
import styles from './FormkravForm.module.css';
import { formaterTidspunktKort, startOfDay } from '~/utils/date';
import { behandlingstypeTextFormatter } from '~/components/benk/BenkSideUtils';
import { behandlingResultatTilText } from '~/utils/tekstformateringUtils';
import { Datovelger } from '~/components/datovelger/Datovelger';

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

    const valgtVedtakId = useWatch({
        control: props.control,
        name: 'vedtakDetPåklages',
    });

    const valgtVedtak = props.vedtakOgBehandling.find(
        ({ vedtak }) => vedtak.id === valgtVedtakId,
    )?.vedtak;

    const valgtInnsendingsdato = useWatch({
        control: props.control,
        name: 'innsendingsdato',
    });

    return (
        <VStack gap="space-32" align="start">
            <JournalpostId
                fnrFraPersonopplysninger={props.fnrFraPersonopplysninger}
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
                name={'innsendingsdato'}
                render={({ field, fieldState }) => (
                    <Datovelger
                        onDateChange={(date) => {
                            field.onChange(date);
                        }}
                        maxDate={new Date()}
                        selected={field.value ?? undefined}
                        error={fieldState.error?.message}
                        label="Innsendingsdato for klagen"
                        readOnly={props.readonly}
                    />
                )}
            />

            {valgtVedtak &&
                valgtInnsendingsdato &&
                valgtInnsendingsdato < startOfDay(valgtVedtak.opprettet) && (
                    <LocalAlert status="warning" size="small">
                        <LocalAlert.Header>
                            <LocalAlert.Title>Verifiser innsendingsdato for klage</LocalAlert.Title>
                        </LocalAlert.Header>
                        <LocalAlert.Content>
                            Innsendingsdato for klagen er før vedtaket som er påklaget. Vennligst
                            sjekk at du har valgt riktig vedtak.
                        </LocalAlert.Content>
                    </LocalAlert>
                )}

            <Controller
                control={props.control}
                name={'innsendingskilde'}
                render={({ field, fieldState }) => (
                    <Select
                        {...field}
                        label="Innsendingskilde for klagen"
                        error={fieldState.error?.message}
                        readOnly={props.readonly}
                    >
                        <option value="">Ikke valgt</option>
                        {Object.values(KlageInnsendingskildeFormData).map((kilde) => (
                            <option key={kilde} value={kilde}>
                                {KlageInnsendingskildeFormDataTekstMapper[kilde]}
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
                        error={fieldState.error?.message}
                        readOnly={props.readonly}
                    >
                        <HStack gap="space-24">
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
                        error={fieldState.error?.message}
                        readOnly={props.readonly}
                    >
                        <HStack gap="space-24">
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
                        error={fieldState.error?.message}
                        readOnly={props.readonly}
                    >
                        <HStack gap="space-24">
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
                            className={styles.erUnntakForKlagefristRadioGroup}
                            {...field}
                            legend="Er unntak for klagefristen oppfylt?"
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
                        error={fieldState.error?.message}
                        readOnly={props.readonly}
                    >
                        <HStack gap="space-24">
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
