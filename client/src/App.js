// client/src/App.js
import React, { useState } from 'react';
// './App.css' はCreate React Appが自動生成するCSSで、今回はGlobal.cssに移行するため、コメントアウトまたは削除してください。
// import './App.css';
import MapDisplay from './components/MapDisplay'; // MapDisplayコンポーネントをインポート
import RouteSelector from './components/RouteSelector'; // RouteSelectorコンポーネントをインポート
import './styles/Global.css'; // 全体的なスタイルをインポート

function App() {
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    vehicleType: 'compact',
  });

  const handleSearchRoutes = (origin, destination, vehicleType) => {
    console.log('検索リクエスト:', { origin, destination, vehicleType });
    setSearchParams({ origin, destination, vehicleType });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>NAVee - 安全ルートナビゲーション</h1>
      </header>
      <main>
        <RouteSelector onSearch={handleSearchRoutes} />
        <MapDisplay searchParams={searchParams} />
      </main>
    </div>
  );
}

export default App;
