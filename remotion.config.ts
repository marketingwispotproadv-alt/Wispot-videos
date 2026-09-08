// See all configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli

// Note: When using the Node.JS APIs, the config file doesn't apply. Instead, pass options directly to the APIs

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
// CRF 23 no lugar do padrão (18): arquivo bem menor e sem diferença visível
// depois que as redes sociais reprocessam o vídeo
Config.setCrf(23);
Config.setOverwriteOutput(true);
Config.overrideBundlerConfig(enableTailwind);
