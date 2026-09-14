import { test, expect, beforeEach, afterEach } from '@jest/globals';
import { addMapping, GenMapping, toEncodedMap } from '@jridgewell/gen-mapping';
import { mapStackTrace } from './sourceMappedStack';

const BUNDLE_URL = 'https://cdn.nav.no/tpts/static/chunks/app-abc123.js';

const lagSourceMap = () => {
    const gen = new GenMapping({ file: 'app-abc123.js' });
    addMapping(gen, {
        generated: { line: 1, column: 1234 },
        original: { line: 10, column: 8 },
        source: 'turbopack:///[project]/src/utils/__stack-test-util.ts',
        name: 'indreUtil',
    });
    addMapping(gen, {
        generated: { line: 5, column: 100 },
        original: { line: 42, column: 4 },
        source: 'webpack://tiltakspenger/./src/pages/sak/[saksnummer]/index.tsx',
    });
    return toEncodedMap(gen);
};

const originalFetch = global.fetch;

const MAP_URL = 'https://cdn.nav.no/tpts/static/chunks/app-def456.js.map';

beforeEach(() => {
    global.fetch = async (input) => {
        if (input === BUNDLE_URL) {
            return new Response(`minifiedJs();\n//# sourceMappingURL=app-def456.js.map`, {
                status: 200,
            });
        }
        if (String(input) === MAP_URL) {
            return new Response(JSON.stringify(lagSourceMap()), { status: 200 });
        }
        return new Response('Not found', { status: 404 });
    };
});

afterEach(() => {
    global.fetch = originalFetch;
});

test('mapper V8-stack tilbake til original kilde via sourcemap', async () => {
    const stack = [
        'Error: Noe gikk galt',
        `    at minifiedFn (${BUNDLE_URL}:1:1234)`,
        `    at ${BUNDLE_URL}:5:100`,
    ].join('\n');

    const mappet = await mapStackTrace(stack);

    expect(mappet.split('\n')).toEqual([
        'Error: Noe gikk galt',
        '    at indreUtil (src/utils/__stack-test-util.ts:10:8)',
        '    at src/pages/sak/[saksnummer]/index.tsx:42:4',
    ]);
});

test('mapper Gecko/Safari-stack tilbake til original kilde', async () => {
    const stack = [`minifiedFn@${BUNDLE_URL}:1:1234`].join('\n');

    const mappet = await mapStackTrace(stack);

    expect(mappet).toBe('    at indreUtil (src/utils/__stack-test-util.ts:10:8)');
});

test('beholder rammen uendret når sourcemap ikke finnes', async () => {
    const linje = '    at noe (https://cdn.nav.no/uten-map.js:9:9)';

    expect(await mapStackTrace(linje)).toBe(linje);
});

test('støtter inline data-uri sourcemaps', async () => {
    const dataUri = `data:application/json;base64,${Buffer.from(JSON.stringify(lagSourceMap())).toString('base64')}`;
    global.fetch = async () =>
        new Response(`minifiedJs();\n//# sourceMappingURL=${dataUri}`, { status: 200 });

    const stack = '    at minifiedFn (https://cdn.nav.no/data-uri-bundle.js:1:1234)';

    expect(await mapStackTrace(stack)).toBe(
        '    at indreUtil (src/utils/__stack-test-util.ts:10:8)',
    );
});

test('beholder rammen uendret når bundlen mangler sourceMappingURL-kommentar', async () => {
    global.fetch = async () => new Response('minifiedJs();', { status: 200 });

    const linje = '    at noe (https://cdn.nav.no/uten-map-ref.js:9:9)';

    expect(await mapStackTrace(linje)).toBe(linje);
});

test('beholder stacken uendret når fetch feiler', async () => {
    global.fetch = async () => {
        throw new Error('nettverksfeil');
    };

    // Unik url — modulet cacher consumers per url på tvers av testene
    const stack =
        'Error: Noe gikk galt\n    at minifiedFn (https://cdn.nav.no/fetch-feiler.js:1:1234)';

    expect(await mapStackTrace(stack)).toBe(stack);
});

test('lar linjer som ikke er stack-rammer passere uendret', async () => {
    const stack = 'Error: Noe gikk galt';

    expect(await mapStackTrace(stack)).toBe(stack);
});
