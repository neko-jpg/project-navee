// client/src/components/VehicleTypeSelector.js
import React from 'react';
import { Car, Truck, Bus } from 'lucide-react';
import '../styles/VehicleTypeSelector.css';

const vehicleTypes = [
  {
    id: 'compact',
    name: 'コンパクトカー',
    icon: Car,
    description: '小回りが利く、燃費重視',
    features: ['狭い道OK', '駐車しやすい', '燃費良好']
  },
  {
    id: 'large',
    name: 'SUV・ミニバン',
    icon: Bus,
    description: '家族向け、安定性重視',
    features: ['高い視点', '安定走行', '荷物多数OK']
  },
  {
    id: 'commercial',
    name: '商用車・トラック',
    icon: Truck,
    description: '業務用、大型車両',
    features: ['大型車両', '重量制限注意', '高さ制限注意']
  }
];

function VehicleTypeSelector({ selectedType, onTypeChange }) {
  return (
    <div className="vehicle-selector">
      <h3>車両タイプを選択</h3>
      <div className="vehicle-grid">
        {vehicleTypes.map((vehicle) => {
          const IconComponent = vehicle.icon;
          return (
            <div
              key={vehicle.id}
              className={`vehicle-card ${selectedType === vehicle.id ? 'selected' : ''}`}
              onClick={() => onTypeChange(vehicle.id)}
            >
              <div className="vehicle-icon">
                <IconComponent size={32} />
              </div>
              <div className="vehicle-info">
                <h4>{vehicle.name}</h4>
                <p className="vehicle-description">{vehicle.description}</p>
                <div className="vehicle-features">
                  {vehicle.features.map((feature, index) => (
                    <span key={index} className="feature-tag">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              <div className="selection-indicator">
                {selectedType === vehicle.id && <div className="check-mark">✓</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VehicleTypeSelector;