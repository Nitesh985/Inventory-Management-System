import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ReportGenerator = () => {
  const [reportConfig, setReportConfig] = useState({
    reportType: 'comprehensive',
    dateRange: 'last30days',
    startDate: '',
    endDate: '',
    categories: [],
    format: 'pdf',
    includeCharts: true,
    includePredictions: true,
    includeRecommendations: true
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [scheduledReports, setScheduledReports] = useState([
    {
      id: 1,
      name: 'Monthly Business Summary',
      type: 'comprehensive',
      frequency: 'monthly',
      nextRun: '2024-12-01',
      status: 'active',
      recipients: ['owner@business.com']
    },
    {
      id: 2,
      name: 'Weekly Sales Report',
      type: 'sales',
      frequency: 'weekly',
      nextRun: '2024-11-10',
      status: 'active',
      recipients: ['sales@business.com', 'manager@business.com']
    }
  ]);

  const reportTypes = [
    { value: 'comprehensive', label: 'Comprehensive Business Report' },
    { value: 'sales', label: 'Sales Performance Report' },
    { value: 'expenses', label: 'Expense Analysis Report' },
    { value: 'inventory', label: 'Inventory Status Report' },
    { value: 'predictions', label: 'AI Predictions Report' }
  ];

  const dateRangeOptions = [
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last3months', label: 'Last 3 Months' },
    { value: 'last6months', label: 'Last 6 Months' },
    { value: 'lastyear', label: 'Last Year' },
    { value: 'custom', label: 'Custom Date Range' }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF Document' },
    { value: 'excel', label: 'Excel Spreadsheet' },
    { value: 'csv', label: 'CSV Data' },
    { value: 'email', label: 'Email Summary' }
  ];

  const categoryOptions = [
    { value: 'sales', label: 'Sales Data' },
    { value: 'expenses', label: 'Expense Data' },
    { value: 'inventory', label: 'Inventory Data' },
    { value: 'customers', label: 'Customer Data' },
    { value: 'suppliers', label: 'Supplier Data' }
  ];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      // In real app, this would trigger download or email
      alert('Report generated successfully! Check your downloads folder.');
    }, 3000);
  };

  const handleConfigChange = (field, value) => {
    setReportConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryChange = (category, checked) => {
    setReportConfig(prev => ({
      ...prev,
      categories: checked 
        ? [...prev?.categories, category]
        : prev?.categories?.filter(c => c !== category)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="FileText" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Generate Custom Report</h3>
            <p className="text-sm text-muted-foreground">Create detailed business reports with AI insights</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Select
              label="Report Type"
              options={reportTypes}
              value={reportConfig?.reportType}
              onChange={(value) => handleConfigChange('reportType', value)}
            />

            <Select
              label="Date Range"
              options={dateRangeOptions}
              value={reportConfig?.dateRange}
              onChange={(value) => handleConfigChange('dateRange', value)}
            />

            {reportConfig?.dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  value={reportConfig?.startDate}
                  onChange={(e) => handleConfigChange('startDate', e?.target?.value)}
                />
                <Input
                  label="End Date"
                  type="date"
                  value={reportConfig?.endDate}
                  onChange={(e) => handleConfigChange('endDate', e?.target?.value)}
                />
              </div>
            )}

            <Select
              label="Export Format"
              options={formatOptions}
              value={reportConfig?.format}
              onChange={(value) => handleConfigChange('format', value)}
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Include Data Categories
              </label>
              <div className="space-y-2">
                {categoryOptions?.map((category) => (
                  <Checkbox
                    key={category?.value}
                    label={category?.label}
                    checked={reportConfig?.categories?.includes(category?.value)}
                    onChange={(e) => handleCategoryChange(category?.value, e?.target?.checked)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Report Options
              </label>
              <div className="space-y-2">
                <Checkbox
                  label="Include Charts and Graphs"
                  checked={reportConfig?.includeCharts}
                  onChange={(e) => handleConfigChange('includeCharts', e?.target?.checked)}
                />
                <Checkbox
                  label="Include AI Predictions"
                  checked={reportConfig?.includePredictions}
                  onChange={(e) => handleConfigChange('includePredictions', e?.target?.checked)}
                />
                <Checkbox
                  label="Include AI Recommendations"
                  checked={reportConfig?.includeRecommendations}
                  onChange={(e) => handleConfigChange('includeRecommendations', e?.target?.checked)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-border mt-6">
          <div className="text-sm text-muted-foreground">
            Report will include data from {reportConfig?.dateRange?.replace(/([A-Z])/g, ' $1')?.toLowerCase()}
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Icon name="Eye" size={16} />
              Preview
            </Button>
            <Button 
              onClick={handleGenerateReport}
              loading={isGenerating}
              iconName="Download"
              iconPosition="left"
            >
              {isGenerating ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>
        </div>
      </div>
      {/* Scheduled Reports */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Scheduled Reports</h3>
            <p className="text-sm text-muted-foreground">Automated report generation and delivery</p>
          </div>
          <Button variant="outline">
            <Icon name="Plus" size={16} />
            Schedule New Report
          </Button>
        </div>

        <div className="space-y-4">
          {scheduledReports?.map((report) => (
            <div key={report?.id} className="bg-muted/50 rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-foreground">{report?.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report?.status === 'active' ?'bg-success/10 text-success border border-success/20' :'bg-muted text-muted-foreground border border-border'
                    }`}>
                      {report?.status?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Icon name="Calendar" size={14} />
                      <span>Every {report?.frequency}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="Clock" size={14} />
                      <span>Next: {report?.nextRun}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="Mail" size={14} />
                      <span>{report?.recipients?.length} recipients</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Icon name="Edit" size={16} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Icon name="Play" size={16} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;