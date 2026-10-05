import fs from 'node:fs/promises';
export async function resolve(specifier,context,next){if(specifier==='three')return {url:new URL('../dist/vendor/three.js',import.meta.url).href,shortCircuit:true};return next(specifier,context);}
export async function load(url,context,next){if(url.endsWith('/dist/vendor/three.js'))return{format:'module',source:await fs.readFile(new URL(url),'utf8'),shortCircuit:true};return next(url,context);}
