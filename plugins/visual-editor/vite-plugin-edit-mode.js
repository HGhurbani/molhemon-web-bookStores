import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { EDIT_MODE_STYLES } from './visual-editor-config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

export default function inlineEditDevPlugin() {
  return {
    name: 'vite:inline-edit-dev',
    apply: 'serve',
    transformIndexHtml() {
      const scriptPath = resolve(__dirname, 'edit-mode-script.js');
      let scriptContent = readFileSync(scriptPath, 'utf-8');

      const configPath = resolve(__dirname, 'visual-editor-config.js');
      let configContent = readFileSync(configPath, 'utf-8');

      configContent = configContent.replace(/export\s+/g, '');
      scriptContent = scriptContent.replace(/^.*import[^\n]*visual-editor-config[^\n]*\n/m, '');

      const combinedContent = `${configContent}\n${scriptContent}`;

      return [
        {
          tag: 'script',
          attrs: { type: 'module' },
          children: combinedContent,
          injectTo: 'body'
        },
        {
          tag: 'style',
          children: EDIT_MODE_STYLES,
          injectTo: 'head'
        }
      ];
    }
  };
}
