const RemovePlugin = require('remove-files-webpack-plugin');
const ReplacePlugin = require('webpack-plugin-replace');
const CopyPlugin = require('copy-webpack-plugin');
const nextconfig = require("./next.config");
const path = require('path');
const glob = require('glob');
const fs = require('fs');

module.exports = {
   mode: "production",
   entry: {
      background: path.resolve("src", "extsrc", "background.ts"),
	   content: path.resolve("src", "extsrc", "content.ts"),
	   inpage: path.resolve("src", "extsrc", "inpage.ts"),
   },
   output: {
      path: path.join(__dirname, nextconfig.distDir),
      filename: "[name].js",
   },
   resolve: {
      extensions: [".ts", ".js"],
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            loader: "ts-loader",
            exclude: /node_modules/,
         },
      ]
   },
   plugins: [
      new CopyPlugin({
         patterns: [{
            from: path.resolve(__dirname, nextconfig.distDir, "_next"),
            to: path.resolve(__dirname, nextconfig.distDir, "next")
         }]
      }),
      new RemovePlugin({
         after: {
            root: nextconfig.distDir,
            include: [
               "_next"
            ],
            log: false
         }
      }),
      {
         apply: (compiler) => {
            compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
               const htmlFiles = glob.sync(`${nextconfig.distDir}/**/*.html`);
               htmlFiles.forEach((file) => {
                  const content = fs.readFileSync(file, 'utf-8');
                  const modifiedContent = content.replace(/\/_next\//g, './next/');
                  fs.writeFileSync(file, modifiedContent, 'utf-8');
               });
               const jsFiles = glob.sync(`${nextconfig.distDir}/**/*.js`);
               jsFiles.forEach((file) => {
                  const content = fs.readFileSync(file, 'utf-8');
                  const modifiedContent = content.replace(/\/_next\//g, '/next/');
                  fs.writeFileSync(file, modifiedContent, 'utf-8');
               });
            });
         }
      }
   ]
};
