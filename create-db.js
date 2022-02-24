import { connect, init, sync, close } from './models.js';

await connect();
init();
await sync();
await close();
