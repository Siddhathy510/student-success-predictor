import { useState, useEffect } from 'react';
import { parseCSV, StudentRecord } from '@/lib/ml';

export function useStudentData() {
  const [matData, setMatData] = useState<StudentRecord[]>([]);
  const [porData, setPorData] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/data/student-mat.csv').then(r => r.text()),
      fetch('/data/student-por.csv').then(r => r.text()),
    ]).then(([mat, por]) => {
      setMatData(parseCSV(mat));
      setPorData(parseCSV(por));
      setLoading(false);
    });
  }, []);

  return { matData, porData, loading };
}
