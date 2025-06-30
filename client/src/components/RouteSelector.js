// client/src/components/RouteSelector.js
import React, { useState } from 'react';
import '../styles/RouteSelector.css';

const years = [2025, 2024, 2023];
const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const timeSlots = ['0-6', '6-12', '12-18', '18-24'];

function RouteSelector({ onSearch }) {
  const [origin, setOrigin] = useState('宇都宮駅');
  const [destination, setDestination] = useState('栃木県庁');
  const [vehicleType, setVehicleType] = useState('compact');
  
  const [dateFilters, setDateFilters] = useState(() => {
    const initialState = {};
    years.forEach(year => {
      initialState[year] = { all: true };
      months.forEach(month => {
        initialState[year][month] = true;
      });
    });
    return initialState;
  });

  const [timeFilters, setTimeFilters] = useState({
    '0-6': true, '6-12': true, '12-18': true, '18-24': true,
  });

  const handleDateChange = (year, month) => {
    setDateFilters(prev => {
      const newFilters = JSON.parse(JSON.stringify(prev));
      if (month === 'all') {
        const isChecked = !newFilters[year].all;
        newFilters[year].all = isChecked;
        months.forEach(m => { newFilters[year][m] = isChecked; });
      } else {
        newFilters[year][month] = !newFilters[year][month];
        newFilters[year].all = months.every(m => newFilters[year][m]);
      }
      return newFilters;
    });
  };

  const handleTimeChange = (slot) => {
    setTimeFilters(prev => ({ ...prev, [slot]: !prev[slot] }));
  };

  const handleSearch = () => {
    if (onSearch && origin && destination) {
      onSearch(origin, destination, vehicleType, { dates: dateFilters, times: timeFilters });
    } else {
      alert('出発地と目的地を入力してください。');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="route-selector-container">
      <h2>車両選択とルート検索</h2>
      <div className="input-group">
        <label htmlFor="vehicleType">車種を選択:</label>
        <select id="vehicleType" className="select-box" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
          <option value="compact">コンパクトカー</option>
          <option value="large">大型車（SUV/ミニバン）</option>
          <option value="commercial">商用車（トラック）</option>
        </select>
      </div>
      <div className="input-group">
        <label htmlFor="origin">出発地:</label>
        <input type="text" id="origin" value={origin} onChange={e => setOrigin(e.target.value)} onKeyPress={handleKeyPress} placeholder="例: 宇都宮駅" className="text-input" />
      </div>
      <div className="input-group">
        <label htmlFor="destination">目的地:</label>
        <input type="text" id="destination" value={destination} onChange={e => setDestination(e.target.value)} onKeyPress={handleKeyPress} placeholder="例: 栃木県庁" className="text-input" />
      </div>
      <button onClick={handleSearch} className="search-button">安全ルートを検索</button>
      
      <details className="filter-details" open>
        <summary>事故データのフィルター</summary>
        <div className="filter-section">
          <h4>時間帯</h4>
          <div className="filter-grid time-grid">
            {timeSlots.map(slot => (
              <label key={slot}>
                <input type="checkbox" checked={timeFilters[slot]} onChange={() => handleTimeChange(slot)} />
                {slot.replace('-', '時～')}時
              </label>
            ))}
          </div>
        </div>
        <div className="filter-section">
          <h4>年月</h4>
          {years.map(year => (
            <div key={year} className="year-group">
              <h5>
                <label>
                  <input type="checkbox" checked={dateFilters[year].all} onChange={() => handleDateChange(year, 'all')} />
                  {year}年
                </label>
              </h5>
              <div className="filter-grid month-grid">
                {months.map(month => (
                  <label key={`${year}-${month}`}>
                    <input type="checkbox" checked={!!dateFilters[year][month]} onChange={() => handleDateChange(year, month)} />
                    {month}月
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
export default RouteSelector;