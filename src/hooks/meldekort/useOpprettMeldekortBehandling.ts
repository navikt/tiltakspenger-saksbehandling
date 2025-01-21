import router from 'next/router';
import useSWR from 'swr';

export function useOpprettMeldekortBehandling(
    hendelseId: string,
    sakId: string,
    saksnummer: string,
) {
    const result = useSWR(`/api/sak/${sakId}/meldeperiode/${hendelseId}/opprettBehandling`, {
        onSuccess: () => {
            router.push(`/sak/${saksnummer}`);
        },
    });

    return result;
}
