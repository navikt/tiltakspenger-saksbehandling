import { test, expect } from '@jest/globals';

test('atNonNull returnerer elementet på gyldig index', () => {
    expect(['a', 'b', 'c'].atNonNull(1)).toBe('b');
});

test('atNonNull støtter negative indekser', () => {
    expect(['a', 'b', 'c'].atNonNull(-1)).toBe('c');
});

test('atNonNull kaster feil når index er utenfor arrayet', () => {
    expect(() => ['a'].atNonNull(5)).toThrow(
        'Verdien kan ikke være null eller undefined (5 out of bounds, length: 1)',
    );
});

test('atNonNull kaster feil på tomt array', () => {
    expect(() => [].atNonNull(0)).toThrow();
});

test('atNonNull bruker custom melding når den er gitt', () => {
    expect(() => ['a'].atNonNull(1, 'Ugyldig index')).toThrow('Ugyldig index');
});
