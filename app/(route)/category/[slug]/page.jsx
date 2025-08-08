"use client";
import { useParams, useRouter } from "next/navigation";
import { useGetCoursesQuery } from "@/app/features/courses/courseApi";
import LoadingSpinner from "@/app/_components/LoadingSpinner";
import CourseItem from "@/app/(route)/courses/_components/CourseItem";
import { useGetCategoriesQuery } from "@/app/features/category/categoryApi";
import Link from "next/link";
import CenterErrorPage from "@/app/_components/Error";

const slugify = (str) =>
    str
        ?.toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

const matchesCategory = (course, slug) => {
    const target = slugify(decodeURIComponent(slug));
    return (
        slugify(course.category) === target ||
        slugify(course.parentcategory) === target ||
        slugify(course.topic) === target
    );
};

const findPath = (categories, targetSlug, path = []) => {
  for (const cat of categories) {
    const slug = slugify(cat.slug || cat.name);
    const newPath = [...path, { name: cat.name, slug }];
    if (slug === targetSlug) return newPath;
    if (cat.subCategories?.length) {
      const res = findPath(cat.subCategories, targetSlug, newPath);
      if (res) return res;
    }
  }
  return null;
};

export default function CategoryCoursesPage() {
    const { slug } = useParams();
    const decodedSlug = decodeURIComponent(Array.isArray(slug)? slug[0]: slug);
    const { data: catData } = useGetCategoriesQuery();
    const categoryPath = catData?.result ? findPath(catData.result, slugify(decodedSlug)) : null;

    const { data, error, isLoading } = useGetCoursesQuery();

    if (isLoading) return <LoadingSpinner />;
    if (error) return <div className="p-6 text-red-500">Lỗi tải dữ liệu</div>;

    const courses = (data?.result || []).filter((c) => matchesCategory(c, decodedSlug));

    return (
        <div className="container mx-auto pt-28 pb-10">
            {categoryPath && (
                <nav className="text-sm mb-4 text-gray-600 space-x-1">
                    {categoryPath.map((c, idx) => (
                        <span key={c.slug}>
                            {idx !== 0 && ' / '}
                            {idx === categoryPath.length -1 ? (
                                <span className="font-semibold text-gray-900">{c.name}</span>
                            ) : (
                                <Link href={`/category/${c.slug}`} className="hover:underline">
                                    {c.name}
                                </Link>
                            )}
                        </span>
                    ))}
                </nav>
            )}
            <h1 className="text-2xl font-semibold mb-6 capitalize">Khóa học: {decodedSlug.replace(/-/g, " ")}</h1>
            {courses.length === 0 ? (
                <CenterErrorPage errorCode="404"
                 title="Không có khóa học" 
                 message="Xin lỗi, không có khóa học nào được tìm thấy." 
                 width="sm"
                 height="min-h-screen"
                 type="sad" showBackButton={false} />
            ) : (
                <div className="grid gap-6 md:grid-cols-4">
                    {courses.map((course,index) => (
                        <Link key={index} href={"/course-preview/" + course.id}>
                            <CourseItem course={course} />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
