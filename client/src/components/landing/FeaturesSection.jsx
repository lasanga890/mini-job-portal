
import React from 'react';
import Card from '../common/Card';

const features = [
  {
    title: "Seamless Applications",
    description: "Apply to multiple jobs with a single click using your stored profile.",
    icon: "🚀"
  },
  {
    title: "Smart Matching",
    description: "Our algorithm connects you with jobs that perfectly match your skills.",
    icon: "🎯"
  },
  {
    title: "Real-time Alerts",
    description: "Get notified instantly when new opportunities arise.",
    icon: "🔔"
  },
  {
    title: "Verified Employers",
    description: "Connect with legitimate companies and avoid scams.",
    icon: "✅"
  }
];

const FeaturesSection = () => {
  return (
    <div className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-text-main sm:text-4xl">
            Why Choose Us?
          </h2>
          <p className="mt-4 text-lg text-text-dim">
            Everything you need to find your next career move.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
            <Card key={index} className="p-8 hover:bg-card-hover transition-colors">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-text-main mb-2">{feature.title}</h3>
              <p className="text-text-dim">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
