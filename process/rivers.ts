import { unZipFromFile, removeFile, readJSON, writeJSON } from 'https://deno.land/x/flat/mod.ts'
import { wharfeArea } from './extents.ts';
import { convertToWGS84, cropToBbox } from './util/geojson/index.ts';

// The filename is the first invocation argument
const filename: string = Deno.args[0] // Same name as downloaded_filename

await unZipFromFile(
  filename,
  "./temp",
  { includeFileName: true },
);

const riversJson = convertToWGS84(await readJSON('temp/rivers/data/Statutory_Main_River_Map.json'));

await writeJSON('data/wharfe/rivers.json', cropToBbox(riversJson, wharfeArea));

await removeFile(filename);