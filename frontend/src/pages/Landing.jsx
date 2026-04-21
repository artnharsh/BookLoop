import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#f3f4f6] via-[#edf2f7] to-[#e5e7eb] text-gray-900">
      <div className="absolute -top-20 -left-16 w-80 h-80 rounded-full bg-brand-accent/15 blur-3xl" />
      <div className="absolute -bottom-20 -right-10 w-[26rem] h-[26rem] rounded-full bg-cyan-500/10 blur-3xl" />

      <header className="relative z-10 px-6 md:px-10 pt-6">
        <div className="max-w-7xl mx-auto glass-light rounded-full px-6 py-3 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
            <span className="text-brand-accent">✦</span>
            <span>BOOKLOOP</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-sm font-medium rounded-full border border-gray-200 bg-white/70 hover:bg-white transition-colors">
              Log In
            </Link>
            <Link to="/register" className="px-5 py-2 text-sm font-semibold rounded-full bg-gray-900 text-white hover:scale-105 transition-transform">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-[minmax(140px,auto)]">
          <section className="lg:col-span-8 rounded-[2rem] glass-light p-8 md:p-10 flex flex-col justify-between min-h-[320px]">
            <div>
              <p className="inline-block px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-xs font-semibold mb-4">
                Student Marketplace
              </p>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] max-w-2xl">
                Buy, Sell, and Reuse Textbooks in One Trusted Campus Loop.
              </h1>
              <p className="mt-5 text-gray-600 text-base md:text-lg max-w-2xl">
                BookLoop helps students save money, avoid waste, and connect directly with peers for textbooks and study material.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="px-7 py-3 rounded-2xl font-bold bg-gray-900 text-white hover:scale-[1.02] transition-transform">
                Get Started
              </Link>
              <Link to="/login" className="px-7 py-3 rounded-2xl font-semibold border border-gray-200 bg-white/70 hover:bg-white transition-colors">
                I Already Have an Account
              </Link>
            </div>
          </section>

          <section className="lg:col-span-4 rounded-[2rem] glass-light p-6 min-h-[320px] flex flex-col justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Why Students Use It</p>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="p-3 rounded-xl bg-white/60 border border-gray-100">Find books by title, author, or course code quickly.</li>
                <li className="p-3 rounded-xl bg-white/60 border border-gray-100">Chat directly with sellers and follow up anytime.</li>
                <li className="p-3 rounded-xl bg-white/60 border border-gray-100">Save listings to wishlist and track what matters.</li>
              </ul>
            </div>
            <div className="mt-6 p-4 rounded-2xl bg-gray-900 text-white">
              <p className="text-xs uppercase tracking-wide text-white/70">Community Promise</p>
              <p className="text-sm mt-2">Verified college accounts. Real students. Safer exchanges.</p>
            </div>
          </section>

          <section className="lg:col-span-4 rounded-[2rem] glass-light p-6">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Smart Discovery</p>
            <h3 className="text-2xl font-bold mb-2">Search That Understands Campus Needs</h3>
            <p className="text-gray-600">Filter by condition, price range, and course relevance to find the best fit fast.</p>
          </section>

          <section className="lg:col-span-4 rounded-[2rem] glass-light p-6">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Built-in Chat</p>
            <h3 className="text-2xl font-bold mb-2">Mini WhatsApp-Style Follow-up</h3>
            <p className="text-gray-600">See old conversation threads, continue discussions, and coordinate handoffs smoothly.</p>
          </section>

          <section className="lg:col-span-4 rounded-[2rem] glass-light p-6">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Sustainable Loop</p>
            <h3 className="text-2xl font-bold mb-2">Reuse Books, Reduce Waste</h3>
            <p className="text-gray-600">Keep textbooks in circulation semester after semester while helping juniors save money.</p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Landing;
