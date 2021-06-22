import { unZipFromFile, removeFile } from 'https://deno.land/x/flat/mod.ts'

// The filename is the first invocation argument
const filename: string = Deno.args[0] // Same name as downloaded_filename

await unZipFromFile(
  filename,
  "./data",
  { includeFileName: true },
);

await removeFile(filename);