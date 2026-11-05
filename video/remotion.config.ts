import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(94);
Config.setOverwriteOutput(true);
// En el entorno de render en la nube se usa el Chromium preinstalado; en Windows no hace falta.
if (process.env.REMOTION_BROWSER) Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
