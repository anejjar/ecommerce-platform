'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

interface MenuItem {
  label: string;
  link: string;
  type?: string;
  openInNewTab?: boolean;
}

interface NavigationBarConfig {
  logo?: string;
  logoText?: string;
  showLogo?: boolean;
  menuItems?: MenuItem[];
  showCTA?: boolean;
  ctaText?: string;
  ctaLink?: string;
  backgroundColor?: string;
  textColor?: string;
  hoverColor?: string;
  sticky?: boolean;
  transparentOnTop?: boolean;
  mobileMenuStyle?: string;
}

export const NavigationBar: React.FC<{ config: NavigationBarConfig }> = ({ config }) => {
  const {
    logo,
    logoText = 'Your Brand',
    showLogo = true,
    menuItems = [],
    showCTA = false,
    ctaText = 'Get Started',
    ctaLink = '/signup',
    backgroundColor = '#ffffff',
    textColor = '#111827',
    hoverColor = '#3b82f6',
    sticky = true,
    mobileMenuStyle = 'hamburger',
  } = config;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav
      className={`w-full ${sticky ? 'sticky top-0 z-50' : ''}`}
      style={{ backgroundColor, color: textColor }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          {showLogo && (
            <Link href="/" className="flex items-center space-x-2">
              {logo ? (
                <Image
                  src={logo}
                  alt={logoText}
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                />
              ) : (
                <span className="text-xl font-bold" style={{ color: textColor }}>
                  {logoText}
                </span>
              )}
            </Link>
          )}

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                target={item.openInNewTab ? '_blank' : undefined}
                rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                className="text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: textColor }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = hoverColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = textColor;
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          {showCTA && (
            <div className="hidden md:block">
              <Link
                href={ctaLink}
                className="px-4 py-2 rounded-lg font-medium transition-all"
                style={{
                  backgroundColor: hoverColor,
                  color: '#ffffff',
                }}
              >
                {ctaText}
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: textColor }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden ${mobileMenuStyle === 'fullscreen' ? 'fixed inset-0 bg-white z-50' : 'py-4'}`}
            style={{ backgroundColor }}
          >
            <div className="flex flex-col space-y-4 px-4">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.link}
                  target={item.openInNewTab ? '_blank' : undefined}
                  rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                  className="text-base font-medium py-2"
                  style={{ color: textColor }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {showCTA && (
                <Link
                  href={ctaLink}
                  className="px-4 py-2 rounded-lg font-medium text-center"
                  style={{
                    backgroundColor: hoverColor,
                    color: '#ffffff',
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {ctaText}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

