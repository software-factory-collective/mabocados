// @ts-check
import { defineConfig } from 'astro/config';


import analogjsangular from '@analogjs/astro-angular';


import tailwind from '@astrojs/tailwind';


// https://astro.build/config
export default defineConfig({
  integrations: [analogjsangular(), tailwind()]
});