// client/src/components/MapDisplay.js
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { getDirections } from '../utils/api';
import { dangerZones } from '../data/danger-zones';

function MapDisplay({ searchKey, searchParams, filters }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [renderersAndMarkers, setRenderersAndMarkers] = useState([]);

  // 地図の初期化（初回のみ）
  useEffect(() => {
    if (window.google && !mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 36.555, lng: 139.882 },
        zoom: 12,
      });
    }
  }, []);

  // フィルター条件に基づいて表示する危険地点を決定
  const getActiveDangerZones = useCallback((allZones, currentFilters) => {
    if (!currentFilters) return [];
    
    const selectedTimeSlots = Object.entries(currentFilters.times)
      .filter(([, isSelected]) => isSelected)
      .map(([slot]) => slot.split('-').map(Number));

    return allZones.filter(zone => {
      const isDateMatch = currentFilters.dates[zone.year]?.[zone.month] ?? false;
      const isTimeMatch = selectedTimeSlots.some(([start, end]) => zone.hour >= start && zone.hour < end);
      return isDateMatch && isTimeMatch;
    });
  }, []);

  // ルートが危険ゾーンを通過する回数をカウント
  const countPassingDangerZones = useCallback((route, activeZones) => {
    if (!activeZones || activeZones.length === 0) return 0;
    let count = 0;
    for (const zone of activeZones) {
      for (const latLng of route.overview_path) {
        if (window.google.maps.geometry.spherical.computeDistanceBetween(latLng, zone.location) <= zone.radius) {
          count++;
          break; // 1ゾーンにつき1カウント
        }
      }
    }
    return count;
  }, []);

  // 危険地点の通過が最も少ないルートを評価・選択
  const evaluateRoutes = useCallback((directionsResult, activeZones) => {
    let naveeRouteIndex = 0;
    let minDangerCount = Infinity;
    
    directionsResult.routes.forEach((route, index) => {
      const dangerCount = countPassingDangerZones(route, activeZones);
      console.log(`ルート ${index} ("${route.summary}"): 危険地点の通過数 = ${dangerCount}`);
      if (dangerCount < minDangerCount) {
        minDangerCount = dangerCount;
        naveeRouteIndex = index;
      }
    });
    
    return { naveeRouteIndex, googleRouteIndex: 0 };
  }, [countPassingDangerZones]);

  // ルート検索と描画のメイン処理
  const fetchAndDisplayRoutes = useCallback(async (origin, destination, currentFilters) => {
    try {
      const directionsResult = await getDirections(origin, destination);
      if (!directionsResult.routes?.length) {
        alert("ルートが見つかりませんでした。");
        return;
      }
      
      const activeZones = getActiveDangerZones(dangerZones, currentFilters);
      const newItemsToRender = [];

      // 危険地点マーカーを地図に描画
      activeZones.forEach(zone => {
        newItemsToRender.push(new window.google.maps.Marker({
          position: zone.location,
          map: mapInstance.current,
          title: `${zone.name} (${zone.year}/${zone.month} ${zone.hour}時)`,
          icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 5, fillColor: '#d9534f', fillOpacity: 0.7, strokeWeight: 0 }
        }));
      });
      
      const { naveeRouteIndex, googleRouteIndex } = evaluateRoutes(directionsResult, activeZones);
      const bounds = new window.google.maps.LatLngBounds();
      
      // NAVee推奨ルート（青）を描画
      newItemsToRender.push(new window.google.maps.DirectionsRenderer({ map: mapInstance.current, directions: directionsResult, routeIndex: naveeRouteIndex, preserveViewport: true, polylineOptions: { strokeColor: 'blue', strokeWeight: 6, zIndex: 2 }}));
      bounds.union(directionsResult.routes[naveeRouteIndex].bounds);

      // Google推奨ルートがNAVee推奨と異なり、より危険な場合に赤で描画
      const naveeDangerCount = countPassingDangerZones(directionsResult.routes[naveeRouteIndex], activeZones);
      const googleDangerCount = countPassingDangerZones(directionsResult.routes[googleRouteIndex], activeZones);
      
      if (naveeRouteIndex !== googleRouteIndex && googleDangerCount > naveeDangerCount) {
        newItemsToRender.push(new window.google.maps.DirectionsRenderer({ map: mapInstance.current, directions: directionsResult, routeIndex: googleRouteIndex, preserveViewport: true, polylineOptions: { strokeColor: 'red', strokeWeight: 4, zIndex: 1, icons: [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 3 }, offset: '0', repeat: '15px' }]}}));
        bounds.union(directionsResult.routes[googleRouteIndex].bounds);
      }
      
      mapInstance.current.fitBounds(bounds);
      setRenderersAndMarkers(newItemsToRender);

    } catch (error) {
      console.error("ルート検索・描画エラー:", error);
    }
  }, [getActiveDangerZones, evaluateRoutes, countPassingDangerZones]);

  // 検索キーが変更されたら（＝検索ボタンが押されたら）実行
  useEffect(() => {
    if (searchKey > 0) {
      // 既存の描画をクリア
      renderersAndMarkers.forEach(item => item.setMap(null));
      
      if (searchParams.origin && searchParams.destination && mapInstance.current && filters) {
        fetchAndDisplayRoutes(searchParams.origin, searchParams.destination, filters);
      }
    }
  }, [searchKey, searchParams, filters, renderersAndMarkers, fetchAndDisplayRoutes]);

  return <div ref={mapRef} className="map-container" />;
}

export default MapDisplay;