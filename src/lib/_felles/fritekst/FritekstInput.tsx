import { Textarea } from '@navikt/ds-react';
import { ComponentProps, forwardRef } from 'react';

type Props = ComponentProps<typeof Textarea>;

export const FritekstInput = forwardRef<HTMLTextAreaElement, Props>(
    ({ label, hideLabel = true, minRows, ...textareaProps }, ref) => {
        return (
            <Textarea
                label={label}
                hideLabel={hideLabel}
                minRows={minRows ?? 5}
                resize={'vertical'}
                ref={ref}
                {...textareaProps}
            />
        );
    },
);

FritekstInput.displayName = 'FritekstInput';
