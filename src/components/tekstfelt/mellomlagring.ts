import { debounce } from 'lodash';
import { fetchJsonFraApiClientSide } from '../../utils/fetch';

type Props<Body> = {
    url: string;
    // body: Body;
};

export const mellomlagre = <Body>({ url }: Props<Body>) => {
    const lagre = (body: Body) => {
        console.log('Mellomlagrer!', body);
        // return fetchJsonFraApiClientSide(url, { method: 'POST', body: JSON.stringify(body) });
    };

    return debounce(
        lagre,
        1000,
        // { leading: true, trailing: true },
    );
};
