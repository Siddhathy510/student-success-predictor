import { useMemo } from 'react';
import { getFeatureImportance } from '@/lib/ml';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function FeatureImportance() {
  const data = useMemo(() => getFeatureImportance(), []);

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold font-display">Feature Importance</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Which factors most influence student performance prediction
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={data} layout="vertical" margin={{ left: 120, right: 20, top: 10, bottom: 10 }}>
            <XAxis type="number" domain={[0, 1]} tick={{ fill: 'hsl(215, 15%, 50%)', fontSize: 12, fontFamily: 'JetBrains Mono' }} />
            <YAxis dataKey="name" type="category" tick={{ fill: 'hsl(210, 20%, 80%)', fontSize: 12, fontFamily: 'Space Grotesk' }} width={110} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(220, 18%, 10%)',
                border: '1px solid hsl(220, 16%, 18%)',
                borderRadius: '8px',
                fontFamily: 'JetBrains Mono',
                fontSize: 12,
              }}
              formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Importance']}
            />
            <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={i < 3 ? 'hsl(173, 80%, 40%)' : i < 7 ? 'hsl(260, 60%, 55%)' : 'hsl(220, 16%, 30%)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="w-3 h-3 rounded bg-primary inline-block mr-2" />
          <span className="text-sm font-display">High Impact</span>
          <p className="text-xs text-muted-foreground mt-1">Top 3 features with strongest predictive power</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="w-3 h-3 rounded bg-accent inline-block mr-2" />
          <span className="text-sm font-display">Medium Impact</span>
          <p className="text-xs text-muted-foreground mt-1">Features with moderate influence on prediction</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="w-3 h-3 rounded bg-secondary inline-block mr-2" />
          <span className="text-sm font-display">Low Impact</span>
          <p className="text-xs text-muted-foreground mt-1">Features with minimal predictive contribution</p>
        </div>
      </div>
    </div>
  );
}
