import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { Search, ShieldCheck, Timer, BarChart, Building, Users, Database, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const features = [
    {
      icon: <Search size={40} />,
      titleKey: "home.features.comprehensiveSearch.title",
      descriptionKey: "home.features.comprehensiveSearch.description",
      delay: "animate-delay-100",
    },
    {
      icon: <ShieldCheck size={40} />,
      titleKey: "home.features.secureReliable.title",
      descriptionKey: "home.features.secureReliable.description",
      delay: "animate-delay-200",
    },
    {
      icon: <Timer size={40} />,
      titleKey: "home.features.fastResults.title",
      descriptionKey: "home.features.fastResults.description",
      delay: "animate-delay-300",
    },
    {
      icon: <BarChart size={40} />,
      titleKey: "home.features.detailedAnalytics.title",
      descriptionKey: "home.features.detailedAnalytics.description",
      delay: "animate-delay-400",
    },
  ];

  const stats = [
    {
      icon: <Building size={32} />,
      value: "1M+",
      labelKey: "home.stats.properties",
      delay: "animate-delay-100",
    },
    {
      icon: <Users size={32} />,
      value: "50K+",
      labelKey: "home.stats.activeUsers",
      delay: "animate-delay-200",
    },
    {
      icon: <Database size={32} />,
      value: "4+",
      labelKey: "home.stats.databases",
      delay: "animate-delay-300",
    },
    {
      icon: <Globe size={32} />,
      value: "1+",
      labelKey: "home.stats.countries",
      delay: "animate-delay-400",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <div className="relative min-h-[80vh] overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3"
              alt="Modern building"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 hero-gradient opacity-90"></div>
          </div>
          <div className="relative z-10 container mx-auto px-6 flex items-center min-h-[80vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="animate-fade-in">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                  {t('home.hero.title')}
                </h1>
                <p className="text-lg md:text-xl text-white opacity-90 mb-8 max-w-lg">
                  {t('home.hero.description')}
                </p>
                <Button
                  size="lg"
                  onClick={() => navigate('/search')}
                  className="bg-black text-primary hover:bg-opacity-90"
                >
                  {t('home.hero.getStarted')}
                </Button>
              </div>
              {!isMobile && (
                <div className="hidden md:block animate-fade-in animate-delay-200">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-white/20 rounded-2xl blur-xl"></div>
                    <img
                      src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3"
                      alt="Modern building"
                      className="w-full h-auto rounded-xl shadow-2xl relative z-10"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
              <path
                fill="#f8fafc"
                fillOpacity="1"
                d="M0,64L60,64C120,64,240,64,360,74.7C480,85,600,107,720,112C840,117,960,107,1080,90.7C1200,75,1320,53,1380,42.7L1440,32L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
              ></path>
            </svg>
          </div>
        </div>
        {/* Features Section */}
        <section className="py-20 bg-estate-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">{t('home.features.title')}</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('home.features.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className={`feature-card animate-zoom-in ${feature.delay}`}>
                  <div className="text-secondary mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-center">{t(feature.titleKey)}</h3>
                  <p className="text-gray-600 text-center">{t(feature.descriptionKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className={`flex flex-col items-center animate-fade-in ${stat.delay}`}>
                  <div className="text-secondary mb-3">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">{stat.value}</div>
                  <div className="text-gray-600 text-center">{t(stat.labelKey)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 cta-gradient"></div>
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full"></div>
            <div className="absolute top-20 right-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
            <div className="absolute bottom-10 left-20 w-60 h-60 bg-white opacity-10 rounded-full"></div>
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{t('home.cta.title')}</h2>
              <p className="text-lg text-white opacity-90 mb-8">
                {t('home.cta.description')}
              </p>
              <Button
                size="lg"
                onClick={() => navigate('/search')}
                className="bg-black text-primary hover:bg-opacity-90"
              >
                {t('home.cta.button')}
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
