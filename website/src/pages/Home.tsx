import type { FC } from "react";
import { Link } from "react-router-dom";

const Home: FC = () => {
    return (
        <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                    Unlimited Planner
                </h1>
                <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto">
                    The ultimate tool for planning movie nights with friends. Find showtimes, coordinate schedules, and book tickets together.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                    <Link
                        to="/planners"
                        className="min-w-48 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                    >
                        Get Started
                    </Link>
                    <Link
                        to="/movies"
                        className="min-w-48 px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition"
                    >
                        Browse Movies
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-4xl font-bold text-white text-center mb-12">
                    Why Choose Unlimited Planner?
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="bg-slate-800 rounded-lg p-8 hover:bg-slate-700 transition">
                        <div className="text-4xl mb-4">🎬</div>
                        <h3 className="text-xl font-bold text-white mb-3">Browse Movies</h3>
                        <p className="text-slate-300">
                            Explore all current movies at Cinema City with detailed information, showtimes, and availability.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-slate-800 rounded-lg p-8 hover:bg-slate-700 transition">
                        <div className="text-4xl mb-4">📅</div>
                        <h3 className="text-xl font-bold text-white mb-3">Plan Together</h3>
                        <p className="text-slate-300">
                            Create movie planners and invite friends. Track availability and find the perfect time for everyone.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-slate-800 rounded-lg p-8 hover:bg-slate-700 transition">
                        <div className="text-4xl mb-4">🎟️</div>
                        <h3 className="text-xl font-bold text-white mb-3">Easy Booking</h3>
                        <p className="text-slate-300">
                            Select seats, coordinate with friends, and book tickets seamlessly all in one place.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-16 text-center">
                <div className="bg-blue-600 rounded-lg p-12">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to plan your next movie night?
                    </h2>
                    <p className="text-blue-100 mb-6 text-lg">
                        Create a planner now and invite your friends to coordinate the perfect cinema experience.
                    </p>
                    <Link
                        to="/planners"
                        className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
                    >
                        Create Planner
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default Home;