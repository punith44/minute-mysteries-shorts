import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadInstrumentSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";

const spaceGroteskInfo = loadSpaceGrotesk();
const instrumentSerifInfo = loadInstrumentSerif();
const jetBrainsMonoInfo = loadJetBrainsMono();

export const FONTS = {
  sans: spaceGroteskInfo.fontFamily,      // Geometric technical sans
  serif: instrumentSerifInfo.fontFamily,  // Editorial italic punch
  mono: jetBrainsMonoInfo.fontFamily,     // Monospace technical tags
};
