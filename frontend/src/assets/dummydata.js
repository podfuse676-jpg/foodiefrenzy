import { FaShippingFast, FaLeaf, FaHeart, FaAppleAlt } from 'react-icons/fa';
import { FaBolt, FaRegClock, FaCalendarCheck, FaFire } from 'react-icons/fa';
import { FaFacebook, FaInstagram, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import { FiUser, FiSmartphone, FiMail, FiHome } from 'react-icons/fi';
import { FaUtensils } from 'react-icons/fa';
import { GiChefToque, GiFoodTruck } from 'react-icons/gi';
import IA1 from './IA1.png';
import IA2 from './IA2.png';
import IA3 from './IA3.png';
import IA4 from './IA4.png';
import IA5 from './IA5.png';
import IA6 from './IA6.png';

import Kebab from "./Kebab.png";
import ChickenTikka from "./ChickenTikka.png";
import ChickenChargha from "./ChickenChargha.png";
import DesiChowmein from "./DesiChowmein.png";
import GulabJamun from "./GulabJamun.png";
import MasalaDosa from "./MasalaDosa.png";
import PaneerTikka from "./PannerTikka.png";
import PalakPaneer from "./PalakPaneer.png";

import BannerImage from "./BannerImage.png";
import Image1 from "./Image1.png";
import Image2 from "./Image2.png";
import Image3 from "./Image3.png";
import Image4 from "./Image4.png";
import Video from "./Video.mp4";

// ABOUT PAGE
export const features = [
    {
        id: 1,
        title: "Fast Delivery",
        text: "Quick grocery delivery in 30 minutes",
        icon: FaShippingFast, // store the component reference
        img: IA1,
    },
    {
        id: 2,
        title: "Fresh Produce",
        text: "Locally sourced fresh fruits and vegetables",
        icon: FaLeaf,
        img: IA2,
    },
    {
        id: 3,
        title: "Quality Products",
        text: "Premium quality groceries and essentials",
        icon: FaHeart,
        img: IA3,
    },
];

export const stats = [
    {
        number: '10M+',
        label: 'Orders',
        icon: GiFoodTruck,
        gradient: 'from-[#8BC34A] via-[#FFC107] to-[#8BC34A]',
    },
    {
        number: '98%',
        label: 'Satisfaction',
        icon: FaHeart,
        gradient: 'from-[#FFC107] via-[#8BC34A] to-[#FF9800]',
    },
    {
        number: '500+',
        label: 'Cities',
        icon: FaLeaf,
        gradient: 'from-[#8BC34A] via-[#7CB342] to-[#FFC107]',
    },
    {
        number: '24/7',
        label: 'Support',
        icon: FaRegClock,
        gradient: 'from-[#8BC34A] via-[#FFC107] to-[#FF9800]',
    },
];

// Placeholder for empty image
const emptyImage = '';

export const teamMembers = [
    {
        name: "Sarah Johnson",
        role: "Quality Assurance Manager",
        img: emptyImage,
        bio: "10+ years in grocery quality assurance",
        delay: 0.1,
        social: {
            twitter: "https://x.com/LAKESHORE_REAL_PAGE",
            instagram: "https://www.instagram.com/lakeshoreconvenience_1?igsh=MWpncGd3NHo3MzVzNA==",
            facebook: "https://www.facebook.com/p/Lakeshore-Convenience-Sylvan-61575180136680/",
            linkedin: "https://www.linkedin.com/company/LAKESHORE_REAL_PAGE",
        },
    },
    {
        name: "Michael Chen",
        role: "Logistics Director",
        img: emptyImage,
        bio: "Logistics expert with 15+ years experience",
        delay: 0.3,
        social: {
            twitter: "https://x.com/LAKESHORE_REAL_PAGE",
            instagram: "https://www.instagram.com/lakeshoreconvenience_1?igsh=MWpncGd3NHo3MzVzNA==",
            facebook: "https://www.facebook.com/p/Lakeshore-Convenience-Sylvan-61575180136680/",
            linkedin: "https://www.linkedin.com/company/LAKESHORE_REAL_PAGE",
        },
    },
    {
        name: "Emma Rodriguez",
        role: "Fresh Produce Sourcing Manager",
        img: emptyImage,
        bio: "Expert in fresh produce sourcing and quality",
        delay: 0.5,
        social: {
            twitter: "https://x.com/LAKESHORE_REAL_PAGE",
            instagram: "https://www.instagram.com/lakeshoreconvenience_1?igsh=MWpncGd3NHo3MzVzNA==",
            facebook: "https://www.facebook.com/p/Lakeshore-Convenience-Sylvan-61575180136680/",
            linkedin: "https://www.linkedin.com/company/LAKESHORE_REAL_PAGE",
        },
    },
];

// ABOUT HOMEPAGE
// Updated to use light fresh colors
export const aboutfeature = [
  { icon: FaBolt, title: "Fast Delivery", text: "Quick grocery delivery", color: "from-[#8BC34A] to-[#7CB342]" },
  { icon: FaRegClock, title: "Always Open", text: "24/7 grocery service", color: "from-[#FFC107] to-[#FF9800]" },
  { icon: FaCalendarCheck, title: "Easy Ordering", text: "Simple online shopping", color: "from-[#8BC34A] to-[#FFC107]" },
  { icon: FaFire, title: "Fresh Produce", text: "Quality fresh groceries", color: "from-[#7CB342] to-[#8BC34A]" }
];

// SPECIAL MENU
export const cardData = [
    { id: 1, title: 'Fresh Apples', rating: 4.5, hearts: 105, description: 'Crispy fresh apples from local farms', image: Kebab, popular: true, price: '₹40' },
    { id: 2, title: 'Organic Bananas', rating: 5.0, hearts: 155, description: 'Ripe organic bananas rich in potassium', image: ChickenTikka, bestseller: true, price: '₹140' },
    { id: 3, title: 'Whole Wheat Bread', rating: 4.2, hearts: 85, description: 'Freshly baked whole wheat bread', image: DesiChowmein, price: '₹60' },
    { id: 4, title: 'Farm Fresh Eggs', rating: 4.8, hearts: 285, description: 'Free-range eggs from local farms', image: ChickenChargha, special: true, price: '₹200' },
];
export const additionalData = [
    { id: 5, title: 'Greek Yogurt', rating: 4.8, hearts: 210, description: 'Creamy Greek yogurt with probiotics', image: PaneerTikka, popular: true, price: '₹220' },
    { id: 6, title: 'Mixed Nuts', rating: 4.5, hearts: 165, description: 'Premium mixed nuts for snacking', image: MasalaDosa, price: '₹180' },
    { id: 7, title: 'Fresh Spinach', rating: 4.7, hearts: 190, description: 'Organic fresh spinach leaves', image: PalakPaneer, price: '₹200' },
    { id: 8, title: 'Organic Honey', rating: 4.9, hearts: 275, description: 'Pure organic honey from local bees', image: GulabJamun, special: true, price: '₹30' },
];

// FOOTER 
export const socialIcons = [
    { icon: FaFacebook, link: 'https://www.facebook.com/p/Lakeshore-Convenience-Sylvan-61575180136680/', color: '#3b5998', label: 'Facebook' },
    { icon: FaInstagram, link: 'https://www.instagram.com/lakeshoreconvenience_1?igsh=MWpncGd3NHo3MzVzNA==', color: '#E1306C', label: 'Instagram' },
    { icon: FaXTwitter, link: 'https://x.com/LAKESHORE_REAL_PAGE', color: '#000', label: 'X' },
    { icon: FaYoutube, link: 'https://youtube.com/@LAKESHORE_REAL_PAGE', color: '#FF0000', label: 'Youtube' },
];

// LOGIN 
export const inputBase = "w-full rounded-lg bg-white text-gray-800 placeholder-[#8BC34A] focus:outline-none focus:ring-2 focus:ring-[#8BC34A]";
export const iconClass = "absolute top-1/2 transform -translate-y-1/2 left-3 text-[#8BC34A]";

// CONTACT
export const contactFormFields = [
    { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Enter your full name', Icon: FiUser },
    { label: 'Phone Number', name: 'phone', type: 'tel', placeholder: '+91 12345 67890', pattern: "[+]{0,1}[0-9]{10,13}", Icon: FiSmartphone },
    { label: 'Email Address', name: 'email', type: 'email', placeholder: 'your.email@example.com', Icon: FiMail },
    { label: 'Delivery Address', name: 'address', type: 'text', placeholder: 'Enter your delivery address', Icon: FiHome },
    { label: 'Product Name', name: 'product', type: 'text', placeholder: 'Enter product name (e.g., Apples)', Icon: FaAppleAlt },
];

// BANNER
export const bannerAssets = {
    bannerImage: BannerImage,
    orbitImages: [Image1, Image2, Image3, Image4],
    video: Video,
};