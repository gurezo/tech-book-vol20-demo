import NPIX from '@chirimen/neopixel-i2c';
import { requestGPIOAccess } from './node_modules/node-web-gpio/dist/index.js';
import { requestI2CAccess } from './node_modules/node-web-i2c/index.js';
const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec));

async function blink() {
  const gpioAccess = await requestGPIOAccess(); // GPIO を操作する
  const port = gpioAccess.ports.get(26); // 26 番ポートを操作する

  await port.export('out'); // ポートを出力モードに設定

  // 無限ループ
  for (;;) {
    // 1秒間隔で LED が点滅します
    await port.write(1); // LEDを点灯
    await sleep(1000); // 1000 ms (1秒) 待機
    await port.write(0); // LEDを消灯
    await sleep(1000); // 1000 ms (1秒) 待機
  }
}

const neoPixels = 7; // LEDå€‹æ•°

main();

async function main() {
  const i2cAccess = await requestI2CAccess();
  const port = i2cAccess.ports.get(1);
  const npix = new NPIX(port, 0x41);
  await npix.init(neoPixels);

  await nPixTest1(npix);

  await nPixTest2(npix);

  await nPixTest3(npix, pattern4);

  await npix.setGlobal(0, 0, 0);

  await blink();
}

async function nPixTest1(npix) {
  // å…¨LEDã‚’åŒã˜è‰²ã«ã™ã‚‹ã‚±ãƒ¼ã‚¹
  await npix.setGlobal(10, 0, 0);
  await sleep(200);
  await npix.setGlobal(0, 10, 0);
  await sleep(200);
  await npix.setGlobal(0, 0, 10);
  await sleep(200);
  await npix.setGlobal(0, 20, 20);
  await sleep(200);
  await npix.setGlobal(20, 0, 20);
  await sleep(200);
  await npix.setGlobal(20, 20, 0);
  await sleep(200);
  await npix.setGlobal(20, 20, 20);
  await sleep(200);
  await npix.setGlobal(0, 0, 0);
}

// ãƒ‘ã‚¿ãƒ¼ãƒ³ã¯RRGGBB ã®ä¸¦ã³ã§
const pattern0 = [
  0xff0000, 0x00ff00, 0x0000ff, 0xff0000, 0x00ff00, 0x0000ff, 0xff0000,
];
const pattern1 = [
  0x000000, 0x00ff00, 0x0000ff, 0xff0000, 0x00ff00, 0x0000ff, 0xff0000,
];
const pattern2 = [
  0x000000, 0x000000, 0x0000ff, 0xff0000, 0x00ff00, 0x0000ff, 0xff0000,
];
const pattern3 = [
  0x000000, 0x000000, 0x000000, 0xff0000, 0x00ff00, 0x0000ff, 0xff0000,
];
const pattern4 = [
  0x000000, 0x000000, 0x000000, 0x000000, 0x00ff00, 0x0000ff, 0xff0000,
];
const pattern5 = [
  0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x0000ff, 0xff0000,
];
const pattern6 = [
  0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0xff0000,
];
const pattern7 = [
  0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
];

async function setPattern(npix, pattern) {
  // ãƒ‘ã‚¿ãƒ¼ãƒ³è¨­å®š
  const grbArray = [];
  for (const color of pattern) {
    const r = (color >> 16) & 0xff;
    const g = (color >> 8) & 0xff;
    const b = color & 0xff;
    grbArray.push(g);
    grbArray.push(r);
    grbArray.push(b);
  }
  await npix.setPixels(grbArray);
}

async function nPixTest2(npix) {
  // ãƒ‘ã‚¿ãƒ¼ãƒ³ã‚’å¤‰åŒ–ã•ã›ã‚‹
  await setPattern(npix, pattern0);
  await sleep(200);
  await setPattern(npix, pattern1);
  await sleep(200);
  await setPattern(npix, pattern2);
  await sleep(200);
  await setPattern(npix, pattern3);
  await sleep(200);
  await setPattern(npix, pattern4);
  await sleep(200);
  await setPattern(npix, pattern5);
  await sleep(200);
  await setPattern(npix, pattern6);
  await sleep(200);
  await setPattern(npix, pattern7);
}

async function nPixTest3(npix, pattern) {
  // ãƒ‘ã‚¿ãƒ¼ãƒ³ã‚’æµã™
  for (let i = 0; i < 30; i++) {
    const p = i % pattern.length;
    const spattern = [];
    for (let px = 0; px < pattern.length; px++) {
      const pp = (i + px) % pattern.length;
      spattern.push(pattern[pp]);
    }
    console.log(spattern);
    await setPattern(npix, spattern);
    await sleep(200);
  }
}
