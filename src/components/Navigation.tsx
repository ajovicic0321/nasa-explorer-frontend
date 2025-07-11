import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Rocket, Menu, X, Home, Camera, Globe, Search, Satellite, LucideIcon } from 'lucide-react'

// Component props
export interface NavigationProps {
  className?: string
  style?: React.CSSProperties
}

interface NavItem {
  path: string
  label: string
  icon: LucideIcon
}

const Navigation: React.FC<NavigationProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [scrolled, setScrolled] = useState<boolean>(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems: NavItem[] = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/apod', label: 'APOD', icon: Camera },
    { path: '/mars', label: 'Mars', icon: Globe },
    { path: '/search', label: 'Search', icon: Search },
    { path: '/asteroids', label: 'Asteroids', icon: Satellite },
  ]

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header
      className={`
        fixed top-0 w-full z-50 transition-all duration-300
        bg-space-dark/95 backdrop-blur-lg border-b border-white/10
        ${scrolled ? 'bg-space-dark/98 shadow-space' : ''}
      `}
    >
      <div className='container'>
        <nav className='flex justify-between items-center py-4'>
          <Link
            to='/'
            className='flex items-center gap-2 text-2xl font-bold text-gradient-cyan-orange no-underline transition-transform duration-300 hover:scale-105'
          >
            <Rocket className='text-space-cyan' />
            NASA Explorer
          </Link>

          {/* Desktop Navigation */}
          <ul className='hidden md:flex list-none gap-8 m-0 p-0'>
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center gap-2 text-white no-underline transition-all duration-300
                      font-medium relative px-4 py-2 rounded-full
                      hover:text-space-cyan hover:bg-space-cyan/10
                      ${location.pathname === item.path ? 'text-space-cyan bg-space-cyan/15' : ''}
                    `}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Mobile Menu Button */}
          <button
            className='md:hidden bg-transparent border-none text-white cursor-pointer p-2 rounded-lg transition-all duration-300 hover:bg-white/10 hover:text-space-cyan'
            onClick={toggleMenu}
            aria-label='Toggle menu'
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className='md:hidden absolute top-full left-0 right-0 bg-space-dark/98 backdrop-blur-lg border-t border-white/10 py-4'>
            <ul className='list-none m-0 p-0'>
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`
                        flex items-center gap-3 text-white no-underline px-4 py-3 transition-all duration-300
                        font-medium border-l-4 border-transparent
                        hover:bg-space-cyan/10 hover:text-space-cyan hover:border-space-cyan
                        ${location.pathname === item.path ? 'bg-space-cyan/15 text-space-cyan border-space-cyan' : ''}
                      `}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon size={20} />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navigation
