import React from 'react';
import Icon from '../../../components/AppIcon';
import { SocialProofProps, TestimonialProps, StatisticProps, BusinessStoryProps } from '../types';

const SocialProof = ({ className = '' }: SocialProofProps) => {
  const statistics: StatisticProps[] = [
  {
    value: '10,000+',
    label: 'Active Businesses',
    icon: 'Users'
  },
  {
    value: '₹50Cr+',
    label: 'Transactions Tracked',
    icon: 'TrendingUp'
  },
  {
    value: '99.9%',
    label: 'Uptime Guarantee',
    icon: 'Shield'
  },
  {
    value: '4.9/5',
    label: 'User Rating',
    icon: 'Star'
  }];


  const testimonials: TestimonialProps[] = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    role: 'Shop Owner',
    company: 'Kumar Electronics',
    message: 'Digital Khata transformed how I manage my electronics shop. The offline feature is a game-changer during power cuts. Sales tracking and inventory management have never been this easy.',
    avatar: "https://images.unsplash.com/photo-1574901200090-ca061722bdb9",
    alt: 'Rajesh Kumar, electronics shop owner wearing glasses and smiling',
    rating: 5
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Boutique Owner',
    company: 'Elegant Fashion',
    message: 'The AI insights helped me understand which designs sell best. Customer management features keep track of preferences. My boutique revenue increased by 40% in 6 months.',
    avatar: "https://images.unsplash.com/photo-1612684352323-b79cfec32b7a",
    alt: 'Priya Sharma, boutique owner in traditional Indian attire smiling confidently',
    rating: 5
  },
  {
    id: 3,
    name: 'Mohammed Ali',
    role: 'Restaurant Owner',
    company: 'Spice Garden',
    message: 'Managing inventory for my restaurant was chaotic before Digital Khata. Now I track ingredients, predict demand, and control costs. The expense tracking saves me hours every week.',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_158585551-1763292628455.png",
    alt: 'Mohammed Ali, restaurant owner in chef attire standing in his kitchen',
    rating: 5
  }];


  const businessStories: BusinessStoryProps[] = [
  {
    businessName: 'Tech Mobile Hub',
    ownerName: 'Amit Patel',
    category: 'Mobile Accessories',
    achievement: '300% Revenue Growth',
    description: 'Scaled from single shop to 3 locations using Digital Khata\'s multi-location inventory management and sales analytics.',
    image: "https://images.unsplash.com/photo-1681008195107-92c82cb1c38f",
    alt: 'Modern mobile phone accessories shop with organized display cases and bright lighting'
  },
  {
    businessName: 'Fresh Mart Grocery',
    ownerName: 'Sunita Devi',
    category: 'Grocery Store',
    achievement: 'Zero Stock-Outs',
    description: 'Smart inventory alerts and supplier management eliminated stock-outs completely. Customer satisfaction increased dramatically.',
    image: "https://images.unsplash.com/photo-1721173841073-8fb97b4a30d4",
    alt: 'Well-organized grocery store with fresh produce displays and systematic shelving'
  }];


  const TestimonialCard = ({ testimonial }: {testimonial: TestimonialProps;}) =>
  <div className="bg-muted/30 rounded-lg p-6 h-full">
      <div className="flex items-center mb-4">
        <img
        src={testimonial.avatar}
        alt={testimonial.alt}
        className="w-12 h-12 rounded-full mr-4"
        loading="lazy" />

        <div>
          <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
          <p className="text-sm text-muted-foreground">
            {testimonial.role}, {testimonial.company}
          </p>
        </div>
      </div>
      <div className="flex mb-3">
        {[...Array(testimonial.rating)].map((_, i) =>
      <Icon key={i} name="Star" size={16} className="text-warning fill-current" />
      )}
      </div>
      <p className="text-muted-foreground leading-relaxed">"{testimonial.message}"</p>
    </div>;


  return (
    <section className={`py-20 px-4 bg-muted/10 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium mb-4">
            <Icon name="TrendingUp" size={16} className="mr-2" />
            Trusted by Thousands
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Real Businesses,
            <br />
            <span className="text-primary">Real Success Stories</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of business owners who have transformed their operations with Digital Khata.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {statistics.map((stat, index) =>
          <div key={index} className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name={stat.icon} size={24} className="text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          )}
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-foreground text-center mb-12">
            What Our Users Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) =>
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            )}
          </div>
        </div>

        {/* Business Success Stories */}
        <div>
          <h3 className="text-2xl font-bold text-foreground text-center mb-12">
            Business Success Stories
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {businessStories.map((story, index) =>
            <div key={index} className="bg-background rounded-lg overflow-hidden shadow-sm border">
                <img
                src={story.image}
                alt={story.alt}
                className="w-full h-48 object-cover"
                loading="lazy" />

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-semibold text-foreground">{story.businessName}</h4>
                      <p className="text-muted-foreground">{story.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-success">{story.achievement}</div>
                      <div className="text-sm text-muted-foreground">by {story.ownerName}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{story.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

};

export default SocialProof;