import { DatePicker, Detail, HStack, Label, useRangeDatepicker, VStack } from '@navikt/ds-react';

export const RangePickerDate = (props: {
    value: { fraOgMed: Date | undefined; tilOgMed: Date | undefined };
    size?: 'medium' | 'small';
    onChange: (periode: { fraOgMed: Date | undefined; tilOgMed: Date | undefined }) => void;
    error?: { fraOgMed?: string; tilOgMed?: string };
}) => {
    const { datepickerProps, fromInputProps, toInputProps } = useRangeDatepicker({
        onRangeChange: (v) =>
            props.onChange({ fraOgMed: v?.from ?? undefined, tilOgMed: v?.to ?? undefined }),
        defaultSelected: {
            from: props.value.fraOgMed ?? undefined,
            to: props.value.tilOgMed ?? undefined,
        },
    });

    return (
        <VStack>
            <Label>Deltakelsesperiode</Label>
            <Detail>Default periode er 1.april 2025 - 10.april 2025</Detail>
            <HStack gap={'space-16'}>
                <DatePicker {...datepickerProps} dropdownCaption>
                    <DatePicker.Input
                        {...fromInputProps}
                        label={'Fra og med'}
                        size={props.size ?? 'medium'}
                    />
                </DatePicker>
                <DatePicker {...datepickerProps} dropdownCaption>
                    <DatePicker.Input
                        {...toInputProps}
                        label={'Til og med'}
                        size={props.size ?? 'medium'}
                    />
                </DatePicker>
            </HStack>
        </VStack>
    );
};
