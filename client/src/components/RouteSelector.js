// client/src/components/RouteSelector.js
import React, { useState } from 'react'; // useStateをインポート

// 親コンポーネントから onSearch という関数を受け取る
function RouteSelector({ onSearch }) {
  // 状態変数を使って入力フィールドの値を管理
  const [origin, setOrigin] = useState(''); // 出発地
  const [destination, setDestination] = useState(''); // 目的地
  const [vehicleType, setVehicleType] = useState('compact'); // 車種 (初期値はコンパクトカー)

  // ルート検索ボタンがクリックされた時のハンドラ
  const handleSearch = () => {
    // 親コンポーネントに検索情報を渡す
    if (onSearch) {
      onSearch(origin, destination, vehicleType);
    }
  };

  return (
    <div className="route-selector-container" style={{
      padding: '20px',
      margin: '20px',
      border: '1px solid #eee',
      borderRadius: '8px',
      maxWidth: '500px',
      width: '100%',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <h2 style={{ fontSize: '1.5em', marginBottom: '15px', color: '#333', textAlign: 'center' }}>車両選択とルート検索</h2>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="vehicleType" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>車種を選択:</label>
        <select
          id="vehicleType"
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', appearance: 'none', background: 'white url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13.2-6.4H18.6c-5%200-9.3%203.3-11.4%207.7-2%204.4-1.2%209.5%202.4%2013.1l139.2%20139.2c2.8%202.8%206.5%204.4%2010.3%204.4s7.5-1.6%2010.3-4.4l139.2-139.2c3.6-3.6%204.3-8.7%202.3-13.1z%22%2F%3E%3C%2Fsvg%3E") no-repeat right 10px center', backgroundSize: '12px', cursor: 'pointer' }}
          value={vehicleType} // 状態変数と連結
          onChange={(e) => setVehicleType(e.target.value)} // 変更時に状態を更新
        >
          <option value="compact">コンパクトカー</option>
          <option value="large">大型車（SUV/ミニバン）</option>
          <option value="commercial">商用車（トラック）</option>
        </select>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="origin" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>出発地:</label>
        <input
          type="text"
          id="origin"
          placeholder="例: 宇都宮駅"
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          value={origin} // 状態変数と連結
          onChange={(e) => setOrigin(e.target.value)} // 変更時に状態を更新
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="destination" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>目的地:</label>
        <input
          type="text"
          id="destination"
          placeholder="例: 栃木県庁"
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          value={destination} // 状態変数と連結
          onChange={(e) => setDestination(e.target.value)} // 変更時に状態を更新
        />
      </div>

      <button
        style={{
          width: '100%',
          padding: '12px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '1.1em',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease, transform 0.1s ease',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
        onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(1px)'}
        onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        onClick={handleSearch} // ボタンクリック時にhandleSearch関数を実行
      >
        ルート検索
      </button>
    </div>
  );
}

export default RouteSelector;