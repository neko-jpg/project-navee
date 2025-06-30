    // client/src/components/MapDisplay.js
    import React, { useEffect, useRef, useState } from 'react';
    import { getDirections } from '../utils/api'; // getDirections関数をインポート

    function MapDisplay({ searchParams }) {
      const mapRef = useRef(null);
      const mapInstance = useRef(null);
      const directionsRenderer = useRef(null);
      const googleMapsLoaded = useRef(false); // Google Maps APIの読み込み状態を追跡

      // 地図の初期化処理
      useEffect(() => {
        const loadMap = () => {
          if (window.google && window.google.maps) {
            initMap();
            googleMapsLoaded.current = true; // API読み込み完了
          } else {
            console.warn('Google Maps API not loaded yet. Retrying...');
            const timer = setTimeout(loadMap, 1000);
            return () => clearTimeout(timer);
          }
        };
        loadMap();
      }, []);

      const initMap = () => {
        if (!mapRef.current) {
          console.error("Map container element not found.");
          return;
        }

        const utsunomiya = { lat: 36.555139, lng: 139.882181 };

        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: utsunomiya,
          zoom: 12,
        });

        // DirectionsRendererのインスタンスを作成し、地図と連結
        directionsRenderer.current = new window.google.maps.DirectionsRenderer({
          map: mapInstance.current,
          // 今後、安全ルートと危険ルートで色分けするために、polylineOptionsは一旦ここでは設定しない
          // ルートの表示は後でカスタムレンダリングで制御する
        });

        console.log("Google Map initialized.");
      };

      // searchParamsが変更されたときにルート検索を実行するuseEffect
      useEffect(() => {
        // APIが読み込まれていること、出発地と目的地が設定されていることを確認
        if (googleMapsLoaded.current && searchParams.origin && searchParams.destination && mapInstance.current && directionsRenderer.current) {
          console.log('Searching for route with:', searchParams);
          fetchAndDisplayRoute(searchParams.origin, searchParams.destination, searchParams.vehicleType);
        }
      }, [searchParams]); // searchParamsが変更されるたびに実行

      const fetchAndDisplayRoute = async (origin, destination, vehicleType) => {
        try {
          // api.js の getDirections 関数を呼び出す
          const directionsResult = await getDirections(origin, destination);

          if (directionsResult.routes && directionsResult.routes.length > 0) {
            // ここでハイブリッド安全スコアに基づいてルートを選定するロジックを実装する
            // 現時点では最初のルート（Googleのデフォルト）を表示
            directionsRenderer.current.setDirections(directionsResult);
            console.log("Route displayed successfully!");
          } else {
            console.warn("No routes found or directions result is empty.");
            directionsRenderer.current.setDirections({ routes: [] }); // ルートが見つからない場合はクリア
            alert("指定された場所のルートが見つかりませんでした。入力内容を確認してください。");
          }
        } catch (error) {
          console.error("Error fetching or displaying route:", error);
          directionsRenderer.current.setDirections({ routes: [] }); // エラー発生時もクリア
          alert("ルート検索中にエラーが発生しました。詳細はコンソールを確認してください。");
        }
      };

      return (
        <div className="map-container" style={{ width: '100%', height: '500px', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#e0e0e0' }}>
          <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
        </div>
      );
    }

    export default MapDisplay;