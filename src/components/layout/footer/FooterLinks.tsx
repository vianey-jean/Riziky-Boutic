
import { Link } from 'react-router-dom';
import { getSecureRoute } from '@/services/secureIds';

const FooterLinks = () => {
  const links = [
    { to: "/notre-histoire", text: "Notre Histoire" },
    { to: "/faq", text: "FAQ" },
    { to: "/livraison", text: "Service Livraison" },
    { to: "/retours", text: "Sergvice Retours" },
    { to: "/contact", text: "Nous Contacter" }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold mb-3 text-white relative inline-block">
          Liens Utiles :
          <div className="absolute -bottom-1 left-0 w-10 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
        </h3>
      </div>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <Link 
              to={getSecureRoute(link.to)} 
              className="group flex items-center text-gray-300 hover:text-white transition-all duration-300 text-sm"
            >
              <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mr-2 transition-all duration-300 group-hover:scale-125"></div>
              <span className="relative">
                {link.text}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 group-hover:w-full"></div>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterLinks;
