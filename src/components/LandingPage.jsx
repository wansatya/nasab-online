// src/components/LandingPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, GitMerge, Shield, Upload, Zap, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function LandingPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('features');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
                Discover Your Family Story
              </h1>
              <p className="text-blue-100 text-xl mt-4 max-w-lg">
                Create, visualize, and share your family tree. Connect with relatives and preserve your family history for generations to come.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                {currentUser ? (
                  <Link
                    to="/dashboard"
                    className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition"
                  >
                    Get Started
                  </Link>
                )}
                <button
                  onClick={() => {
                    const demoSection = document.getElementById('demo');
                    demoSection.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                >
                  See Demo
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Family tree illustration */}
                <div className="relative bg-white rounded-lg shadow-xl p-4 transform rotate-3">
                  <div className="w-full aspect-[4/3] bg-gray-100 rounded flex items-center justify-center">
                    <Users size={64} className="text-blue-400" />
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="h-4 bg-blue-100 rounded"></div>
                    <div className="h-4 bg-blue-200 rounded"></div>
                    <div className="h-4 bg-blue-300 rounded"></div>
                    <div className="h-4 bg-pink-100 rounded col-span-2"></div>
                    <div className="h-4 bg-blue-200 rounded"></div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 bg-yellow-400 rounded-full w-24 h-24 flex items-center justify-center p-4 shadow-lg transform rotate-12">
                  <span className="text-sm font-bold text-center text-yellow-900">Preserve Your Heritage</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900">Powerful Family Tree Tools</h2>
          <p className="text-xl text-gray-600 text-center mt-4 mb-12 max-w-3xl mx-auto">
            Everything you need to build, visualize, and share your family history
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Intuitive Tree Building
              </h3>
              <p className="text-gray-600">
                Create your family tree with an easy-to-use interface. Add family members, relationships, and key life events.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start">
              <div className="p-3 bg-green-100 text-green-600 rounded-lg mb-4">
                <GitMerge size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Cross-Tree Linking
              </h3>
              <p className="text-gray-600">
                Automatically connect with relatives working on overlapping branches. Share and synchronize information across trees.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg mb-4">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Secure & Private
              </h3>
              <p className="text-gray-600">
                Your family history is important. We use Google authentication and secure cloud storage to protect your data.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start">
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg mb-4">
                <Upload size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Rich Profiles
              </h3>
              <p className="text-gray-600">
                Capture the full story with detailed profiles including important dates, locations, and personal notes.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start">
              <div className="p-3 bg-red-100 text-red-600 rounded-lg mb-4">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Interactive Visualization
              </h3>
              <p className="text-gray-600">
                Explore your family connections with our interactive tree visualization. Zoom, pan, and navigate with ease.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg mb-4">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Collaborative Research
              </h3>
              <p className="text-gray-600">
                Work with family members to fill in gaps and discover your shared history together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      {/* <section id="demo" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900">See It In Action</h2>
          <p className="text-xl text-gray-600 text-center mt-4 mb-12 max-w-3xl mx-auto">
            Watch how easy it is to build and explore your family tree
          </p>

          <div className="max-w-4xl mx-auto bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
            <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-blue-700 to-indigo-900 p-8 text-center">
              <div>
                <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-16 border-l-blue-600 border-b-8 border-b-transparent ml-1"></div>
                </div>
                <p className="text-white text-xl font-medium">Demo Video: Building Your First Family Tree</p>
                <p className="text-blue-200 mt-2">Click to watch how to create, edit, and share your family tree</p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Demo Section */}
      <section id="demo" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900">See It In Action</h2>
          <p className="text-xl text-gray-600 text-center mt-4 mb-12 max-w-3xl mx-auto">
            Explore our traditional family tree visualization
          </p>

          <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 mb-12">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Traditional Family Tree Layout</h3>

              {/* Sample family tree visualization */}
              <div className="bg-gray-50 p-8 rounded-lg">
                <div className="w-full h-96 relative">
                  {/* Grandparents level */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-0 flex space-x-12">
                    {/* Grandmother */}
                    <div className="w-32 h-20 bg-pink-100 border border-pink-300 rounded-md flex flex-col items-center justify-center text-center">
                      <div className="font-medium text-sm">Sarah Johnson</div>
                      <div className="text-xs text-gray-500">1945-2015</div>
                    </div>

                    {/* Grandfather */}
                    <div className="w-32 h-20 bg-blue-100 border border-blue-300 rounded-md flex flex-col items-center justify-center text-center">
                      <div className="font-medium text-sm">Robert Johnson</div>
                      <div className="text-xs text-gray-500">1940-2010</div>
                    </div>
                  </div>

                  {/* Connecting lines from grandparents to parents */}
                  <div className="absolute left-1/2 top-20 w-0.5 h-12 bg-gray-400"></div>

                  {/* Parents level */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-32 flex space-x-12">
                    {/* Mother */}
                    <div className="w-32 h-20 bg-pink-100 border border-pink-300 rounded-md flex flex-col items-center justify-center text-center">
                      <div className="font-medium text-sm">Mary Johnson</div>
                      <div className="text-xs text-gray-500">1970</div>
                    </div>

                    {/* Father */}
                    <div className="w-32 h-20 bg-blue-100 border border-blue-300 rounded-md flex flex-col items-center justify-center text-center">
                      <div className="font-medium text-sm">John Smith</div>
                      <div className="text-xs text-gray-500">1968</div>
                    </div>
                  </div>

                  {/* Connecting lines from parents to children */}
                  <div className="absolute left-1/2 top-52 w-0.5 h-12 bg-gray-400"></div>

                  {/* Horizontal line for children */}
                  <div className="absolute left-1/3 top-64 w-1/3 h-0.5 bg-gray-400"></div>

                  {/* Vertical lines to each child */}
                  <div className="absolute left-1/3 top-64 w-0.5 h-8 bg-gray-400"></div>
                  <div className="absolute left-1/2 top-64 w-0.5 h-8 bg-gray-400"></div>
                  <div className="absolute left-2/3 top-64 w-0.5 h-8 bg-gray-400"></div>

                  {/* Children level */}
                  <div className="absolute top-72 left-0 right-0 flex justify-center space-x-12">
                    {/* Child 1 */}
                    <div className="w-32 h-20 bg-pink-100 border border-pink-300 rounded-md flex flex-col items-center justify-center text-center">
                      <div className="font-medium text-sm">Emma Smith</div>
                      <div className="text-xs text-gray-500">1995</div>
                    </div>

                    {/* Child 2 */}
                    <div className="w-32 h-20 bg-blue-100 border border-blue-300 rounded-md flex flex-col items-center justify-center text-center">
                      <div className="font-medium text-sm">Michael Smith</div>
                      <div className="text-xs text-gray-500">1998</div>
                    </div>

                    {/* Child 3 */}
                    <div className="w-32 h-20 bg-pink-100 border border-pink-300 rounded-md flex flex-col items-center justify-center text-center">
                      <div className="font-medium text-sm">Sophia Smith</div>
                      <div className="text-xs text-gray-500">2002</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-t border-gray-200 p-6">
              <h4 className="font-medium text-gray-900 mb-2">Key Features:</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Parents displayed side-by-side on the same level
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Clear 90-degree connection lines
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Color-coded nodes by gender
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Children inherit from both parents
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Siblings displayed at the same level
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Birth locations and dates shown
                </li>
              </ul>
            </div>
          </div>

          {/* <div className="text-center">
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Start Building Your Family Tree
            </Link>
          </div> */}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900">What Our Users Say</h2>
          <p className="text-xl text-gray-600 text-center mt-4 mb-12 max-w-3xl mx-auto">
            Join thousands of families preserving their heritage
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-xl">
                  JD
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">John Doe</h4>
                  <p className="text-gray-500">Family Historian</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I've been researching my family history for years, and this tool has made it so much easier to organize and visualize the connections. The cross-tree linking feature helped me connect with distant relatives!"
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold text-xl">
                  MS
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">Maria Smith</h4>
                  <p className="text-gray-500">Genealogy Enthusiast</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The interface is so intuitive and user-friendly. I was able to build my entire family tree in just a weekend. Being able to sync information across trees has been invaluable for our extended family."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-xl">
                  RJ
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">Robert Johnson</h4>
                  <p className="text-gray-500">Family Reunion Organizer</p>
                </div>
              </div>
              <p className="text-gray-600">
                "We used this platform to prepare for our family reunion, and it was a hit! Everyone loved seeing the connections, and we discovered relatives we didn't even know about. Highly recommended for any family."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Start Building Your Family Tree Today</h2>
          <p className="text-xl text-blue-100 mt-4 mb-8 max-w-2xl mx-auto">
            Join thousands of families who are preserving their history and connecting with relatives. It's free to get started!
          </p>
          <Link
            to="/dashboard"
            className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition text-lg"
          >
            Create Your Family Tree
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          {/* <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-white">Nasab Online</h2>
              <p className="mt-2">Discover, connect, preserve.</p>
            </div>
            <div className="flex flex-wrap gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition">Features</a></li>
                  <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition">About</a></li>
                  <li><a href="#" className="hover:text-white transition">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition">Terms</a></li>
                  <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div> */}
          <div className="mt-0 pt-0 text-center">
            <p>&copy; {new Date().getFullYear()} Nasab Online. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;