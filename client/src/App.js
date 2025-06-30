// client/src/App.js
import React, { useState, useCallback } from 'react';
import MapDisplay from './components/MapDisplay';
import RouteSelector from './components/RouteSelector';
import './styles/Global.css';

function App() {
  const [searchState, setSearchState] = useState({
    origin: '',
    destination: '',
    vehicleType: 'compact',
    filters: null,
    // 検索が実行されたことを管理するキー。ボタンを押すたびに+1される
    searchKey: 0, 
  });

  // 検索ボタンが押されたときに呼び出される関数
  const handleSearchRoutes = useCallback((origin, destination, vehicleType, selectedFilters) => {
    // Stateを更新し、searchKeyをインクリメントしてMapDisplayに再検索をトリガーさせる
    setSearchState(prevState => ({
      origin,
      destination,
      vehicleType,
      filters: selectedFilters,
      searchKey: prevState.searchKey + 1,
    }));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>NAVee</h1>
        <p className="header-subtitle">AI安全ルートナビゲーション</p>
      </header>
      <main>
        <div className="content-container">
          <RouteSelector onSearch={handleSearchRoutes} />
        </div>
        <div className="content-container">
          <MapDisplay 
            searchKey={searchState.searchKey}
            searchParams={{ origin: searchState.origin, destination: searchState.destination }} 
            filters={searchState.filters} 
          />
        </div>
      </main>
    </div>
  );
}

export default App;