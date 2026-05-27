/**
 * Auto-fill farm parameters from location
 * - Temperature, Humidity, Rainfall from Open-Meteo (real data)
 * - N, P, K, pH estimated from soil zone based on coordinates
 */

function estimateSoilValues(lat, lon) {
  if (lat > 28 && lon < 77)                          return { N: 85, P: 45, K: 50, ph: 7.2, moisture: 55 }; // Punjab/Haryana
  if (lat > 24 && lon > 88)                          return { N: 70, P: 35, K: 40, ph: 5.8, moisture: 70 }; // NE India
  if (lat < 20 && lon > 74 && lon < 80)              return { N: 60, P: 30, K: 55, ph: 7.8, moisture: 40 }; // Deccan
  if (lat < 15)                                      return { N: 55, P: 25, K: 35, ph: 6.2, moisture: 60 }; // South India
  if (lat > 20 && lat < 26 && lon > 77 && lon < 84) return { N: 65, P: 38, K: 45, ph: 6.8, moisture: 50 }; // Central India
  if (lat > 24 && lat < 28 && lon > 77 && lon < 88) return { N: 80, P: 42, K: 48, ph: 7.0, moisture: 58 }; // UP/Bihar
  if (lon < 75 && lat > 24)                          return { N: 40, P: 20, K: 30, ph: 8.2, moisture: 25 }; // Rajasthan
  return { N: 70, P: 35, K: 40, ph: 6.8, moisture: 50 };
}

async function fetchWeatherAndSoil(latitude, longitude) {
  // Fetch current weather
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m&timezone=auto`
  );
  const data = await res.json();
  const c = data.current;
  const soil = estimateSoilValues(latitude, longitude);

  // Fetch current month's rainfall
  let annualRainfall = 100;
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-${String(now.getDate()).padStart(2, "0")}`;
    const rainRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      `&daily=precipitation_sum&start_date=${startDate}&end_date=${endDate}&timezone=auto`
    );
    const rainData = await rainRes.json();
    if (rainData.daily?.precipitation_sum) {
      annualRainfall = Math.round(
        rainData.daily.precipitation_sum.reduce((a, b) => a + (b || 0), 0)
      );
    }
  } catch { /* use default */ }

  // Reverse geocode for city name
  let city = "";
  try {
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      { headers: { "User-Agent": "AIFarmer/1.0 (awanitsingh8873@gmail.com)" } }
    );
    const geoData = await geoRes.json();
    city = geoData.address?.city || geoData.address?.town ||
      geoData.address?.village || geoData.address?.county || "";
  } catch { /* ignore */ }

  return {
    temperature: c.temperature_2m?.toFixed(1) || 25,
    humidity:    c.relative_humidity_2m || 60,
    rainfall:    annualRainfall,
    city,
    ...soil,
  };
}

// Auto-fill using browser geolocation
export async function autoFillFromLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) { reject(new Error("Geolocation not supported")); return; }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try { resolve(await fetchWeatherAndSoil(coords.latitude, coords.longitude)); }
        catch (e) { reject(e); }
      },
      (err) => {
        console.error("Geolocation error:", err.code, err.message);
        reject(err);
      },
      { timeout: 15000, enableHighAccuracy: false, maximumAge: 60000 }
    );
  });
}

// Auto-fill using manually typed city name
export async function autoFillFromCityName(cityName) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`,
    { headers: { "User-Agent": "AIFarmer/1.0 (awanitsingh8873@gmail.com)" } }
  );
  const results = await res.json();
  if (!results || results.length === 0) throw new Error("Location not found");
  const { lat, lon, display_name } = results[0];
  const city = display_name.split(",")[0];
  const data = await fetchWeatherAndSoil(parseFloat(lat), parseFloat(lon));
  return { ...data, city };
}
