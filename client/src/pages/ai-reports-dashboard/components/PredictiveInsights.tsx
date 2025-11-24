import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PredictiveInsights = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('next3months');

  const predictions = {
    next3months: {
      revenue: { value: 195000, growth: 12.5, confidence: 87 },
      expenses: { value: 142000, growth: 8.3, confidence: 92 },
      profit: { value: 53000, growth: 18.2, confidence: 84 }
    },
    next6months: {
      revenue: { value: 420000, growth: 15.8, confidence: 79 },
      expenses: { value: 298000, growth: 10.1, confidence: 85 },
      profit: { value: 122000, growth: 22.4, confidence: 76 }
    }
  };

  const recommendations = [
    {
      id: 1,
      type: 'revenue',
      priority: 'high',
      title: 'Optimize Peak Season Inventory',
      description: 'Based on historical data, increase inventory by 25% for December to capture holiday demand surge.',
      impact: '+$15,000 potential revenue',
      icon: 'TrendingUp',
      color: 'text-success'
    },
    {
      id: 2,
      type: 'expense',
      priority: 'medium',
      title: 'Reduce Marketing Spend',
      description: 'Current marketing ROI is declining. Consider reallocating 15% of budget to higher-performing channels.',
      impact: '-$3,200 monthly savings',
      icon: 'TrendingDown',
      color: 'text-warning'
    },
    {
      id: 3,
      type: 'inventory',
      priority: 'high',
      title: 'Stock Optimization Alert',
      description: 'AI predicts 3 products will face stockouts in next 2 weeks based on current sales velocity.',
      impact: 'Prevent $8,500 lost sales',
      icon: 'Package',
      color: 'text-error'
    },
    {
      id: 4,
      type: 'customer',
      priority: 'medium',
      title: 'Customer Retention Focus',
      description: 'Implement loyalty program for top 20% customers who show 85% repeat purchase probability.',
      impact: '+$12,000 recurring revenue',
      icon: 'Users',
      color: 'text-primary'
    }
  ];

  const currentPrediction = predictions?.[selectedPeriod];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-error/10 text-error border-error/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    })?.format(value);
  };

  return (
    <div className="space-y-6">
      {/* Prediction Summary */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">AI Predictions</h3>
            <p className="text-sm text-muted-foreground">Future business performance forecasts</p>
          </div>
          
          <div className="flex items-center bg-muted rounded-lg p-1 mt-4 sm:mt-0">
            <Button
              variant={selectedPeriod === 'next3months' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedPeriod('next3months')}
              className="text-xs"
            >
              Next 3 Months
            </Button>
            <Button
              variant={selectedPeriod === 'next6months' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedPeriod('next6months')}
              className="text-xs"
            >
              Next 6 Months
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-primary">Predicted Revenue</span>
              <Icon name="TrendingUp" size={16} className="text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(currentPrediction?.revenue?.value)}
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-success">+{currentPrediction?.revenue?.growth}%</span>
                <span className="text-xs text-muted-foreground">
                  {currentPrediction?.revenue?.confidence}% confidence
                </span>
              </div>
            </div>
          </div>

          <div className="bg-error/5 rounded-lg p-4 border border-error/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-error">Predicted Expenses</span>
              <Icon name="TrendingDown" size={16} className="text-error" />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(currentPrediction?.expenses?.value)}
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-warning">+{currentPrediction?.expenses?.growth}%</span>
                <span className="text-xs text-muted-foreground">
                  {currentPrediction?.expenses?.confidence}% confidence
                </span>
              </div>
            </div>
          </div>

          <div className="bg-success/5 rounded-lg p-4 border border-success/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-success">Predicted Profit</span>
              <Icon name="DollarSign" size={16} className="text-success" />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(currentPrediction?.profit?.value)}
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-success">+{currentPrediction?.profit?.growth}%</span>
                <span className="text-xs text-muted-foreground">
                  {currentPrediction?.profit?.confidence}% confidence
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* AI Recommendations */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">AI Recommendations</h3>
            <p className="text-sm text-muted-foreground">Actionable insights to improve performance</p>
          </div>
          <Button variant="outline" size="sm">
            <Icon name="RefreshCw" size={16} />
            Refresh Insights
          </Button>
        </div>

        <div className="space-y-4">
          {recommendations?.map((rec) => (
            <div key={rec?.id} className="bg-muted/50 rounded-lg p-4 border border-border">
              <div className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${rec?.color} bg-current/10`}>
                  <Icon name={rec?.icon} size={20} className={rec?.color} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-foreground">{rec?.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec?.priority)}`}>
                      {rec?.priority?.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{rec?.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-success">{rec?.impact}</span>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictiveInsights;