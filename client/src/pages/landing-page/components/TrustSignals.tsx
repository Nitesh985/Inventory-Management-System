import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals: React.FC = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h3 className="text-2xl font-semibold text-foreground mb-6">Trusted by small businesses</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
            <Icon name="Shield" size={20} />
          </div>
          <div>
            <p className="font-medium text-foreground">Encrypted & Secure</p>
            <p className="text-sm text-muted-foreground">Data encrypted at rest and in transit.</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
            <Icon name="Cloud" size={20} />
          </div>
          <div>
            <p className="font-medium text-foreground">Cloud Backup</p>
            <p className="text-sm text-muted-foreground">Automatic daily backups to keep your data safe.</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
            <Icon name="ShieldCheck" size={20} />
          </div>
          <div>
            <p className="font-medium text-foreground">Compliance Ready</p>
            <p className="text-sm text-muted-foreground">Built with privacy and compliance best practices.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSignals;
