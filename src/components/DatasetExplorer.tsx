import { StudentRecord } from '@/lib/ml';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DatasetExplorerProps {
  matData: StudentRecord[];
  porData: StudentRecord[];
}

const columns: (keyof StudentRecord)[] = ['school','sex','age','Medu','Fedu','studytime','failures','higher','internet','absences','G1','G2','G3'];

export function DatasetExplorer({ matData, porData }: DatasetExplorerProps) {
  const [dataset, setDataset] = useState<'mat' | 'por'>('mat');
  const data = dataset === 'mat' ? matData : porData;

  const avgG3 = data.length ? (data.reduce((s, r) => s + r.G3, 0) / data.length).toFixed(1) : '0';
  const passRate = data.length ? ((data.filter(r => r.G3 >= 10).length / data.length) * 100).toFixed(1) : '0';
  const avgAbsences = data.length ? (data.reduce((s, r) => s + r.absences, 0) / data.length).toFixed(1) : '0';

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display">Dataset Explorer</h2>
          <p className="text-muted-foreground text-sm mt-1">UCI Student Performance Dataset</p>
        </div>
        <Select value={dataset} onValueChange={(v) => setDataset(v as 'mat' | 'por')}>
          <SelectTrigger className="w-48 bg-secondary border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mat">Mathematics ({matData.length} records)</SelectItem>
            <SelectItem value="por">Portuguese ({porData.length} records)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={data.length.toString()} />
        <StatCard label="Avg Final Grade" value={avgG3} accent />
        <StatCard label="Pass Rate" value={`${passRate}%`} />
        <StatCard label="Avg Absences" value={avgAbsences} />
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <ScrollArea className="h-[420px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead className="text-xs font-mono text-muted-foreground w-12">#</TableHead>
                {columns.map(col => (
                  <TableHead key={col} className="text-xs font-mono text-muted-foreground">{col}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.slice(0, 100).map((row, i) => (
                <TableRow key={i} className="hover:bg-secondary/30 transition-colors">
                  <TableCell className="font-mono text-xs text-muted-foreground">{i + 1}</TableCell>
                  {columns.map(col => (
                    <TableCell key={col} className="font-mono text-xs">
                      {col === 'G3' ? (
                        <Badge variant={row.G3 >= 10 ? 'default' : 'destructive'} className="font-mono text-xs">
                          {row[col]}
                        </Badge>
                      ) : (
                        String(row[col])
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        {data.length > 100 && (
          <div className="px-4 py-2 bg-secondary/30 text-xs text-muted-foreground text-center">
            Showing first 100 of {data.length} records
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-lg border border-border bg-card p-4 ${accent ? 'glow-primary' : ''}`}>
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-bold font-mono mt-1 ${accent ? 'text-primary' : ''}`}>{value}</p>
    </div>
  );
}
