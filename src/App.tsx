import React, { useEffect, useRef } from 'react';
import { Play, Zap, Shield, Globe, Users, TrendingUp, Award } from 'lucide-react';

function App() {
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const heroButtonRef = useRef<HTMLButtonElement>(null);
  const featuresRef = useRef<HTMLDivElement[]>([]);
  const statsRef = useRef<HTMLDivElement[]>([]);

  // Utility function to create a delay promise
  const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  // Animation promise that resolves when animation completes
  const animateElement = (element: HTMLElement, animationClass: string): Promise<void> => {
    return new Promise((resolve) => {
      const handleAnimationEnd = () => {
        element.removeEventListener('animationend', handleAnimationEnd);
        resolve();
      };
      
      element.addEventListener('animationend', handleAnimationEnd);
      element.classList.add(animationClass);
    });
  };

  // Counter animation for stats
  const animateCounter = (element: HTMLElement, targetNumber: number): Promise<void> => {
    return new Promise((resolve) => {
      let current = 0;
      const increment = targetNumber / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= targetNumber) {
          current = targetNumber;
          clearInterval(timer);
          resolve();
        }
        element.textContent = Math.floor(current).toLocaleString();
      }, 30);
    });
  };

  // Main sequential animation function
  const runSequentialAnimations = async (): Promise<void> => {
    try {
      // Step 1: Hero title fades in
      if (heroTitleRef.current) {
        await animateElement(heroTitleRef.current, 'animate-fadeIn');
      }

      // Step 2: Small delay then subtitle slides in
      await delay(200);
      if (heroSubtitleRef.current) {
        await animateElement(heroSubtitleRef.current, 'animate-slideInLeft');
      }

      // Step 3: Button scales up
      await delay(300);
      if (heroButtonRef.current) {
        await animateElement(heroButtonRef.current, 'animate-scaleUp');
      }

      // Step 4: Feature cards slide in one by one
      await delay(500);
      for (let i = 0; i < featuresRef.current.length; i++) {
        const featureCard = featuresRef.current[i];
        if (featureCard) {
          await animateElement(featureCard, 'animate-slideInUp');
          await delay(150); // Small delay between each card
        }
      }

      // Step 5: Stats animate in with counters
      await delay(400);
      const statPromises = statsRef.current.map(async (stat, index) => {
        if (stat) {
          await animateElement(stat, 'animate-bounceIn');
          const counterElement = stat.querySelector('.counter');
          if (counterElement) {
            const targets = [10000, 500, 99, 24];
            await animateCounter(counterElement as HTMLElement, targets[index] || 100);
          }
        }
      });
      
      await Promise.all(statPromises);

    } catch (error) {
      console.error('Animation sequence failed:', error);
    }
  };

  useEffect(() => {
    // Start the animation sequence after component mounts
    const startAnimations = async () => {
      await delay(500); // Initial delay
      await runSequentialAnimations();
    };

    startAnimations();
  }, []);

  const addToFeatureRefs = (el: HTMLDivElement | null, index: number) => {
    if (el) {
      featuresRef.current[index] = el;
    }
  };

  const addToStatRefs = (el: HTMLDivElement | null, index: number) => {
    if (el) {
      statsRef.current[index] = el;
    }
  };

  const restartAnimations = async () => {
    // Reset all animations
    const allElements = [
      heroTitleRef.current,
      heroSubtitleRef.current,
      heroButtonRef.current,
      ...featuresRef.current,
      ...statsRef.current
    ];

    allElements.forEach(el => {
      if (el) {
        el.className = el.className.replace(/animate-\w+/g, '').trim();
        el.style.opacity = '0';
        el.style.transform = 'none';
      }
    });

    // Reset counters
    statsRef.current.forEach(stat => {
      const counter = stat?.querySelector('.counter');
      if (counter) {
        counter.textContent = '0';
      }
    });

    await delay(100);
    await runSequentialAnimations();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 
            ref={heroTitleRef}
            className="text-6xl md:text-7xl font-bold mb-6 opacity-0 bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent leading-tight"
          >
            Sequential Animations
          </h1>
          
          <p 
            ref={heroSubtitleRef}
            className="text-xl md:text-2xl text-gray-300 mb-8 opacity-0 max-w-2xl mx-auto leading-relaxed"
          >
            Experience the power of async/await patterns creating beautiful, orchestrated animations that flow in perfect sequence.
          </p>
          
          <button 
            ref={heroButtonRef}
            onClick={restartAnimations}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 opacity-0 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Play className="w-5 h-5" />
            Restart Animation
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-cyan-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-400 rounded-full opacity-10 animate-pulse delay-1000"></div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Lightning Fast", desc: "Optimized animations that run at 60fps for smooth performance." },
              { icon: Shield, title: "Rock Solid", desc: "Built with TypeScript and modern async patterns for reliability." },
              { icon: Globe, title: "Universal", desc: "Works seamlessly across all modern browsers and devices." }
            ].map((feature, index) => (
              <div
                key={index}
                ref={(el) => addToFeatureRefs(el, index)}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center opacity-0 hover:bg-white/15 transition-all duration-300 border border-white/20"
              >
                <feature.icon className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, label: "Active Users", suffix: "+" },
              { icon: TrendingUp, label: "Growth Rate", suffix: "%" },
              { icon: Award, label: "Satisfaction", suffix: "%" },
              { icon: Globe, label: "Countries", suffix: "" }
            ].map((stat, index) => (
              <div
                key={index}
                ref={(el) => addToStatRefs(el, index)}
                className="text-center opacity-0 bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-purple-400" />
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  <span className="counter">0</span>
                  <span>{stat.suffix}</span>
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-12 text-gray-400">
        <p>Built by chrisT</p>
      </footer>
    </div>
  );
}

export default App;