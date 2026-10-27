/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
// Use lossless PNG frames instead of JPEG to eliminate chroma subsampling blur on #E8402A red text & halftone dots
Config.setVideoImageFormat("png");
Config.setCodec("h264");
Config.setCrf(16);
Config.setPixelFormat("yuv420p");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);
