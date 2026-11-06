const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');

function browserCommonJs() {
  return {
    name: 'browser-commonjs',
    enforce: 'pre',
    transform(code, id) {
      const file = id.split('?')[0].replace(/\\/g, '/');
      if (!file.includes('/web/src/') || !/\.(js|jsx)$/.test(file)) return null;

      const imports = [];
      const body = [];
      for (const line of code.split('\n')) {
        let match = line.match(/^const\s+\{([^}]+)\}\s*=\s*require\((['"][^'"]+['"])\);?\s*$/);
        if (match) {
          imports.push(`import {${match[1]}} from ${match[2]};`);
          continue;
        }
        match = line.match(/^const\s+([A-Za-z_$][\w$]*)\s*=\s*require\((['"][^'"]+['"])\);?\s*$/);
        if (match) {
          imports.push(`import ${match[1]} from ${match[2]};`);
          continue;
        }
        match = line.match(/^require\((['"][^'"]+['"])\);?\s*$/);
        if (match) {
          imports.push(`import ${match[1]};`);
          continue;
        }
        match = line.match(/^module\.exports\s*=\s*\{([^}]+)\};?\s*$/);
        if (match) {
          body.push(`export {${match[1]}};`);
          continue;
        }
        match = line.match(/^module\.exports\s*=\s*([A-Za-z_$][\w$]*);?\s*$/);
        if (match) {
          body.push(`export default ${match[1]};`);
          continue;
        }
        body.push(line);
      }

      return { code: imports.concat(body).join('\n'), map: null };
    },
  };
}

module.exports = defineConfig({
  root: 'web',
  plugins: [browserCommonJs(), react()],
  publicDir: '../public',
  build: {
    outDir: '../dist/web',
    emptyOutDir: true,
  },
});
