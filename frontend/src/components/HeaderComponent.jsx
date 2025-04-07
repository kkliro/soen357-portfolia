import logo from '../assets/logo.png';

export default function HeaderComponent() {
    
    const navigation = [
      { name: 'Home', href: '#', current: true },
      {name: 'Markets', href: '#', current: false },
      { name: 'About', href: '#', current: false },
      { name: 'Login', href: '#', current: false },
    ];
  
    return (
      <nav className="bg-neutral-800 w-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            {/* Logo */}
            <div className="flex items-center">
              <img
                alt="Portfolia Logo"
                src={logo}
                className="h-14 w-auto"
              />
              <span className="text-white text-2xl font-semibold ml-4">Portfolia</span>
            </div>
  
            {/* Nav */}
            <div className="hidden sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={`${
                      item.current
                        ? 'bg-indigo-900 text-white'
                        : 'text-white hover:bg-indigo-500 hover:text-white'
                    } rounded-md px-4 py-3 text-sm font-medium`}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }