import React, { useContext } from 'react';
import Search from '../common/Search';
import ThemeToggle from '../common/ThemeToggle';
import { ThemeContext } from '../pages/ThemeContext'; // Import ThemeContext

const Header = () => {
  const { theme } = useContext(ThemeContext); // Access theme value

  return (
    <div className={`flex justify-between ${theme === 'dark' ? 'dark:bg-gray-800' : 'bg-[#F4F6F8]'} px-9 py-2 sticky top-0 z-50`}>
      <img src="/public/mi-logo.d4033a8a174c24599de7608efb3230a5.svg" alt="logo" />
      <div className='flex gap-3 justify-center items-center'>
        <Search />
        <ThemeToggle />
      </div>
    </div>
  );
}

export default Header;
