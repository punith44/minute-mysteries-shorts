import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadInstrumentSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";

const spaceGroteskInfo = loadSpaceGrotesk("normal", {
  weights: ["500", "600", "700"],
  subsets: ["latin"],
  ignoreTooManyRequestsWarning: true,
});
const instrumentSerifInfo = loadInstrumentSerif("italic", {
  weights: ["400"],
  subsets: ["latin"],
  ignoreTooManyRequestsWarning: true,
});
const jetBrainsMonoInfo = loadJetBrainsMono("normal", {
  weights: ["500", "600", "700"],
  subsets: ["latin"],
  ignoreTooManyRequestsWarning: true,
});
const montserratInfo = loadMontserrat("normal", {
  weights: ["800", "900"],
  subsets: ["latin"],
  ignoreTooManyRequestsWarning: true,
});

export const FONTS = {
  sans: spaceGroteskInfo.fontFamily,      // Geometric technical sans
  display: montserratInfo.fontFamily,     // High-impact Montserrat Black for 1-3 word active captions
  serif: instrumentSerifInfo.fontFamily,  // Editorial italic punch
  mono: jetBrainsMonoInfo.fontFamily,     // Monospace technical tags
};
