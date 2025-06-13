import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Shield, TrendingUp, Zap } from 'lucide-react';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
              Rent What You Need, <br className="hidden sm:block" />
              Share What You Don't
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              The affordable marketplace for students and bachelors across India to rent and share expensive items locally.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/browse" className="btn bg-white text-primary-600 hover:bg-primary-50 hover:text-primary-700">
                Browse Items
              </Link>
              <Link to="/signup" className="btn bg-accent-500 text-white hover:bg-accent-600">
                Start Sharing
              </Link>
            </div>
          </div>
        </div>
        
        {/* Hero Stats */}
        <div className="container-custom mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <p className="text-3xl font-bold">5000+</p>
              <p className="text-white/80">Items Available</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <p className="text-3xl font-bold">50+</p>
              <p className="text-white/80">Cities Covered</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <p className="text-3xl font-bold">10000+</p>
              <p className="text-white/80">Happy Users</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              RentMate makes it easy to find what you need and earn from what you don't use.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="text-primary-500 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Safe & Secure</h3>
              <p className="text-slate-600">
                Verified profiles, secure payments, and community reviews for peace of mind.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="text-primary-500 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Quick & Easy</h3>
              <p className="text-slate-600">
                List items in minutes, find and rent what you need with just a few clicks.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="text-primary-500 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Save & Earn</h3>
              <p className="text-slate-600">
                Save money by renting, earn passive income from your unused possessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Popular Categories</h2>
            <Link to="/browse" className="text-primary-500 hover:text-primary-600 flex items-center">
              View All
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Category 1 */}
            <Link to="/browse?category=electronics" className="group">
              <div className="card aspect-square relative overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/1704854/pexels-photo-1704854.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Electronics" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <h3 className="text-white font-semibold text-lg">Electronics</h3>
                </div>
              </div>
            </Link>
            
            {/* Category 2 */}
            <Link to="/browse?category=gaming" className="group">
              <div className="card aspect-square relative overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Gaming" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <h3 className="text-white font-semibold text-lg">Gaming</h3>
                </div>
              </div>
            </Link>
            
            {/* Category 3 */}
            <Link to="/browse?category=furniture" className="group">
              <div className="card aspect-square relative overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/6208087/pexels-photo-6208087.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Furniture" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <h3 className="text-white font-semibold text-lg">Furniture</h3>
                </div>
              </div>
            </Link>
            
            {/* Category 4 */}
            <Link to="/browse?category=books" className="group">
              <div className="card aspect-square relative overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/3747468/pexels-photo-3747468.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Books" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <h3 className="text-white font-semibold text-lg">Books</h3>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Join thousands of students who are already saving money and making extra income.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200" 
                    alt="User" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Rahul Singh</h4>
                  <p className="text-sm text-slate-500">Delhi University</p>
                </div>
              </div>
              <p className="text-slate-600">
                "RentMate helped me rent a DSLR camera for my college project. Saved me a ton of money instead of buying one!"
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200" 
                    alt="User" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Priya Sharma</h4>
                  <p className="text-sm text-slate-500">IIT Bombay</p>
                </div>
              </div>
              <p className="text-slate-600">
                "I'm earning ₹5000 monthly by renting out my iPad and gaming console when I'm not using them. Amazing platform!"
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=200" 
                    alt="User" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Vikram Patel</h4>
                  <p className="text-sm text-slate-500">Anna University</p>
                </div>
              </div>
              <p className="text-slate-600">
                "Found an affordable road bike for my weekend trips. The owner was friendly and the process was super smooth."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-500 text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Start Sharing?</h2>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Join our community of renters and earn extra money from your unused items.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup" className="btn bg-white text-primary-600 hover:bg-primary-50">
                Sign Up Free
              </Link>
              <Link to="/contact" className="btn border border-white text-white hover:bg-white/10">
                <MessageCircle size={18} className="mr-2" />
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;