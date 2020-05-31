'use strict';
// htmlファイルのinput要素のid属性値を指定して変数に代入
const outputButton = document.getElementById('output');
const resultDivided = document.getElementById('result-area');
const tableDivided = document.getElementById('table-area')
const startDateInput = document.getElementById('start-date')
const endDateInput = document.getElementById('end-date')
const startPageInput = document.getElementById('start-page')
const endPageInput = document.getElementById('end-page')
const lapNumberInput = document.getElementById('lap-number')
/**
 * 指定した要素の子どもを全て削除する
 * @param {HTMLElement} element HTMLの要素
 */
function removeAllChildren(element) {
    while (element.firstChild) {
        //子どもの要素があるかぎり削除
        element.removeChild(element.firstChild);
    }
}

var textbook = { "テキスト選択": "tmp",
                "中1英語": {"UNIT1": [1, 10], "UNIT2": [11, 22], "UNIT3": [23, 35]}, 
                "中2英語": {"UNIT1": [1, 8], "UNIT2": [9, 15], "UNIT3": [16, 22]}, 
                "中3英語": {"UNIT1": [1, 4], "UNIT2": [5, 8], "UNIT3": [9, 13], "UNIT4": [14, 20]}};

window.onload=function(){
    for (var key in textbook) {
    var op = document.createElement("option");
    op.value = key;
    op.text = key;
    document.getElementById("selPref").appendChild(op);
  }
}

/*
function mapOut(map, eleId) {
    removeAllChildren(eleId);
    for (let key in map) {
        let op = document.createElement("option");
        op.value = map[key];
        op.text = key;
        eleID.appendChild(op);
    }
}
*/
function selPref(obj){
    var selObj = document.getElementById('selCity');
    var selObj2 = document.getElementById('selCity2');
    removeAllChildren(selObj);
    removeAllChildren(selObj2);
    for (let key in textbook[obj.value]) {
        let op = document.createElement("option");
        op.value = textbook[obj.value][key];
        op.text = key;
        selObj.appendChild(op);
    }
    for (let key in textbook[obj.value]) {
        let op = document.createElement("option");
        op.value = textbook[obj.value][key];
        op.text = key;
        selObj2.appendChild(op);
    }
}
function selCity(obj) {
    startPageInput.value = parseInt(obj.value.split(',')[0]);
}

function selCity2(obj) {
    endPageInput.value = parseInt(obj.value.split(',')[1]);
}

// HTMLの出力ボタンを押すと動作する
outputButton.onclick = () => {
    //if (userName.length === 0) {
    // TODO 名前が空の時は処理を終了する
    //    return;
    //}

    // 出力結果表示エリアの作成
    removeAllChildren(resultDivided);
    const headerResult = document.createElement('h3');
    headerResult.innerText = '出力結果';
    resultDivided.appendChild(headerResult);

    const result = studyPageDate(startDateInput.value, endDateInput.value, startPageInput.value, endPageInput.value)
    const resultLap = lapIntervalDate(result.date, lapNumberInput.value)
    const resulttext = document.createElement('p')
    resulttext.innerText = `開始日付から終了日付まで${result.date}日間あります。\n開始ページから終了ページまで${result.page}ページあります。\n1日あたり${result.ppd}ページ、または1週間あたり${result.ppw}ページ進めると終わります。`
    resultDivided.appendChild(resulttext);

    // テーブルエリアの作成
    removeAllChildren(tableDivided);
    tableInsertRow(tableDivided, ['周回数', '開始日付', '終了日付']);
    let tmp = createSchedule(startDateInput.value, resultLap)
    for (let i = 0; i < tmp.length; i++) {
        tableInsertRow(tableDivided, tmp[i]);
    }
};

/**
 * 残りの日付、ページ数、1日または1週間あたりのページ進行を求める
 * @param {String} sd   開始日付
 * @param {String} ed   終了日付
 * @param {Number} sp   開始ページ
 * @param {Number} ep   終了ページ
 */
function studyPageDate(sd, ed, sp, ep) {
    let date = {
        start: new Date(sd),    // 開始日付をStringからDateに
        end: new Date(ed)       // 終了日付をStringからDateに
    };
    let text = {
        start: sp,              // 開始ページ
        end: ep                 // 終了ページ
    };
    let ms = date.end.getTime() - date.start.getTime();                 // 残り時間（ミリ秒）を求める
    let remainingDate = Math.floor(ms / (1000 * 60 * 60 * 24) + 1);     // 残り時間をミリ秒から日へ
    let remainingPage = text.end - text.start + 1;                      // 残りのページ数
    let pagePerDate = (remainingPage / remainingDate).toFixed(2);       // 1日あたりの進行ページ数(小数第２位まで)
    let pagePerWeek = (remainingPage * 7 / remainingDate).toFixed(2);
    // 戻り値
    let result = {
        date: remainingDate,    // 残り時間（日）
        page: remainingPage,    // 残りページ数
        ppd: pagePerDate,       // 1日あたりの進行ページ数
        ppw: pagePerWeek        // 1週間あたりの進行ページ数
    }
    return result;
}

function lapIntervalDate(rd, ln) {
    let lapinterval = [];
    let count = 0;
    for (let i = 0; i <= ln; i++) {
        lapinterval.push(Math.round(count));
        count += rd / ln;
    }
    return lapinterval;
}

/**
 * tableと配列を渡し、tableの末尾の行に配列の要素を入力する
 * @param {Object} table    // HTMLのtableタグ  
 * @param {Array} array     // tableタグで囲まれるtrタグで出力する文字列が入った配列
 */
function tableInsertRow(table, array) {
    let row = table.insertRow(-1);              // tableの末尾に行を追加
    for (let i = 0; i < array.length; i++) {    // 配列の要素数だけループ
        let cell = row.insertCell(-1);          // 追加した行の末尾にセルを追加
        cell.innerHTML = array[i];              // 追加したセルに配列の文字列を入力
    }
}

/**
 * 
 * @param {String} startDate            // 開始日付
 * @param {Array} intervalArray         // 周回の間隔日数
 */
function createSchedule(startDate, intervalArray) {
    let resultArray = [];
    let date = moment(startDate)

    for (let i = 0; i < intervalArray.length - 1; i++) {
        let rowsArray = [];
        rowsArray.push((i + 1).toString());
        rowsArray.push(date.clone().add('days', intervalArray[i]).format('MM/DD'));
        rowsArray.push(date.clone().add('days', intervalArray[i + 1] - 1).format('MM/DD'));
        resultArray.push(rowsArray);
    }
    return resultArray;
}