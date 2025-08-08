"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import ExploreIcon from "@mui/icons-material/Explore";
import { useState } from "react";
import { useGetCategoriesQuery } from "../../../features/category/categoryApi";

// Component hiển thị menu đệ quy (cha và con)
import { useRouter } from "next/navigation";

const RecursiveMenu = ({ category }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    // derive slug if backend not provided
    const slug = category.slug || category.name.toLowerCase().replace(/\s+/g, '-');
    router.push(`/category/${slug}`);
  };

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Menu cha */}
      <motion.div
        className="flex justify-between items-center gap-x-6 rounded-lg p-4 cursor-pointer"
        whileHover={{ backgroundColor: "#F3F4F6" }}
        onClick={handleClick}
        transition={{ duration: 0.2 }}
      >
        <span className="font-semibold text-gray-900">{category.name}</span>
        {category.subCategories?.length > 0 && (
          <motion.div
            animate={{ rotate: isHovered ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-indigo-500" />
          </motion.div>
        )}
      </motion.div>

      {/* Menu con (nếu có) */}
      {category.subCategories?.length > 0 && (
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute left-full z-50 top-0 mt-3 w-64 bg-white shadow-lg ring-1 ring-gray-900/5 rounded-lg"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              {category.subCategories.map((childItem) => {
                const transformedChildItem = {
                  ...childItem,
                  name: childItem.name.replace(/([A-Z])/g, " $1").trim(),
                };

                return (
                  <RecursiveMenu
                    key={childItem.name}
                    category={transformedChildItem}
                  />
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default function Category() {
  const { data, error, isLoading } = useGetCategoriesQuery();
  const [isOpen, setIsOpen] = useState(false);
  const categories = data ? data.result : [];

  if (isLoading) return <p>Đang tải...</p>;
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div
      className="relative border border-cyan-200 rounded-md w-2/3"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Nút Explore với icon và motion effects */}
      <motion.button
        className="inline-flex items-center justify-between text-sm font-semibold text-gray-900 w-full p-2 rounded-md"
        whileHover={{
          scale: 1.05,
          backgroundColor: "#E5E7EB",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
        }}
        whileTap={{
          scale: 0.95,
          transition: { type: "spring", stiffness: 300, damping: 10 },
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center">
          {/* Icon bên trái "Explore" */}
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.2, rotate: 10 }} // Slight scale and rotate on hover
            transition={{ duration: 0.2 }}
            className="mr-2"
          >
            <ExploreIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
          </motion.div>
          {/* Text "Explore" */}
          <motion.span
            initial={{ x: 0 }}
            animate={{ x: isOpen ? 5 : 0 }}
            transition={{ duration: 0.3 }}
            className="ml-1"
          >
            Mở rộng
          </motion.span>
        </div>
        {/* ChevronDownIcon bên phải */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDownIcon aria-hidden="true" className="h-5 w-5" />
        </motion.div>
      </motion.button>

      {/* Menu chính */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute left-1/2 z-10 mt-1 w-screen max-w-xs -translate-x-1/2 rounded-lg bg-white shadow-lg ring-1 ring-gray-900/5"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              {categories.length > 0 ? (
                categories.map((parentItem) => (
                  <RecursiveMenu
                    key={parentItem.name}
                    category={{
                      ...parentItem,
                      name: parentItem.name.replace(/([A-Z])/g, " $1").trim(),
                    }}
                  />
                ))
              ) : (
                <p className="p-4">No categories available</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
