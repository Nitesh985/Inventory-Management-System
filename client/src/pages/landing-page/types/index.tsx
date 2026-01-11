// Landing page TypeScript interfaces and types

export interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

export interface TestimonialProps {
  id: number;
  name: string;
  role: string;
  company: string;
  message: string;
  avatar: string;
  rating: number;
}

export interface StatisticProps {
  value: string;
  label: string;
  icon: string;
}

export interface BusinessStoryProps {
  businessName: string;
  ownerName: string;
  category: string;
  achievement: string;
  description: string;
  image: string;
  alt: string;
}

export interface HeroSectionProps {
  onGetStarted: () => void;
  onTryDemo: () => void;
}

export interface FeaturesShowcaseProps {
  className?: string;
}

export interface SocialProofProps {
  className?: string;
}

export interface TrustSignalsProps {
  className?: string;
}

export interface CallToActionProps {
  onGetStarted: () => void;
  onTryDemo: () => void;
  className?: string;
}