import React from 'react';
import type { NextPage } from 'next';
import { pageWithAuthentication } from '../utils/pageWithAuthentication';

const HomePage: NextPage = () => {
    return (
        <div style={{ paddingLeft: '1rem' }}>
            <p>Start med å søke opp en person i søkefeltet.</p>
        </div>
    );
};

export default HomePage;

export const getServerSideProps = pageWithAuthentication();
