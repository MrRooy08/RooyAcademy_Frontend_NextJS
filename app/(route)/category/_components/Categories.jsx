import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../../../features/category/categorySlice";
import {useGetCategoriesQuery} from "../../../features/category/categoryApi";

// Component hiển thị menu đệ quy (cha và con)
const RecursiveMenu = ({ category }) => {
  return (
    <div className="group relative">
      {/* Menu cha */}
      <div className="flex justify-between items-center gap-x-6 rounded-lg p-4 hover:bg-gray-100 cursor-pointer">
        <span className="font-semibold text-gray-900">{category.name}</span>
        {category.subCategories?.length > 0 && (
          <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-indigo-500" />
        )}
      </div>

      {/* Menu con (nếu có) */}
      {category.subCategories?.length > 0 && (
        <div className="absolute left-full z-50 top-0 mt-3 w-64 hidden group-hover:block bg-white shadow-lg ring-1 ring-gray-900/5 rounded-lg">
          {category.subCategories.map((childItem) => (
            <RecursiveMenu key={childItem.name} category={childItem} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Category() {
  // const dispatch = useDispatch();
  // const categories = useSelector((state) => state.category);


  // useEffect(() => {
  //   dispatch(fetchCategories());
  // }, [dispatch]);

  const {data, error, isLoading } = useGetCategoriesQuery();
  const categories = data ? data.result : [];
  if (isLoading) return <p>Đang tải...</p>; // Hiển thị khi đang tải
  if (error) {
    console.error("API Error:", error);
    return <div>Error: {error.message}</div>;
  }

  console.log("Data from API:", categories);  // In dữ liệu ra console


  return (
    <Popover className="relative border border-cyan-200 rounded-md w-2/4">
      {/* Nút Explore */}
      <PopoverButton className="inline-flex items-center justify-between text-sm font-semibold text-gray-900 w-full">
        <span className="ml-3">Explore</span>
        <ChevronDownIcon aria-hidden="true" className="h-5 w-5" />
      </PopoverButton>

      {/* Menu chính */}
      <PopoverPanel className="absolute left-1/2 z-10 mt-5 w-screen max-w-md -translate-x-1/2 rounded-lg bg-white shadow-lg ring-1 ring-gray-900/5">
        <div>
          {/* Menu cha */}
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
            <p>No categories available</p> // Hiển thị nếu không có category nào
          )}
        </div>
      </PopoverPanel>
    </Popover>
  );
}
