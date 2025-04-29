import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  Search, ShieldCheck, Timer, BarChart, 
  Database, Globe, FileText, Lock,
  PieChart, MapPin, Building, Users 
} from 'lucide-react';
import '@/styles/features.css';

const Features = () => {
  const features = [
    {
      icon: <Search size={40} />,
      title: "Multi-Database Search",
      description: "Search across DORIS, DLR, CERSAI, and MCA21 databases simultaneously",
      category: "core"
    },
    {
      icon: <Timer size={40} />,
      title: "Real-Time Results",
      description: "Get instant property verification results and analyses",
      category: "core"
    },
    {
      icon: <ShieldCheck size={40} />,
      title: "Verified Data",
      description: "All information is sourced from official government databases",
      category: "core"
    },
    {
      icon: <BarChart size={40} />,
      title: "Risk Analysis",
      description: "Comprehensive risk assessment of property investments",
      category: "analysis"
    },
    {
      icon: <PieChart size={40} />,
      title: "Investment Scoring",
      description: "Get detailed investment potential scores for properties",
      category: "analysis"
    },
    {
      icon: <MapPin size={40} />,
      title: "Location Intelligence",
      description: "Analyze nearby amenities and neighborhood features",
      category: "analysis"
    },
    {
      icon: <FileText size={40} />,
      title: "PDF Reports",
      description: "Generate detailed PDF reports for property verification",
      category: "tools"
    },
    {
      icon: <Database size={40} />,
      title: "Save Searches",
      description: "Save and track your property searches",
      category: "tools"
    },
    {
      icon: <Lock size={40} />,
      title: "Secure Access",
      description: "Enterprise-grade security for your sensitive data",
      category: "security"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-primary to-secondary">
          <div className="container mx-auto px-6">
            <div className="text-center text-white">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Powerful Features for Property Verification
              </motion.h1>
              <motion.p 
                className="text-xl opacity-90 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Discover how our comprehensive suite of features helps you make informed property decisions
              </motion.p>
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4">Core Features</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Essential tools for comprehensive property verification
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.filter(f => f.category === "core").map((feature, index) => (
                <motion.div
                  key={index}
                  className="feature-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="text-secondary mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-center">{feature.title}</h3>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Analysis Tools */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4">Analysis Tools</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Advanced analytics for better decision making
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.filter(f => f.category === "analysis").map((feature, index) => (
                <motion.div
                  key={index}
                  className="feature-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="text-secondary mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-center">{feature.title}</h3>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Tools */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4">Additional Tools</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Supporting features to enhance your experience
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.filter(f => f.category === "tools" || f.category === "security").map((feature, index) => (
                <motion.div
                  key={index}
                  className="feature-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="text-secondary mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-center">{feature.title}</h3>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Features;