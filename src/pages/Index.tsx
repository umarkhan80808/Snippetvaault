import { Link } from 'react-router-dom';
import { Code2, Zap, Shield, Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';

const features = [
  { icon: Code2, title: 'Multi-Language Support', description: 'JavaScript, Python, Java, C++, and more with syntax highlighting.' },
  { icon: Search, title: 'Instant Search', description: 'Find any snippet instantly with powerful search and filters.' },
  { icon: Shield, title: 'Secure & Private', description: 'Your code is encrypted and only accessible to you.' },
  { icon: Zap, title: 'Lightning Fast', description: 'Optimized for speed. Access your snippets in milliseconds.' },
];

export default function Index() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="relative py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_50%)]" />
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
                <Zap className="h-4 w-4" /> Developer-first snippet manager
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display mb-6 leading-tight">
                Your Personal <span className="gradient-text">Code Sanctuary</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Save, organize, and reuse code snippets across multiple languages. Never lose a valuable piece of code again.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="hero-button text-lg h-14 px-8">
                  <Link to={user ? '/dashboard' : '/register'}>
                    Start Saving Snippets <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                {!user && (
                  <Button asChild variant="outline" size="lg" className="h-14 px-8">
                    <Link to="/login">Sign In</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border/50">
          <div className="container">
            <h2 className="text-3xl font-display text-center mb-12">Built for Developers</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <div key={i} className="p-6 rounded-2xl bg-card border border-border card-hover" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
