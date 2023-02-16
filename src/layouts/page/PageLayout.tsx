import { useRouter } from 'next/router';
import Header from '../../components/header/Header';
import { Saksbehandler } from '../../types/Saksbehandler';
import { SøkerResponse } from '../../types/Søker';
import { fetcher, fetchSøker } from '../../utils/http';
import useSWRMutation from 'swr/mutation';
import useSWRImmutable from 'swr/immutable';
import styles from './PageLayout.module.css';
import Loaders from '../../components/loaders/Loaders';

interface PageLayoutProps extends React.PropsWithChildren {}

export function PageLayout({ children }: PageLayoutProps) {
    const router = useRouter();

    const { data: saksbehandler, error, isLoading } = useSWRImmutable<Saksbehandler>('/api/saksbehandler', fetcher);

    const { trigger, isMutating } = useSWRMutation<SøkerResponse>('/api/soker', fetchSøker, {
        onSuccess: (data) => router.push(`/soker/${data.id}`),
    });

    if (isLoading) {
        return <Loaders.Page />;
    }

    return (
        <>
            <Header
                isSearchLoading={isMutating}
                onSearch={(searchString) => trigger({ ident: searchString })}
                saksbehandler={saksbehandler}
            />
            <main>{children}</main>
        </>
    );
}
