import { Control, Controller, useFieldArray } from 'react-hook-form';
import { BrevFormData } from './BrevFormUtils';
import { Button, TextField, Label, HStack, VStack, BodyShort, Textarea } from '@navikt/ds-react';

import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import styles from './BrevForm.module.css';
import { Separator } from '~/components/separator/Separator';

const BrevForm = (props: {
    control: Control<BrevFormData>;
    className?: string;
    readOnly?: boolean;
}) => {
    const { fields, remove, append } = useFieldArray({
        control: props.control,
        name: 'tekstfelter',
    });

    return (
        <VStack className={props.className}>
            <ul className={styles.fieldsList}>
                {fields.map((field, index) => (
                    <li key={field.id}>
                        <VStack gap="4" maxWidth="30rem" marginInline="16">
                            <Controller
                                name={`tekstfelter.${index}.tittel` as const}
                                control={props.control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        readOnly={props.readOnly}
                                        label={
                                            <HStack gap="2" align="center">
                                                <Label>Tittel</Label>
                                                {index > 0 && !props.readOnly && (
                                                    <Button
                                                        className={styles.fjernTekstfeltKnapp}
                                                        type="button"
                                                        variant="tertiary"
                                                        onClick={() => remove(index)}
                                                    >
                                                        <TrashIcon
                                                            title="Slett tekstfelt"
                                                            fontSize="1.5rem"
                                                        />
                                                    </Button>
                                                )}
                                            </HStack>
                                        }
                                        error={fieldState.error?.message}
                                    />
                                )}
                            />
                            <Controller
                                name={`tekstfelter.${index}.tekst` as const}
                                control={props.control}
                                render={({ field, fieldState }) => (
                                    <Textarea
                                        {...field}
                                        readOnly={props.readOnly}
                                        label={`Avsnitt ${index + 1}`}
                                        error={fieldState.error?.message}
                                    />
                                )}
                            />
                        </VStack>

                        {index < fields.length - 1 && (
                            <div className={styles.seperatorMargins}>
                                <Separator />
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            {!props.readOnly && (
                <Button
                    className={styles.leggTilTekstfeltKnapp}
                    type="button"
                    variant="tertiary"
                    size="small"
                    onClick={() => append({ tittel: '', tekst: '' })}
                >
                    <HStack gap="1">
                        <PlusCircleIcon title="Plus ikon" fontSize="1.5rem" />
                        <BodyShort>Legg til tekstfelter</BodyShort>
                    </HStack>
                </Button>
            )}
        </VStack>
    );
};

export default BrevForm;
