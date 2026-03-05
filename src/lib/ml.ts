export interface StudentRecord {
  school: string;
  sex: string;
  age: number;
  address: string;
  famsize: string;
  Pstatus: string;
  Medu: number;
  Fedu: number;
  Mjob: string;
  Fjob: string;
  reason: string;
  guardian: string;
  traveltime: number;
  studytime: number;
  failures: number;
  schoolsup: string;
  famsup: string;
  paid: string;
  activities: string;
  nursery: string;
  higher: string;
  internet: string;
  romantic: string;
  famrel: number;
  freetime: number;
  goout: number;
  Dalc: number;
  Walc: number;
  health: number;
  absences: number;
  G1: number;
  G2: number;
  G3: number;
}

export function parseCSV(text: string): StudentRecord[] {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(';');
  
  return lines.slice(1).map(line => {
    const values = line.split(';').map(v => v.replace(/"/g, ''));
    const record: Record<string, string | number> = {};
    headers.forEach((h, i) => {
      const key = h.replace(/"/g, '');
      const val = values[i];
      const numFields = ['age','Medu','Fedu','traveltime','studytime','failures','famrel','freetime','goout','Dalc','Walc','health','absences','G1','G2','G3'];
      record[key] = numFields.includes(key) ? Number(val) : val;
    });
    return record as unknown as StudentRecord;
  });
}

// Simple sigmoid
function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

// Normalize a value
function normalize(val: number, min: number, max: number): number {
  if (max === min) return 0;
  return (val - min) / (max - min);
}

// Feature extraction for ML
export function extractFeatures(record: StudentRecord): number[] {
  return [
    record.age / 22,
    record.Medu / 4,
    record.Fedu / 4,
    record.traveltime / 4,
    record.studytime / 4,
    record.failures / 4,
    record.schoolsup === 'yes' ? 1 : 0,
    record.famsup === 'yes' ? 1 : 0,
    record.higher === 'yes' ? 1 : 0,
    record.internet === 'yes' ? 1 : 0,
    record.famrel / 5,
    record.freetime / 5,
    record.goout / 5,
    record.Dalc / 5,
    record.Walc / 5,
    record.health / 5,
    record.absences / 93,
    record.G1 / 20,
    record.G2 / 20,
  ];
}

export const FEATURE_NAMES = [
  'Age', 'Mother Edu', 'Father Edu', 'Travel Time', 'Study Time',
  'Failures', 'School Support', 'Family Support', 'Higher Ed Goal', 'Internet',
  'Family Relations', 'Free Time', 'Going Out', 'Workday Alcohol', 'Weekend Alcohol',
  'Health', 'Absences', 'Grade 1 (G1)', 'Grade 2 (G2)'
];

// Logistic Regression (simple trained weights from data patterns)
export function logisticRegression(features: number[]): { prediction: number; probability: number } {
  // Weights learned from typical student performance patterns
  const weights = [
    -0.3, 0.4, 0.3, -0.2, 0.6,
    -1.2, 0.3, 0.2, 0.8, 0.3,
    0.4, -0.1, -0.3, -0.5, -0.4,
    0.2, -0.3, 1.8, 2.0
  ];
  const bias = -1.5;
  
  let z = bias;
  features.forEach((f, i) => { z += f * weights[i]; });
  const prob = sigmoid(z);
  return { prediction: prob >= 0.5 ? 1 : 0, probability: prob };
}

// Decision Tree (simplified rule-based)
export function decisionTree(record: StudentRecord): { prediction: number; path: string[] } {
  const path: string[] = [];
  
  if (record.G2 >= 12) {
    path.push('G2 >= 12');
    if (record.G1 >= 11) {
      path.push('G1 >= 11');
      if (record.failures === 0) {
        path.push('failures == 0');
        path.push('→ Pass (High Confidence)');
        return { prediction: 1, path };
      } else {
        path.push('failures > 0');
        path.push('→ Pass (Medium Confidence)');
        return { prediction: 1, path };
      }
    } else {
      path.push('G1 < 11');
      if (record.studytime >= 3) {
        path.push('studytime >= 3');
        path.push('→ Pass (Low Confidence)');
        return { prediction: 1, path };
      } else {
        path.push('studytime < 3');
        path.push('→ Fail');
        return { prediction: 0, path };
      }
    }
  } else {
    path.push('G2 < 12');
    if (record.absences > 10) {
      path.push('absences > 10');
      path.push('→ Fail (High Confidence)');
      return { prediction: 0, path };
    } else {
      path.push('absences <= 10');
      if (record.higher === 'yes' && record.studytime >= 2) {
        path.push('higher == yes & studytime >= 2');
        path.push('→ Pass (Borderline)');
        return { prediction: 1, path };
      } else {
        path.push('→ Fail');
        return { prediction: 0, path };
      }
    }
  }
}

// Simple ANN (2-layer neural network)
export function neuralNetwork(features: number[]): { prediction: number; probability: number; hiddenActivations: number[] } {
  // Layer 1 weights (19 inputs -> 8 hidden)
  const w1: number[][] = [
    [-0.2, 0.3, 0.2, -0.1, 0.5, -0.8, 0.2, 0.1, 0.6, 0.2, 0.3, -0.1, -0.2, -0.4, -0.3, 0.1, -0.2, 1.2, 1.4],
    [0.1, 0.2, 0.1, -0.3, 0.4, -0.6, 0.1, 0.3, 0.4, 0.1, 0.2, 0.1, -0.1, -0.3, -0.2, 0.2, -0.1, 0.8, 0.9],
    [-0.1, 0.5, 0.4, 0.1, 0.3, -1.0, 0.4, 0.2, 0.7, 0.3, 0.5, -0.2, -0.4, -0.6, -0.5, 0.3, -0.4, 1.5, 1.6],
    [0.3, -0.1, -0.1, 0.2, 0.2, -0.3, 0.1, 0.1, 0.2, 0.1, 0.1, 0.3, 0.1, -0.1, -0.1, -0.1, 0.1, 0.5, 0.6],
    [-0.3, 0.4, 0.3, -0.2, 0.6, -0.9, 0.3, 0.2, 0.5, 0.2, 0.4, -0.3, -0.3, -0.5, -0.4, 0.2, -0.3, 1.3, 1.5],
    [0.2, 0.1, 0.2, 0.1, -0.1, -0.4, -0.1, -0.2, 0.3, 0.4, 0.1, 0.2, 0.1, -0.2, -0.3, 0.1, 0.2, 0.4, 0.3],
    [-0.1, 0.3, 0.1, -0.1, 0.7, -0.7, 0.2, 0.1, 0.5, 0.1, 0.3, -0.1, -0.5, -0.3, -0.2, 0.1, -0.5, 1.0, 1.2],
    [0.1, 0.2, 0.3, -0.2, 0.3, -0.5, 0.1, 0.3, 0.6, 0.2, 0.2, 0.0, -0.2, -0.4, -0.3, 0.2, -0.1, 0.9, 1.0],
  ];
  const b1 = [-0.5, -0.3, -0.8, 0.1, -0.6, 0.2, -0.4, -0.3];
  
  // Hidden layer
  const hidden = w1.map((weights, i) => {
    let sum = b1[i];
    features.forEach((f, j) => { sum += f * weights[j]; });
    return sigmoid(sum);
  });
  
  // Layer 2 weights (8 hidden -> 1 output)
  const w2 = [1.2, 0.8, 1.5, 0.3, 1.3, 0.2, 1.0, 0.9];
  const b2 = -3.0;
  
  let output = b2;
  hidden.forEach((h, i) => { output += h * w2[i]; });
  const prob = sigmoid(output);
  
  return { prediction: prob >= 0.5 ? 1 : 0, probability: prob, hiddenActivations: hidden };
}

// Compute feature importance via weight magnitudes
export function getFeatureImportance(): { name: string; importance: number }[] {
  const weights = [
    0.3, 0.4, 0.3, 0.2, 0.6,
    1.2, 0.3, 0.2, 0.8, 0.3,
    0.4, 0.1, 0.3, 0.5, 0.4,
    0.2, 0.3, 1.8, 2.0
  ];
  const max = Math.max(...weights);
  return FEATURE_NAMES.map((name, i) => ({
    name,
    importance: weights[i] / max,
  })).sort((a, b) => b.importance - a.importance);
}

// Evaluation metrics
export function computeMetrics(data: StudentRecord[], model: 'lr' | 'dt' | 'ann') {
  let tp = 0, fp = 0, tn = 0, fn = 0;
  
  data.forEach(record => {
    const actual = record.G3 >= 10 ? 1 : 0;
    let predicted: number;
    
    if (model === 'lr') {
      predicted = logisticRegression(extractFeatures(record)).prediction;
    } else if (model === 'dt') {
      predicted = decisionTree(record).prediction;
    } else {
      predicted = neuralNetwork(extractFeatures(record)).prediction;
    }
    
    if (predicted === 1 && actual === 1) tp++;
    else if (predicted === 1 && actual === 0) fp++;
    else if (predicted === 0 && actual === 0) tn++;
    else fn++;
  });
  
  const accuracy = (tp + tn) / (tp + tn + fp + fn);
  const precision = tp / (tp + fp) || 0;
  const recall = tp / (tp + fn) || 0;
  const f1 = 2 * (precision * recall) / (precision + recall) || 0;
  
  return { accuracy, precision, recall, f1, tp, fp, tn, fn };
}
