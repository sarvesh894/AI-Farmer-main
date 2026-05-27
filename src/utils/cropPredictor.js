/**
 * Local Crop Recommendation Engine
 * Uses weighted scoring with hard penalties for out-of-range values
 */

const CROP_RULES = [
  { name: "Rice",        N:[60,120], P:[30,60],  K:[30,60],  temp:[22,35], humidity:[75,90], ph:[5.5,7.0], rainfall:[150,300] },
  { name: "Wheat",       N:[60,120], P:[30,60],  K:[30,60],  temp:[10,25], humidity:[40,70], ph:[6.0,7.5], rainfall:[50,150]  },
  { name: "Maize",       N:[60,120], P:[30,60],  K:[30,60],  temp:[18,35], humidity:[50,80], ph:[5.5,7.5], rainfall:[50,150]  },
  { name: "Chickpea",    N:[20,60],  P:[40,80],  K:[20,50],  temp:[15,30], humidity:[25,60], ph:[6.0,8.0], rainfall:[30,100]  },
  { name: "Kidneybeans", N:[20,60],  P:[60,100], K:[20,50],  temp:[15,30], humidity:[40,70], ph:[6.0,7.5], rainfall:[30,100]  },
  { name: "Pigeonpeas",  N:[20,60],  P:[40,80],  K:[20,50],  temp:[20,35], humidity:[40,70], ph:[5.5,7.0], rainfall:[40,120]  },
  { name: "Mothbeans",   N:[20,50],  P:[30,60],  K:[20,40],  temp:[28,42], humidity:[15,45], ph:[6.0,8.0], rainfall:[15,70]   },
  { name: "Mungbean",    N:[20,60],  P:[30,60],  K:[20,50],  temp:[25,38], humidity:[50,80], ph:[6.0,7.5], rainfall:[40,100]  },
  { name: "Blackgram",   N:[20,60],  P:[40,80],  K:[20,50],  temp:[25,38], humidity:[50,80], ph:[6.0,7.5], rainfall:[40,100]  },
  { name: "Lentil",      N:[20,60],  P:[40,80],  K:[20,50],  temp:[10,25], humidity:[25,55], ph:[6.0,8.0], rainfall:[20,75]   },
  { name: "Pomegranate", N:[20,60],  P:[20,50],  K:[30,60],  temp:[25,38], humidity:[25,55], ph:[5.5,7.5], rainfall:[15,75]   },
  { name: "Banana",      N:[80,140], P:[60,100], K:[50,100], temp:[22,35], humidity:[70,90], ph:[5.5,7.0], rainfall:[100,200] },
  { name: "Mango",       N:[20,60],  P:[20,50],  K:[30,60],  temp:[24,38], humidity:[40,70], ph:[5.5,7.5], rainfall:[40,120]  },
  { name: "Grapes",      N:[20,60],  P:[20,50],  K:[30,60],  temp:[15,35], humidity:[50,80], ph:[5.5,7.0], rainfall:[50,150]  },
  { name: "Watermelon",  N:[80,120], P:[40,80],  K:[40,80],  temp:[28,40], humidity:[45,75], ph:[6.0,7.5], rainfall:[30,90]   },
  { name: "Muskmelon",   N:[80,120], P:[40,80],  K:[40,80],  temp:[28,40], humidity:[45,70], ph:[6.0,7.5], rainfall:[25,75]   },
  { name: "Apple",       N:[20,60],  P:[20,50],  K:[30,60],  temp:[5,18],  humidity:[50,80], ph:[5.5,7.0], rainfall:[50,150]  },
  { name: "Orange",      N:[20,60],  P:[20,50],  K:[30,60],  temp:[15,30], humidity:[50,80], ph:[5.5,7.5], rainfall:[50,150]  },
  { name: "Papaya",      N:[40,80],  P:[30,60],  K:[40,80],  temp:[22,35], humidity:[60,80], ph:[6.0,7.5], rainfall:[60,150]  },
  { name: "Coconut",     N:[20,60],  P:[20,50],  K:[40,80],  temp:[22,35], humidity:[65,90], ph:[5.5,7.5], rainfall:[100,200] },
  { name: "Cotton",      N:[80,140], P:[40,80],  K:[20,60],  temp:[25,38], humidity:[35,65], ph:[6.0,8.0], rainfall:[50,150]  },
  { name: "Jute",        N:[60,100], P:[30,60],  K:[30,60],  temp:[24,38], humidity:[70,90], ph:[6.0,7.5], rainfall:[150,250] },
  { name: "Coffee",      N:[80,120], P:[30,60],  K:[30,60],  temp:[15,28], humidity:[60,90], ph:[5.0,6.5], rainfall:[100,200] },
  { name: "Sugarcane",   N:[80,140], P:[30,60],  K:[30,60],  temp:[20,35], humidity:[60,85], ph:[6.0,7.5], rainfall:[100,200] },
];

function penalty(val, min, max) {
  if (val >= min && val <= max) return 1.0;
  const mid = (min + max) / 2;
  const range = (max - min) / 2;
  const dist = Math.abs(val - mid) - range;
  // Hard penalty: score drops sharply outside range
  return Math.max(0, 1 - (dist / range) * 1.5);
}

function score(crop, { N, P, K, temperature, humidity, ph, rainfall }) {
  // Temperature and humidity are most critical — highest weight
  const tempScore     = penalty(+temperature, crop.temp[0],     crop.temp[1])     * 30;
  const humidityScore = penalty(+humidity,    crop.humidity[0], crop.humidity[1]) * 25;
  const rainfallScore = penalty(+rainfall,    crop.rainfall[0], crop.rainfall[1]) * 15;
  const nScore        = penalty(+N,           crop.N[0],        crop.N[1])        * 12;
  const pScore        = penalty(+P,           crop.P[0],        crop.P[1])        * 8;
  const kScore        = penalty(+K,           crop.K[0],        crop.K[1])        * 6;
  const phScore       = penalty(+ph,          crop.ph[0],       crop.ph[1])       * 4;

  return tempScore + humidityScore + rainfallScore + nScore + pScore + kScore + phScore;
}

export function predictCrop(inputs) {
  const scored = CROP_RULES.map((crop) => ({
    name: crop.name,
    score: score(crop, inputs),
  })).sort((a, b) => b.score - a.score);

  return `${scored[0].name} is the best crop to be cultivated right there`;
}
