export { default } from 'next/document';

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
    require('msw/node')
        .setupServer(...require('../mock/handlers').handlers)
        .listen();
}
