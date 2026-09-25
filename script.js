// 1. HTML内にある各部品を探して変数に格納します
const tempDisplay = document.getElementById('temp-display');
const humDisplay = document.getElementById('hum-display');
const wbgtDisplay = document.getElementById('wbgt-display');
const statusText = document.getElementById('status-text');
const ledGreen = document.getElementById('led-green');
const ledYellow = document.getElementById('led-yellow');
const ledRed = document.getElementById('led-red');

// 現在の数値を保存する変数（初期値）
let currentTemp = 25.0;
let currentHum = 50.0;

// 2. WBGTを計算する関数 (Stullの近似式を用いた湿球温度の計算とWBGTへの変換)
function calculateWBGT(T, RH) {
    // 湿球温度(Tw)の計算
    const term1 = T * Math.atan(0.151977 * Math.pow(RH + 8.313659, 0.5));
    const term2 = Math.atan(T + RH);
    const term3 = - Math.atan(RH - 1.676331);
    const term4 = 0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH);
    const term5 = - 4.686035;
    
    const Tw = term1 + term2 + term3 + term4 + term5;
    
    // 室内WBGTの計算 (自然湿球温度と黒球温度の比率を簡略化)
    const WBGT = 0.7 * Tw + 0.3 * T;
    
    // 小数点第1位で四捨五入して返す
    return Math.round(WBGT * 10) / 10;
}

// 3. 表示と判定を更新するメインプログラム
function updateSimulator() {
    // 値の範囲を制限 (異常な数値にならないようにする安全装置)
    if(currentTemp > 60) currentTemp = 60;
    if(currentTemp < -20) currentTemp = -20;
    if(currentHum > 100) currentHum = 100;
    if(currentHum < 0) currentHum = 0;

    // 画面の数値表示を更新 (toFixedで常に小数点第1位まで表示)
    tempDisplay.innerText = currentTemp.toFixed(1);
    humDisplay.innerText = currentHum.toFixed(1);
    
    // WBGTを計算して画面を更新
    const wbgt = calculateWBGT(currentTemp, currentHum);
    wbgtDisplay.innerText = wbgt.toFixed(1);
    
    // LEDの消灯 (一度すべての 'on' クラスを外す)
    ledGreen.classList.remove('on');
    ledYellow.classList.remove('on');
    ledRed.classList.remove('on');
    
    // 判定とメッセージ・LEDの更新
    if (wbgt < 21.0) {
        // 安全
        ledGreen.classList.add('on');
        statusText.innerText = "ほぼ安全";
        statusText.style.color = "var(--led-green)";
    } else if (wbgt < 28.0) {
        // 注意
        ledYellow.classList.add('on');
        statusText.innerText = "注意";
        statusText.style.color = "var(--led-yellow)";
    } else {
        // 警戒
        ledRed.classList.add('on');
        statusText.innerText = "慢心せずに暑さに気をつけて";
        statusText.style.color = "var(--led-red)";
    }
}

// 温度ボタンを押したときに実行される関数
function changeTemp(amount) {
    currentTemp += amount;
    // 浮動小数点の計算誤差を防ぐ処理 (例: 25.0 - 0.1 が 24.900000000000002 になるのを防ぐ)
    currentTemp = Math.round(currentTemp * 10) / 10;
    updateSimulator();
}

// 湿度ボタンを押したときに実行される関数
function changeHum(amount) {
    currentHum += amount;
    // 浮動小数点の計算誤差を防ぐ処理
    currentHum = Math.round(currentHum * 10) / 10;
    updateSimulator();
}

// ページを読み込んだ直後にも1回実行し、初期状態をセットする
updateSimulator();
