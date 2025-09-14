import React from 'react';
import { BookCopy, Twitter, Instagram, Linkedin, Facebook } from 'lucide-react';

export default function AestheticFooter() {
//   const socialLinks = [
//     { icon: Twitter, href: "#", name: "Twitter" },
//     { icon: Instagram, href: "#", name: "Instagram" },
//     { icon: Linkedin, href: "#", name: "LinkedIn" },
//     { icon: Facebook, href: "#", name: "Facebook" },
//   ];

  const footerSections = [
    {
      title: "Explore",
      links: [
        { name: "Subjects", href: "#" },
        { name: "Top Notes", href: "#" },
        { name: "Featured Sellers", href: "#" },
      ]
    },
    {
      title: "Sell",
      links: [
        { name: "Become a Seller", href: "#" },
        { name: "Seller Guidelines", href: "#" },
        { name: "Payouts", href: "#" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Contact Us", href: "#" },
      ]
    },
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* --- Main Footer Area --- */}
        <div className="py-16 grid lg:grid-cols-3 gap-12 text-slate-700 dark:text-slate-300">
          
          {/* 1. Branding Section (Left) */}
          <div className="lg:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4">
              {/* <BookCopy className="h-7 w-7 text-blue-500" /> */}
              <span className="text-2xl font-bold text-slate-900 dark:text-white">OnlyNotes</span>
            </a>
            <p className="max-w-xs text-sm text-slate-600 dark:text-slate-400 mb-6">
              The premier marketplace for student-curated knowledge and study materials.
            </p>
            {/* <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.name} 
                  href={social.href}
                  aria-label={social.name}
                  className="text-slate-500 hover:text-blue-500 dark:hover:text-white transition-colors duration-300"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div> */}
          </div>
          
          {/* 2. Links Section (Right) */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a 
                        href={link.href} 
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-white transition-colors duration-300"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        {/* --- Sub-Footer Area --- */}
        <div className="py-6 border-t border-slate-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center text-sm text-slate-500 dark:text-slate-400">
          <p>&copy; {new Date().getFullYear()} OnlyNotes, Inc. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</a>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
