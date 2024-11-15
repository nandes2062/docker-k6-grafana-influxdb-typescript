const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const GlobEntries = require('webpack-glob-entries');
const fs = require('fs');

class GenerateShellScriptsPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('GenerateShellScriptsPlugin', (compilation, callback) => {
      const outputPath = compilation.outputOptions.path;
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
      }

      Object.keys(compilation.assets).forEach((filename) => {
        const baseName = filename.replace(/\.js$/, '');
        const extension = filename.split('.').pop();
        if (extension === 'js') {
          const shellScriptPath = path.join(compilation.outputOptions.path, `${baseName}.sh`);
          const shellScriptContent = `#!/bin/bash
docker compose up -d influxdb grafana
echo "-----------------------------------------------------------------------------------------"
echo "Pruebas de carga con Grafana dashboard http://localhost:3000/d/k6/k6-load-testing-results"
echo "-----------------------------------------------------------------------------------------"
docker compose run --rm k6 run /scripts/${filename}
`;
          const powershellScriptPath = path.join(compilation.outputOptions.path, `${baseName}.ps1`);
          const powershellScriptContent = `docker compose up -d influxdb grafana
Write-Output "-----------------------------------------------------------------------------------------"
Write-Output "Pruebas de carga con Grafana dashboard http://localhost:3000/d/k6/k6-load-testing-results"
Write-Output "-----------------------------------------------------------------------------------------"
docker compose run --rm k6 run /scripts/${filename}
`;
          fs.writeFileSync(shellScriptPath, shellScriptContent, 'utf8');
          fs.chmodSync(shellScriptPath, '755');
          fs.writeFileSync(powershellScriptPath, powershellScriptContent, 'utf8');
        }
      });

      callback();
    });
  }
}

module.exports = {
  mode: 'production',
  entry: GlobEntries('./src/*test*.ts'),
  output: {
    path: path.join(__dirname, 'scripts'),
    libraryTarget: 'commonjs',
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  target: 'web',
  externals: /^(k6|https?\:\/\/)(\/.*)?/,
  // Generate map files for compiled scripts
  // devtool: "source-map",
  stats: {
    colors: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [{ 
        from: path.resolve(__dirname, 'assets'), 
        noErrorOnMissing: true 
      }],
    }),
    new GenerateShellScriptsPlugin(),
  ],
  optimization: {
    minimize: false,
  },
};
