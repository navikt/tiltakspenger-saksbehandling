import { BehandlingEllerSøknadForOversiktData } from '../../types/BehandlingTypes';

// Gruppperer behandlinger/søknader på fnr, og sorterer gruppene på eldste timestamp (kravtidspunkt eller opprettet tidspunkt)
export const sorterBenkoversikt = (
    søknaderOgBehandlinger: BehandlingEllerSøknadForOversiktData[],
    stigende: boolean,
): BehandlingEllerSøknadForOversiktData[] => {
    const sortFunc = stigende ? ascSort : descSort;

    return (
        Object.values(
            Object.groupBy(søknaderOgBehandlinger, ({ fnr }) => fnr),
        ) as BehandlingEllerSøknadForOversiktData[][]
    ) // "as" fordi groupBy return er typet som Partial<T>. fnr er alltid er definert så values her er aldri undefined
        .toSorted((behandlingerForFnrA, behandlingerForFnrB) =>
            sortFunc(
                finnEldsteBehandling(behandlingerForFnrA),
                finnEldsteBehandling(behandlingerForFnrB),
            ),
        )
        .flatMap((behandlinger) => behandlinger.toSorted(sortFunc));
};

const finnEldsteBehandling = (søknaderOgBehandlinger: BehandlingEllerSøknadForOversiktData[]) =>
    søknaderOgBehandlinger.toSorted(ascSort).at(-1)!;

const getTimestamp = (søknadEllerBehandling: BehandlingEllerSøknadForOversiktData) =>
    søknadEllerBehandling.kravtidspunkt ?? søknadEllerBehandling.opprettet;

const ascSort = (
    a: BehandlingEllerSøknadForOversiktData,
    b: BehandlingEllerSøknadForOversiktData,
) => (getTimestamp(a) > getTimestamp(b) ? 1 : -1);

const descSort = (
    a: BehandlingEllerSøknadForOversiktData,
    b: BehandlingEllerSøknadForOversiktData,
) => (getTimestamp(a) > getTimestamp(b) ? -1 : 1);
