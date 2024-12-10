import {NavLink} from '@remix-run/react';
import {HeaderQuery} from 'storefrontapi.generated';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from 'react-icons/fa';

interface FooterProps {
  header: HeaderQuery;
}

export const Footer: React.FC<FooterProps> = ({header}) => {
  const {menu} = header;
  const menuItems = Array.isArray(menu?.items) ? menu.items : [];

  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Company Branding */}
        <div className="flex flex-col items-start space-y-6">
          <h1 className="text-4xl font-extrabold text-blue-400">
            Fabric Elite
          </h1>
          {/* <p className="text-gray-400">Your trusted fabric specialists.</p> */}
        </div>

        {/* Contact Info */}
        <div className="flex flex-col space-y-6">
          <h3 className="text-xl font-semibold text-blue-400">Contact Us</h3>
          <p className="text-gray-400">
            <strong>Address:</strong> 123 Main Street, Suite 400, City, Country
          </p>
          <p className="text-gray-400">
            <strong>Phone:</strong> (123) 456-7890
          </p>
        </div>

        {/* Quick Links and Social Media */}
        <div className="flex flex-col row items-center md:items-start space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-blue-400 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-gray-400 hover:text-blue-400">
              {menuItems.map((item: any) => {
                const url = new URL(item.url).pathname;
                return (
                  <li key={item.id}>
                    <NavLink
                      to={url}
                      className="text-gray-400 hover:text-blue-400"
                      prefetch="intent"
                    >
                      {item.title}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="flex flex-col row items-center md:items-start space-y-6">
          {/* Social Media Icons */}
          <h3 className="text-xl font-semibold text-blue-400 mb-1">
            Social Media
          </h3>
          <div className="flex items-center space-x-2">
            <FaFacebookF className="text-gray-400 hover:text-blue-400" />
            <span className="text-gray-400 hover:text-blue-400">Facebook</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaInstagram className="text-gray-400 hover:text-blue-400" />
            <span className="text-gray-400 hover:text-blue-400">Instagram</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaTwitter className="text-gray-400 hover:text-blue-400" />
            <span className="text-gray-400 hover:text-blue-400">Twitter</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaLinkedinIn className="text-gray-400 hover:text-blue-400" />
            <span className="text-gray-400 hover:text-blue-400">LinkedIn</span>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-8 border-t border-gray-600 pt-4 text-center">
        <p className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Fabric Elite. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
