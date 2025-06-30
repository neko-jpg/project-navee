// client/src/data/danger-zones.js

// デモ用のベースとなる危険地点
const baseZones = [
  { name: "宮の橋交差点", location: { lat: 36.56193, lng: 139.89737 }, radius: 100 },
  { name: "川向町交差点", location: { lat: 36.55679, lng: 139.89539 }, radius: 150 },
  { name: "不動前交差点", location: { lat: 36.57321, lng: 139.88636 }, radius: 150 },
  { name: "東宿郷交差点", location: { lat: 36.55913, lng: 139.90561 }, radius: 150 },
  { name: "陽南4丁目交差点", location: { lat: 36.53697, lng: 139.87327 }, radius: 200 },
  { name: "平松町交差点", location: { lat: 36.54160, lng: 139.91499 }, radius: 150 },
];

const accidentTypes = ["追突", "右折時", "左折時", "出会い頭", "その他"];

// ランダムな整数を生成するヘルパー関数
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// ダミーデータを生成する
let generatedData = [];
baseZones.forEach((baseZone, index) => {
  // 各地点につき、10件のダミー事故データを生成
  for (let i = 0; i < 10; i++) {
    const year = getRandomInt(2023, 2025);
    // 2023年は8月以降、2025年は6月以前のデータとする
    const month = (year === 2023) ? getRandomInt(8, 12) : (year === 2025) ? getRandomInt(1, 6) : getRandomInt(1, 12);
    
    generatedData.push({
      ...baseZone,
      id: `${baseZone.name}-${index}-${i}`, // 一意のIDを追加
      year: year,
      month: month,
      hour: getRandomInt(0, 23),
      type: accidentTypes[getRandomInt(0, accidentTypes.length - 1)]
    });
  }
});

// 生成したデータをエクスポート
export const dangerZones = generatedData;

console.log(`${dangerZones.length}件のデモ用危険地点データを生成しました。`);