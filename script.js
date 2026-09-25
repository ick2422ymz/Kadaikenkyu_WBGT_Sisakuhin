 <script>
        // HTML内の各要素を取得
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

        // WBGTを計算する関数 (Stullの近似式)
        function calculateWBGT(T, RH) {
            const term1 = T * Math.atan(0.151977 * Math.pow(RH + 8.313659, 0.5));
            const term2 = Math.atan(T + RH);
            const term3 = - Math.atan(RH - 1.676331);
            const term4 = 0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH);
            const term5 = - 4.686035;
            
            const Tw = term1 + term2 + term3 + term4 + term5;
            const WBGT = 0.7 * Tw + 0.3 * T;
            
            // 小数点第1位で四捨五入
            return Math.round(WBGT * 10) / 10;
        }

        // 画面の表示と判定を更新するメイン処理
        function updateSimulator() {
            // 安全装置: 異常な数値にならないように制限
            if (currentTemp > 60) currentTemp = 60;
            if (currentTemp < -20) currentTemp = -20;
            if (currentHum > 100) currentHum = 100;
            if (currentHum < 0) currentHum = 0;

            // 画面の温度・湿度表示を更新
            tempDisplay.innerText = currentTemp.toFixed(1);
            humDisplay.innerText = currentHum.toFixed(1);
            
            // WBGTを計算して表示
            const wbgt = calculateWBGT(currentTemp, currentHum);
            wbgtDisplay.innerText = wbgt.toFixed(1);
            
            // LEDをすべて消灯
            ledGreen.classList.remove('on');
            ledYellow.classList.remove('on');
            ledRed.classList.remove('on');
            
            // WBGT値に基づいた判定とLEDの点灯
            if (wbgt < 21.0) {
                ledGreen.classList.add('on');
                statusText.innerText = "ほぼ安全";
                statusText.style.color = "#27ae60"; 
            } else if (wbgt < 28.0) {
                ledYellow.classList.add('on');
                statusText.innerText = "注意";
                statusText.style.color = "#f39c12"; 
            } else {
                ledRed.classList.add('on');
                statusText.innerText = "慢心せずに暑さに気をつけて";
                statusText.style.color = "#c0392b"; 
            }
        }

        // 温度ボタンが押されたときの処理
        function changeTemp(amount) {
            currentTemp += amount;
            // 小数点の計算誤差を防ぐ処理
            currentTemp = Math.round(currentTemp * 10) / 10;
            updateSimulator(); 
        }

        // 湿度ボタンが押されたときの処理
        function changeHum(amount) {
            currentHum += amount;
            // 小数点の計算誤差を防ぐ処理
            currentHum = Math.round(currentHum * 10) / 10;
            updateSimulator(); 
        }

        // ページ読み込み時に初期状態を表示
        updateSimulator();
    </script>
