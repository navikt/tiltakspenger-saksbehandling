import React from 'react';
import { Heading } from '@navikt/ds-react';
import { KommunaleYtelser } from '../../types/Søknad';
import KvpTable from '../kvp-table/KvpTable';
import styles from './KommunaleYtelserContent.module.css';
import IntroTable from '../intro-table/IntroTable';

interface KommunaleYtelserContentProps {
    kommunaleYtelser: KommunaleYtelser;
}

const KommunaleYtelserContent = ({ kommunaleYtelser }: KommunaleYtelserContentProps) => {
    const { introProgrammet, kvp } = kommunaleYtelser;
    return (
        <div>
            <span>Foreløpig har vi ikke alle opplysninger</span>
            <Heading className={styles.kvpHeading} level="1" size="xsmall">
                Kvalifiseringsprogrammet
            </Heading>
            <KvpTable vilkårsvurderinger={kvp} />
            <Heading className={styles.introHeading} level="1" size="xsmall">
                Introduksjonsprogrammet
            </Heading>
            <IntroTable vilkårsvurderinger={introProgrammet} />
        </div>
    );
};

export default KommunaleYtelserContent;
