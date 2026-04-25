import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Landing/Navbar';
import Hero from '@/Components/Landing/Hero';
import TrustedBy from '@/Components/Landing/TrustedBy';
import Features from '@/Components/Landing/Features';
import Stats from '@/Components/Landing/Stats';
import HowItWorks from '@/Components/Landing/HowItWorks';
import UseCases from '@/Components/Landing/UseCases';
import Benefits from '@/Components/Landing/Benefits';
import Screenshots from '@/Components/Landing/Screenshots';
import Pricing from '@/Components/Landing/Pricing';
import Integrations from '@/Components/Landing/Integrations';
import Testimonials from '@/Components/Landing/Testimonials';
import FAQ from '@/Components/Landing/FAQ';
import CTASection from '@/Components/Landing/CTASection';
import Footer from '@/Components/Landing/Footer';

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900 scroll-smooth">
            <Head title="Sikawan - Sistem Presensi Biometrik Wajah AI" />
            
            <Navbar auth={auth} />
            
            <main>
                <Hero auth={auth} />
                <TrustedBy />
                <Features />
                <Stats />
                <HowItWorks />
                <Benefits />
                <Screenshots />
                <UseCases />
                <Pricing />
                <Integrations />
                <Testimonials />
                <FAQ />
                <CTASection auth={auth} />
            </main>

            <Footer />
            
            {/* Version Footer */}
            <div className="bg-slate-50 py-6 text-center text-xs text-slate-400 border-t border-slate-100 font-medium">
                Sikawan &copy; 2026 &bull; Laravel v{laravelVersion} (PHP v{phpVersion})
            </div>
        </div>
    );
}
