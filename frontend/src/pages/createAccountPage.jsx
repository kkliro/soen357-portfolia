import { UserIcon, MailIcon, LockClosedIcon } from '@heroicons/react/24/solid';

export default function CreateAccountPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Sign Up</h2>
        
        <form className="space-y-6">

          <div className="relative">
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">Full Name</label>
            <div className="mt-1 flex items-center border-b border-gray-300">
              <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
              <input
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                className="w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
            <div className="mt-1 flex items-center border-b border-gray-300">
              <MailIcon className="h-5 w-5 text-gray-400 mr-3" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                className="w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
            <div className="mt-1 flex items-center border-b border-gray-300">
              <LockClosedIcon className="h-5 w-5 text-gray-400 mr-3" />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="********"
                className="w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-indigo-600 hover:text-indigo-800">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}
