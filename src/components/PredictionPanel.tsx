import { useState } from 'react';
import { extractFeatures, logisticRegression, decisionTree, neuralNetwork, StudentRecord } from '@/lib/ml';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Brain, TrendingUp, GitBranch } from 'lucide-react';

export function PredictionPanel() {
  const [g1, setG1] = useState(12);
  const [g2, setG2] = useState(12);
  const [studytime, setStudytime] = useState(2);
  const [failures, setFailures] = useState(0);
  const [absences, setAbsences] = useState(4);
  const [higher, setHigher] = useState('yes');
  const [internet, setInternet] = useState('yes');
  const [Medu, setMedu] = useState(2);
  const [goout, setGoout] = useState(3);
  const [Dalc, setDalc] = useState(1);
  const [result, setResult] = useState<null | {
    lr: { prediction: number; probability: number };
    dt: { prediction: number; path: string[] };
    ann: { prediction: number; probability: number };
  }>(null);

  const handlePredict = () => {
    const record: StudentRecord = {
      school: 'GP', sex: 'F', age: 17, address: 'U', famsize: 'GT3',
      Pstatus: 'T', Medu, Fedu: 2, Mjob: 'other', Fjob: 'other',
      reason: 'course', guardian: 'mother', traveltime: 1, studytime,
      failures, schoolsup: 'no', famsup: 'yes', paid: 'no',
      activities: 'yes', nursery: 'yes', higher, internet,
      romantic: 'no', famrel: 4, freetime: 3, goout,
      Dalc, Walc: Dalc, health: 3, absences, G1: g1, G2: g2, G3: 0,
    };

    const features = extractFeatures(record);
    setResult({
      lr: logisticRegression(features),
      dt: decisionTree(record),
      ann: neuralNetwork(features),
    });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold font-display">Predict Student Performance</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Enter student attributes to predict pass/fail outcome
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-5 rounded-lg border border-border bg-card p-5">
          <h3 className="font-semibold font-display text-sm text-muted-foreground uppercase tracking-wider">Student Attributes</h3>
          
          <SliderField label="Grade 1 (G1)" value={g1} onChange={setG1} min={0} max={20} />
          <SliderField label="Grade 2 (G2)" value={g2} onChange={setG2} min={0} max={20} />
          <SliderField label="Study Time" value={studytime} onChange={setStudytime} min={1} max={4} />
          <SliderField label="Past Failures" value={failures} onChange={setFailures} min={0} max={4} />
          <SliderField label="Absences" value={absences} onChange={setAbsences} min={0} max={40} />
          <SliderField label="Mother Education" value={Medu} onChange={setMedu} min={0} max={4} />
          <SliderField label="Going Out" value={goout} onChange={setGoout} min={1} max={5} />
          <SliderField label="Workday Alcohol" value={Dalc} onChange={setDalc} min={1} max={5} />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Higher Education Goal</label>
              <Select value={higher} onValueChange={setHigher}>
                <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Internet Access</label>
              <Select value={internet} onValueChange={setInternet}>
                <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handlePredict} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            <Brain className="w-4 h-4 mr-2" /> Run All Models
          </Button>
        </div>

        <div className="space-y-4">
          {result ? (
            <>
              <PredictionCard
                icon={TrendingUp}
                name="Logistic Regression"
                prediction={result.lr.prediction}
                confidence={result.lr.probability}
              />
              <PredictionCard
                icon={GitBranch}
                name="Decision Tree"
                prediction={result.dt.prediction}
                confidence={result.dt.prediction === 1 ? 0.78 : 0.72}
                path={result.dt.path}
              />
              <PredictionCard
                icon={Brain}
                name="Neural Network (ANN)"
                prediction={result.ann.prediction}
                confidence={result.ann.probability}
              />
            </>
          ) : (
            <div className="rounded-lg border border-border bg-card p-8 flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-display">Adjust parameters and click predict</p>
                <p className="text-xs mt-1">All three models will run simultaneously</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SliderField({ label, value, onChange, min, max }: {
  label: string; value: number; onChange: (v: number) => void; min: number; max: number;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <label className="text-xs text-muted-foreground">{label}</label>
        <span className="text-xs font-mono text-primary">{value}</span>
      </div>
      <Slider value={[value]} onValueChange={([v]) => onChange(v)} min={min} max={max} step={1} className="cursor-pointer" />
    </div>
  );
}

function PredictionCard({ icon: Icon, name, prediction, confidence, path }: {
  icon: React.ElementType; name: string; prediction: number; confidence: number; path?: string[];
}) {
  const pass = prediction === 1;
  return (
    <div className={`rounded-lg border p-4 transition-all ${
      pass ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <span className="font-display font-semibold text-sm">{name}</span>
        </div>
        <Badge className={pass
          ? 'bg-success/20 text-success border-success/30'
          : 'bg-destructive/20 text-destructive border-destructive/30'
        }>
          {pass ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
          {pass ? 'PASS' : 'FAIL'}
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Confidence:</span>
        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${pass ? 'bg-success' : 'bg-destructive'}`}
            style={{ width: `${confidence * 100}%` }}
          />
        </div>
        <span className="text-xs font-mono">{(confidence * 100).toFixed(1)}%</span>
      </div>
      {path && (
        <div className="mt-3 space-y-1">
          {path.map((step, i) => (
            <div key={i} className="text-xs font-mono text-muted-foreground flex items-center gap-1">
              <span className="text-primary">{'>'}</span> {step}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
