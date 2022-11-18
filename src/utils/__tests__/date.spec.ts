import { formatDate, formatDateShort, formatPeriode, formatÅpenPeriode } from './../date';
import { Periode, ÅpenPeriode } from '../../types/Periode';

const testDate = '2032-01-31';
const anotherTestDate = '2034-01-31';

describe('date utils', () => {
    test('formatDateShort should format to DD.MM.YY', () => {
        expect(formatDateShort(testDate)).toEqual('31.01.32');
    });

    test('formatDate should format to DD.MM.YYYY', () => {
        expect(formatDate(testDate)).toEqual('31.01.2032');
    });

    test('formatPeriode should format two dates with dash in between', () => {
        const periode: Periode = { fra: testDate, til: anotherTestDate };
        expect(formatPeriode(periode)).toEqual('31.01.2032 - 31.01.2034');
    });

    test('formatÅpenPeriode should format two dates with dash in between when both fra and til has values', () => {
        const periode: Periode = { fra: testDate, til: anotherTestDate };
        expect(formatÅpenPeriode(periode)).toEqual('31.01.2032 - 31.01.2034');
    });

    test('formatÅpenPeriode should format the first date with a dash, if til-attribute is missing', () => {
        const periode: ÅpenPeriode = { fra: testDate };
        expect(formatÅpenPeriode(periode)).toEqual('31.01.2032 - ');
    });
});
