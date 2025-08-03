import React from 'react'

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full text-gray-500">
      <div className="w-full h-px bg-gray-500/30 mb-0 mt-10"></div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-10 border-b border-gray-500/30 pb-6">
        {/* ← Replace this block: */}
        <div className="md:max-w-96 flex flex-col items-start">
          {/* Your logo */}
          <img
            src="/main_logo.png"
            alt="CineXpress Logo"
            className="w-50 h-auto block"
          />

          {/* Your description text */}
          <p className="text-sm">
            Book your tickets at CineXpress for the latest blockbusters,
            exclusive screenings, and seamless mobile booking. Your cinema
            experience—upgraded.
          </p>
        </div>
        {/* ← End replacement */}

        <div className="flex-1 flex items-start md:justify-end gap-20">
          <div>
            <h2 className="font-semibold mb-5 text-gray-800">Company</h2>
            <ul className="text-sm space-y-2">
              <li><a href="#">Home</a></li>
              <li><a href="#">About us</a></li>
              <li><a href="#">Contact us</a></li>
              <li><a href="#">Privacy policy</a></li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-5 text-gray-800">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>+91-7018273501</p>
              <p>rishabh17garg2004@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      <p className="pt-4 text-center text-xs md:text-sm pb-5">
        Copyright 2024 © CineXpress. All Rights Reserved.
      </p>
    </footer>
  )
}

export default Footer
