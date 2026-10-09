/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/jest-globals';
import { describe, expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { useEffect } from 'react';
import { useFritekstInput } from '~/lib/_felles/fritekst/useFritekstInput';
import { TextAreaInput } from '~/lib/_felles/fritekst/fritekstUtils';
import { SladdbarVerdi } from '~/types/SladdetVerdi';
import { ikkeSladdet, sladdet } from '~test/sladdetVerdi';
import { Nullable } from '~/types/UtilTypes';

// Etterligner dirty-sjekken, som leser verdien i en effect i en underkomponent
const VerdiLeser = ({
    input,
    onLest,
}: {
    input: TextAreaInput;
    onLest: (verdi: Nullable<string>) => void;
}) => {
    useEffect(() => {
        onLest(input.getValue());
    });

    return null;
};

const Fritekst = ({
    lagretVerdi,
    onLest,
}: {
    lagretVerdi: SladdbarVerdi<Nullable<string>>;
    onLest: (verdi: Nullable<string>) => void;
}) => {
    const input = useFritekstInput(lagretVerdi);

    return (
        <>
            <textarea
                aria-label={'fritekst'}
                ref={input.ref}
                defaultValue={input.getValue() ?? ''}
            />
            <VerdiLeser input={input} onLest={onLest} />
        </>
    );
};

const hentTextarea = () => screen.getByLabelText<HTMLTextAreaElement>('fritekst');

describe('useFritekstInput', () => {
    test('oppdaterer feltet med lagret verdi før underkomponenter leser verdien', () => {
        const lest: Nullable<string>[] = [];
        const onLest = (verdi: Nullable<string>) => lest.push(verdi);

        const { rerender } = render(<Fritekst lagretVerdi={ikkeSladdet('ab')} onLest={onLest} />);

        hentTextarea().value = 'a\tb';

        // Ny respons fra backend med samme (sanerte) tekst som før
        rerender(<Fritekst lagretVerdi={ikkeSladdet('ab')} onLest={onLest} />);

        expect(hentTextarea().value).toBe('ab');
        expect(lest.at(-1)).toBe('ab');
    });

    test('tømmer feltet når lagret verdi er null', () => {
        const { rerender } = render(<Fritekst lagretVerdi={ikkeSladdet('ab')} onLest={() => {}} />);

        rerender(<Fritekst lagretVerdi={ikkeSladdet(null)} onLest={() => {}} />);

        expect(hentTextarea().value).toBe('');
    });

    test('beholder feltet uendret ved re-render uten ny verdi fra backend', () => {
        const lagretVerdi = ikkeSladdet('ab');
        const { rerender } = render(<Fritekst lagretVerdi={lagretVerdi} onLest={() => {}} />);

        hentTextarea().value = 'ab og mer';

        rerender(<Fritekst lagretVerdi={lagretVerdi} onLest={() => {}} />);

        expect(hentTextarea().value).toBe('ab og mer');
    });

    test('viser sladdet tekst når lagret verdi er sladdet', () => {
        render(<Fritekst lagretVerdi={sladdet} onLest={() => {}} />);

        expect(hentTextarea().value).toBe('[Sladdet]');
    });
});
