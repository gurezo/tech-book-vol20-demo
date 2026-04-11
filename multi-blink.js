import { requestGPIOAccess } from './node_modules/node-web-gpio/dist/index.js'; // WebGPIO を使えるようにするためのライブラリをインポート
const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec)); // sleep 関数を定義

const LED_BLINK_INTERVAL_MS = 500;

async function blink() {
  const gpioAccess = await requestGPIOAccess(); // GPIO を操作する
  const port = gpioAccess.ports.get(26); // 26 番ポートを操作する
  const port2 = gpioAccess.ports.get(13); // 13 番ポートを操作する
  const port3 = gpioAccess.ports.get(19); // 19 番ポートを操作する

  await port.export('out'); // ポートを出力モードに設定
  await port2.export('out'); // ポートを出力モードに設定
  await port3.export('out'); // ポートを出力モードに設定

  // 無限ループ
  for (;;) {
    // LED_BLINK_INTERVAL_MS 秒間隔で LED が点滅します
    await port.write(1); // LEDを点灯
    await sleep(LED_BLINK_INTERVAL_MS);
    await port.write(0); // LEDを消灯
    await sleep(LED_BLINK_INTERVAL_MS);

    await port2.write(1); // LEDを点灯
    await sleep(LED_BLINK_INTERVAL_MS);
    await port2.write(0); // LEDを消灯
    await sleep(LED_BLINK_INTERVAL_MS);

    await port3.write(1); // LEDを点灯
    await sleep(LED_BLINK_INTERVAL_MS);
    await port3.write(0); // LEDを消灯
    await sleep(LED_BLINK_INTERVAL_MS);
  }
}

blink();
