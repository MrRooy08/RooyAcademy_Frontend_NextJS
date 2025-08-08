"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useGetCoursesQuery } from "@/app/features/courses/courseApi";
import CourseItem from "@/app/(route)/courses/_components/CourseItem";
import Link from "next/link";
import LoadingSpinner from "@/app/_components/LoadingSpinner";
import CenterErrorPage from "@/app/_components/Error";

const normalize = (str)=> str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const buildHaystack = (c) =>
  normalize(`${c.name ?? ""} ${c.subtitle ?? ""} ${c.category ?? ""} ${c.parentCategory ?? c.parentcategory ?? ""} ${c.topic ?? ""} ${c.level ?? ""} ${(c.instructorCourse?.map?.(i=>i.name).join(" ") || c.instructorCourse?.name || "")}`);

const tokenise = (str) => normalize(str).split(/\s+/).filter(t=>t.length>=2);

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const { data, error, isLoading } = useGetCoursesQuery();
  const courses = useMemo(() => data?.result || [], [data]);

  // helper fuzzy compare: match if hay includes token or token minus last char (tolerate 1 typo)
const matchToken = (hay, tok)=> hay.includes(tok) || (tok.length>3 && hay.includes(tok.slice(0,-1)));

const filtered = useMemo(() => {
    if (!query) return [];
    const tokens = tokenise(query);
    if(tokens.length===0) return [];
    return courses.filter(c=>{
      const hay = buildHaystack(c);
      return tokens.every(t=> matchToken(hay,t));
    });
  }, [query, courses]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <CenterErrorPage type="sad" title="Lỗi tải dữ liệu" message="Vui lòng thử lại sau" errorCode="500" />;

  return (
    <div className="container mx-auto pt-28 pb-10">
      <h1 className="text-2xl font-semibold mb-6">Kết quả cho: "{query}"</h1>
      {filtered.length === 0 ? (
        <div>
          <CenterErrorPage
            errorCode="404"
            title="Không tìm thấy khóa học phù hợp"
            message="Hãy thử từ khóa khác hoặc duyệt các khóa học phổ biến bên dưới."
            type="sad"
            
            showBackButton={false}
          />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-4">
          {filtered.map((c) => (
            <Link key={c.id} href={`/course-preview/${c.id}`}>
              <CourseItem course={c} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
