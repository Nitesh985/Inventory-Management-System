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
  <div className="group relative bg-white border border-gray-200 rounded-2xl p-6 h-full hover:shadow-2xl hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    <div className="relative">
      <div className="flex items-center mb-4">
        <img
        src={testimonial.avatar}
        alt={testimonial.alt}
        className="w-12 h-12 rounded-full mr-4 border-2 border-blue-200 group-hover:border-blue-400 transition-colors"
        loading="lazy" />

        <div>
          <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
          <p className="text-xs text-gray-600">
            {testimonial.role}
          </p>
        </div>
      </div>
      <div className="flex mb-3">
        {[...Array(testimonial.rating)].map((_, i) =>
      <Icon key={i} name="Star" size={16} className="text-yellow-400 fill-current" />
      )}
      </div>
      <p className="text-gray-600 text-sm leading-relaxed font-medium">"{testimonial.message}"</p>
    </div>
  </div>;


  return (
    <section className={`py-12 sm:py-16 md:py-24 px-3 sm:px-4 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center bg-green-100 text-green-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm md:text-base font-bold mb-4 sm:mb-6 border border-green-200">
            <span className="text-base mr-2">🏆</span>
            Trusted & Loved
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-3 sm:mb-4">
            Join Thousands of
            <span className="block bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Successful Businesses
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-3xl mx-auto font-medium px-2">
            Real business owners sharing their success stories with Digital Khata.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-12 sm:mb-14 md:mb-16">
          {statistics.map((stat, index) =>
          <div key={index} className="group bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-lg sm:rounded-2xl p-4 sm:p-6 text-center hover:shadow-xl hover:border-blue-400 transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                <Icon name={stat.icon} size={18} className="text-white sm:hidden" />
                <Icon name={stat.icon} size={24} className="text-white hidden sm:block" />
              </div>
              <div className="text-lg sm:text-2xl md:text-3xl font-black text-gray-900 mb-0.5 sm:mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-700 font-semibold">{stat.label}</div>
            </div>
          )}
        </div>

        {/* Testimonials */}
        <div className="mb-12 sm:mb-14 md:mb-16">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-center mb-6 sm:mb-8 md:mb-10">
            What Users Say
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((testimonial) =>
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            )}
          </div>
        </div>

        {/* Business Success Stories */}
        <div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-center mb-6 sm:mb-8 md:mb-10">
            Success Stories
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {businessStories.map((story, index) =>
            <div key={index} className="group relative bg-white border border-gray-200 rounded-lg sm:rounded-2xl overflow-hidden hover:shadow-2xl hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative overflow-hidden h-40 sm:h-48">
                  <img
                  src={story.image}
                  alt={story.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-gray-900">{story.businessName}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 font-medium">{story.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{story.achievement}</div>
                      <div className="text-xs text-gray-600">{story.ownerName}</div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-xs sm:text-sm leading-relaxed font-medium">{story.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

};

export default SocialProof;