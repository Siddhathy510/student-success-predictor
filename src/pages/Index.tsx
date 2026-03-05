import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStudentData } from '@/hooks/useStudentData';
import { DatasetExplorer } from '@/components/DatasetExplorer';
import { ModelTraining } from '@/components/ModelTraining';
import { FeatureImportance } from '@/components/FeatureImportance';
import { PredictionPanel } from '@/components/PredictionPanel';
import { Brain, Database, Activity, BarChart3, Sparkles } from 'lucide-react';

const Index = () => {
  const { matData, porData, loading } = useStudentData();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Brain className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse-glow" />
          <p className="text-muted-foreground font-mono text-sm">Loading dataset...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background grid-pattern">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-display">Student Performance Predictor</h1>
              <p className="text-xs text-muted-foreground font-mono">Supervised Learning · Classification & Regression</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <Sparkles className="w-3 h-3 text-primary" />
            <span>UCI ML Repository · {matData.length + porData.length} samples</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dataset" className="space-y-6">
          <TabsList className="bg-secondary/50 border border-border p-1">
            <TabsTrigger value="dataset" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-display text-sm gap-2">
              <Database className="w-4 h-4" /> Dataset
            </TabsTrigger>
            <TabsTrigger value="training" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-display text-sm gap-2">
              <Activity className="w-4 h-4" /> Model Training
            </TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-display text-sm gap-2">
              <BarChart3 className="w-4 h-4" /> Feature Importance
            </TabsTrigger>
            <TabsTrigger value="predict" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-display text-sm gap-2">
              <Brain className="w-4 h-4" /> Predict
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dataset">
            <DatasetExplorer matData={matData} porData={porData} />
          </TabsContent>
          <TabsContent value="training">
            <ModelTraining data={matData} />
          </TabsContent>
          <TabsContent value="features">
            <FeatureImportance />
          </TabsContent>
          <TabsContent value="predict">
            <PredictionPanel />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground font-mono">
          Student Performance Prediction System · Logistic Regression · Decision Trees · ANN · UCI Dataset
        </div>
      </footer>
    </div>
  );
};

export default Index;
