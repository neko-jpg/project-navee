// client/src/utils/api.js

/**
 * DirectionsServiceを呼び出してルート情報を取得する
 * @param {string} origin - 出発地
 * @param {string} destination - 目的地
 * @param {google.maps.DirectionsWaypoint[]} [waypoints] - 経由地の配列（オプション）
 * @returns {Promise<google.maps.DirectionsResult>}
 */
export const getDirections = async (origin, destination, waypoints = []) => {
  if (!window.google || !window.google.maps || !window.google.maps.DirectionsService) {
    console.error("Google Maps DirectionsService is not loaded.");
    throw new Error("Google Maps API not fully loaded or DirectionsService unavailable.");
  }

  const directionsService = new window.google.maps.DirectionsService();

  const request = {
    origin: origin,
    destination: destination,
    waypoints: waypoints,
    optimizeWaypoints: true, // 経由地を最適化
    travelMode: window.google.maps.TravelMode.DRIVING,
    provideRouteAlternatives: false, // 今回は個別にリクエストするのでfalseでOK
  };

  console.log("Calling DirectionsService with request:", request);

  return new Promise((resolve, reject) => {
    directionsService.route(request, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        resolve(result);
      } else {
        console.error(`DirectionsService failed due to: ${status}`, {origin, destination, waypoints});
        reject(new Error(`DirectionsService failed with status: ${status}`));
      }
    });
  });
};