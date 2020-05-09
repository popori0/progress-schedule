'use strict';
// htmlファイルのinput要素のid属性値を指定して変数に代入
const outputButton = document.getElementById('output');
const resultDivided = document.getElementById('result-area');
const tableDivided = document.getElementById('table-area')
const startDateInput = document.getElementById('start-date')
const endDateInput = document.getElementById('end-date')
const startPageInput = document.getElementById('start-page')
const endPageInput = document.getElementById('end-page')
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
    const resulttext = document.createElement('p')
    resulttext.innerText = `開始日付から終了日付まで${result.date}日間あります。\n開始ページから終了ページまで${result.page}ページあります。\n1日あたり${result.ppd}ページ、または1週間あたり${result.ppw}ページ進めると終わります。`
    resultDivided.appendChild(resulttext);

    // テーブルエリアの作成
    removeAllChildren(tableDivided);
    const haderTable = document.createElement('h3');
    haderTable.innerText = 'スケジュール表'
    tableDivided.appendChild(haderTable);
    const table = createTable(10, 8);               // 第１引数で行数、第２引数で列数
    table.border = "2";                             // ボーダーの幅
    tableDivided.appendChild(table);
};

/**
 * 残りの日付、ページ数、1日あたりのページ進行を求める
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
        ppd: pagePerDate,        // 1日あたりの進行ページ数
        ppw: pagePerWeek
    }
    return result;
}
// 表の作成
function createTable(row, col) {
    let table = document.createElement('table');
    // tr(行の作成)
    for (let i = 0; i <= row; i++) {
        let tableRow = document.createElement('tr');
        // td(列の作成)
        for (let j = 0; j < col; j++) {
            if (i === 0) {
                let tableHead = document.createElement('th');
                tableHead.textContent = 'Title'
                tableRow.appendChild(tableHead);
            } else {
            let tableCol = document.createElement('td');
            if (j === 0) {
                tableCol.textContent = 'Unit' + i;
                tableRow.appendChild(tableCol);
            } else {
                tableCol.textContent = 'Test' + i + '.' + j;
                tableRow.appendChild(tableCol);
            }
        }
        }
        table.appendChild(tableRow);
    }
    return table;
}
