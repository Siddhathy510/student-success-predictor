import { useState, useMemo } from 'react';
import { StudentRecord, extractFeatures, logisticRegression, decisionTree, neuralNetwork, computeMetrics } from '@/lib/ml';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Brain, GitBranch, TrendingUp } from 'lucide-react';

interface ModelTrainingProps {
  data: StudentRecord[];
}

type ModelType = 'lr' | 'dt' | 'ann';

export function ModelTraining({ data }: ModelTrainingProps) {
  const [selectedModel, setSelectedModel] = useState<ModelType>('lr');
  const [trained, setTrained] = useState<Record<ModelType, boolean>>({ lr: false, dt: false, ann: false });
  const [training, setTraining] = useState(false);

  const metrics = useMemo(() => {
    if (!trained[selectedModel] || !data.length) return null;
    return computeMetrics(data, selectedModel);
  }, [trained, selectedModel, data]);

  const handleTrain = () => {
    setTraining(true);
    setTimeout(() => {
      setTrained(prev => ({ ...prev, [selectedModel]: true }));
      setTraining(false);
    }, 1500);
  };

  const models = [
    { key: 'lr' as ModelType, name: 'Logistic Regression', icon: TrendingUp, desc: 'Linear classifier using sigmoid function' },
    { key: 'dt' as ModelType, name: 'Decision Tree', icon: GitBranch, desc: 'Rule-based tree classifier' },
    { key: 'ann' as ModelType, name: 'Neural Network (ANN)', icon: Brain, desc: '2-layer network with backpropagation' },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold font-display">Model Training</h2>
        <p className="text-muted-foreground text-sm mt-1">Train and compare supervised learning models</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {models.map(m => (
          <button
            key={m.key}
            onClick={() => setSelectedModel(m.key)}
            className={`rounded-lg border p-4 text-left transition-all ${
              selectedModel === m.key
                ? 'border-primary bg-primary/10 glow-primary'
                : 'border-border bg-card hover:border-muted-foreground/30'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <m.icon className={`w-5 h-5 ${selectedModel === m.key ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="font-display font-semibold text-sm">{m.name}</span>
            </div>
            <p className="text-xs text-muted-foreground">{m.desc}</p>
            {trained[m.key] && (
              <Badge className="mt-2 bg-success/20 text-success border-success/30 text-xs">Trained</Badge>
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Button
          onClick={handleTrain}
          disabled={training}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {training ? (
            <><Activity className="w-4 h-4 animate-pulse-glow" /> Training...</>
          ) : (
            <>Train {models.find(m => m.key === selectedModel)?.name}</>
          )}
        </Button>
        <span className="text-xs text-muted-foreground font-mono">
          Dataset: {data.length} samples · 19 features · Binary classification (Pass/Fail)
        </span>
      </div>

      {training && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground font-mono">
            <span>Training progress</span>
            <span>Processing...</span>
          </div>
          <Progress value={66} className="h-2" />
        </div>
      )}

      {metrics && !training && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold font-display">Evaluation Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Accuracy" value={metrics.accuracy} color="primary" />
            <MetricCard label="Precision" value={metrics.precision} color="info" />
            <MetricCard label="Recall" value={metrics.recall} color="warning" />
            <MetricCard label="F1-Score" value={metrics.f1} color="accent" />
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="text-sm font-semibold mb-3 font-display">Confusion Matrix</h4>
            <div className="grid grid-cols-3 gap-1 max-w-xs font-mono text-xs">
              <div />
              <div className="text-center text-muted-foreground p-2">Pred: Pass</div>
              <div className="text-center text-muted-foreground p-2">Pred: Fail</div>
              <div className="text-muted-foreground p-2">Act: Pass</div>
              <div className="bg-success/20 text-success rounded p-2 text-center font-bold">{metrics.tp}</div>
              <div className="bg-destructive/20 text-destructive rounded p-2 text-center font-bold">{metrics.fn}</div>
              <div className="text-muted-foreground p-2">Act: Fail</div>
              <div className="bg-destructive/20 text-destructive rounded p-2 text-center font-bold">{metrics.fp}</div>
              <div className="bg-success/20 text-success rounded p-2 text-center font-bold">{metrics.tn}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, color }: { label: string; value: number; color: string }) {
  const percentage = (value * 100).toFixed(1);
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-bold font-mono mt-1 text-${color}`}>{percentage}%</p>
      <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full bg-${color} rounded-full transition-all duration-1000`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
