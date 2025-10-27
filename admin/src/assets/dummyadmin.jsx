import React from 'react';
import {
    FiPlusCircle,
    FiList,
    FiPackage,FiTruck, FiCheckCircle, FiClock,
} from 'react-icons/fi';


export const navLinks = [
    { name: 'Add Items', href: '/', icon: <FiPlusCircle /> },
    { name: 'List Items', href: '/list', icon: <FiList /> },
    { name: 'Orders', href: '/orders', icon: <FiPackage /> },
];


// LIST CSS
export const styles = {
    // Updated page wrapper with colors from the frontend
    pageWrapper: "min-h-screen bg-gradient-to-br from-[#2D1B0E] via-[#4a372a] to-[#1a120b] py-12 px-4 sm:px-6 lg:px-8",
    cardContainer: "bg-[#3a2b2b]/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-amber-900/30",
    title: "text-3xl font-bold mb-8 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent text-center",
    tableWrapper: "overflow-x-auto",
    table: "w-full",
    thead: "bg-amber-900/20",
    th: "p-4 text-left text-amber-100",
    thCenter: "p-4 text-center text-amber-100",
    tr: "border-b border-amber-900/20 hover:bg-amber-900/10 transition-colors",
    imgCell: "p-4",
    img: "w-50 h-30 object-contain rounded-lg",
    nameCell: "p-4",
    nameText: "text-amber-100 font-medium text-lg",
    descText: "text-sm text-amber-100/60",
    categoryCell: "p-4 text-amber-100/80",
    priceCell: "p-4 text-amber-400 font-medium",
    ratingCell: "p-4",
    heartsCell: "p-4",
    heartsWrapper: "flex items-center gap-2 text-amber-400",
    deleteBtn: "text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-900/20",
    editBtn: "text-amber-400 hover:text-amber-300 transition-colors p-2 rounded-lg hover:bg-amber-900/20",
    emptyState: "text-center py-12 text-amber-100/60 text-xl",

    // AddItems styles with frontend colors
    formWrapper: "min-h-screen bg-gradient-to-br from-[#2D1B0E] via-[#4a372a] to-[#1a120b] py-10 px-4 sm:px-6 lg:px-8",
    formCard: "bg-[#3a2b2b]/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-amber-900/30",
    formTitle: "text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent text-center",
    uploadWrapper: "flex justify-center",
    uploadLabel: "w-full max-w-xs sm:w-72 h-56 sm:h-72 bg-amber-900/20 border-2 border-dashed border-amber-900/30 rounded-2xl cursor-pointer flex items-center justify-center overflow-hidden hover:border-amber-600 transition-all",
    uploadIcon: "text-3xl sm:text-4xl text-amber-500 mb-2 mx-auto animate-pulse",
    uploadText: "text-amber-100/80 text-sm",
    previewImage: "w-full h-full object-cover",
    inputField: "w-full bg-[#2D1B0E]/50 border-2 border-amber-900/30 rounded-xl py-3 px-4 text-amber-100 placeholder-amber-400/50 focus:outline-none focus:border-amber-600 transition-colors",
    gridTwoCols: "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6",
    relativeInput: "relative",
    rupeeIcon: "absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 text-lg sm:text-xl",
    actionBtn: "w-full bg-gradient-to-r from-amber-500 to-amber-700 text-[#2D1B0E] px-6 sm:px-8 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg transition-all hover:shadow-2xl hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-95 mt-6",

    // AdminNavbar styles with frontend colors
    navWrapper: "bg-[#2D1B0E] border-b-8 border-amber-900/40 shadow-[0_25px_50px_-12px] shadow-amber-900/30 sticky top-0 z-50 font-vibes",
    navContainer: "max-w-7xl mx-auto px-4 flex justify-between items-center h-20",
    logoSection: "flex items-center space-x-3",
    logoIcon: "text-4xl text-amber-500",
    logoText: "text-2xl font-bold text-amber-100 tracking-wide",
    menuButton: "text-amber-100 text-2xl lg:hidden",
    desktopMenu: "hidden lg:flex items-center space-x-4",
    navLinkBase: "flex items-center space-x-2 px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all",
    navLinkActive: "bg-amber-900/20 border-amber-600 text-amber-100",
    navLinkInactive: "border-transparent text-amber-100 hover:border-amber-600 hover:bg-amber-900/20",
    mobileMenu: "lg:hidden flex flex-col space-y-3 mt-4 pb-4"
};


// DummyData.jsx
// Centralized Tailwind CSS class definitions and style objects
export const iconMap = {
    FiClock: <FiClock className="text-lg" />,
    FiTruck: <FiTruck className="text-lg" />,
    FiCheckCircle: <FiCheckCircle className="text-lg" />,
};

// Status styles for order statuses
export const statusStyles = {
    processing: {
        color: 'text-amber-400',
        bg: 'bg-amber-900/20',
        icon: 'FiClock',
        label: 'Processing',
        hideLabel: false,
    },
    outForDelivery: {
        color: 'text-blue-400',
        bg: 'bg-blue-900/20',
        icon: 'FiTruck',
        label: 'Out for Delivery',
        hideLabel: false,
    },
    delivered: {
        color: 'text-green-400',
        bg: 'bg-green-900/20',
        icon: 'FiCheckCircle',
        label: 'Delivered',
        hideLabel: false,
    },
    succeeded: {
        color: 'text-green-400',
        bg: 'bg-green-900/20',
        icon: 'FiCheckCircle',
        label: 'Completed',
        hideLabel: true,
    },
};

// Payment method label and classes
export const paymentMethodDetails = {
    cod: {
        label: 'COD',
        class: 'bg-yellow-600/30 text-yellow-300 border-yellow-500/50',
    },
    card: {
        label: 'Credit/Debit Card',
        class: 'bg-blue-600/30 text-blue-300 border-blue-500/50',
    },
    upi: {
        label: 'UPI Payment',
        class: 'bg-purple-600/30 text-purple-300 border-purple-500/50',
    },
    default: {
        label: 'Online',
        class: 'bg-amber-600/30 text-amber-400 border-amber-500/50',
    },
};

// Table layout classes
export const tableClasses = {
    wrapper: 'overflow-x-auto',
    table: 'w-full',
    headerRow: 'bg-amber-900/20',
    headerCell: 'p-4 text-left text-amber-100',
    row: 'border-b border-amber-900/20 hover:bg-amber-900/10 transition-colors group',
    cellBase: 'p-4',
};

// Utility classes
export const layoutClasses = {
    page: 'min-h-screen bg-gradient-to-br from-[#2D1B0E] via-[#4a372a] to-[#1a120b] py-12 px-4 sm:px-6 lg:px-8',
    card: 'bg-[#3a2b2b]/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-amber-900/30',
    heading: 'text-3xl font-bold mb-8 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent text-center',
};