    // client/src/utils/api.js
    // Google Maps APIとの連携や、バックエンドAPIへのリクエストを行うユーティリティ関数

    // DirectionsService を利用するように変更
    export const getDirections = async (origin, destination) => {
      // APIキーはwindow.googleMapsApiKeyから取得（public/index.htmlで設定済み）
      // ただし、DirectionsServiceはAPIキーを直接引数で渡す必要はない
      // APIキーは <script> タグの URL パラメータで渡されているため、SDKが内部で処理する

      if (!window.google || !window.google.maps || !window.google.maps.DirectionsService) {
        console.error("Google Maps DirectionsService is not loaded.");
        // APIがまだ読み込まれていない、またはDirectionsServiceが利用できない場合はエラーをスロー
        throw new Error("Google Maps API not fully loaded or DirectionsService unavailable.");
      }

      const directionsService = new window.google.maps.DirectionsService();

      // Directions API へのリクエストパラメータ
      const request = {
        origin: origin,       // 出発地 (文字列または LatLng オブジェクト)
        destination: destination, // 目的地 (文字列または LatLng オブジェクト)
        travelMode: window.google.maps.TravelMode.DRIVING, // 車での移動
        provideRouteAlternatives: true, // 複数のルート候補を要求
      };

      console.log("Calling DirectionsService with request:", request);

      return new Promise((resolve, reject) => {
        directionsService.route(request, (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            resolve(result); // 結果を解決
          } else {
            console.error("DirectionsService failed due to:", status);
            reject(new Error(`DirectionsService failed with status: ${status}`)); // エラーを拒否
          }
        });
      });
    };