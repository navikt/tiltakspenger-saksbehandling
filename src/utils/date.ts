import dayjs from 'dayjs';

export function formatDate(dateString: string) {
    return dayjs(dateString).format('DD.MM.YYYY');
}
