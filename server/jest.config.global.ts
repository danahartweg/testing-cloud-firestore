import * as fs from 'fs';
import * as util from 'util';

const readFile = util.promisify(fs.readFile);

/**
 * The emulator host only needs to be set once before the test runner starts.
 * Doing so globally will prevent the filesystem from being accessed
 * (at least with regard to pulling the configuration) repeatedly.
 */
export default async function globalJestSetup() {
  const configFile = await readFile('./firebase.json');
  const config = JSON.parse(configFile.toString());

  const { host, port } = config.emulators.firestore;
  process.env.FIRESTORE_EMULATOR_HOST = `${host}:${port}`;
}
