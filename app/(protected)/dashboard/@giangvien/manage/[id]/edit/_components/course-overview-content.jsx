"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Upload, Play, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InstructorManagementModal } from "./instructor-management-modal"
import { useGetCategoriesQuery } from '@/app/features/category/categoryApi';
import { useUpdateCourseOverviewMutation } from '@/app/features/courses/courseApi';
import { useGetCourseByCourseIdQuery } from '@/app/features/courses/courseApi';
import Link from "next/link"
import LoadingSpinner from '@/app/_components/LoadingSpinner';
import { useAuth } from '@/app/Context/AuthContext';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>
})

export function CourseOverviewContent({ courseId, onPreview }) {
  const { user } = useAuth();
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: courseDetailData, isLoading } = useGetCourseByCourseIdQuery(courseId);

  const categories = categoriesData?.result || [];
  const courseById = courseDetailData?.result || {};

  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const [isChange, setChanged] = useState(false);
  const [updateCourseOverview, { isLoading: isSaving }] = useUpdateCourseOverviewMutation();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [courseData, setCourseData] = useState({});

  const updateField = (fieldName, value) => {
    setCourseData((prev) => ({ ...prev, [fieldName]: value }));
    setChanged(true);
  };

  useEffect(() => {
    if (!courseById) return;
    setCourseData((prev) => {
      return JSON.stringify(prev) === JSON.stringify(courseById) ? prev : courseById;
    });
    setSelectedCategory(courseById.parentcategory || "");
    setSelectedSubCategory(courseById.category || "");
  }, [courseById]);


  const getPreviewUrl = (fileOrString, courseId, baseUrl) => {
    if (fileOrString instanceof File || fileOrString instanceof Blob) {
      return URL.createObjectURL(fileOrString);
    }
    if (typeof fileOrString === "string") {
      return fileOrString.startsWith("http")
        ? fileOrString
        : `${baseUrl}${courseId}/${fileOrString}`;
    }
    return "";
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      updateField("imageUrl", file);
    }
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      updateField("videoUrl", file);
    }
    console.log(file, "file");
  };

  const buildChangedMeta = () => {
    if (!courseById) return {};

    const changed = {};

    Object.keys(courseData).forEach((key) => {
      const newValue = courseData[key];
      const oldValue = courseById[key];

      if (newValue instanceof File || newValue instanceof Blob) {
        changed[key] = newValue;
        return;
      }

      if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
        changed[key] = newValue;
      }
    });

    return changed;
  };

  const resetDirtyFlags = () => setChanged(false);

  const handleSave = async () => {
    const changed = buildChangedMeta();
    if (Object.keys(changed).length === 0) {
      toast.info("Không có thay đổi nào để lưu.");
      return;
    }

    const { imageUrl, videoUrl, ...restMeta } = changed;
    const formData = new FormData();
    const bodyBlob = new Blob([JSON.stringify(restMeta)], { type: "application/json" });

    formData.append("body", bodyBlob);
    formData.append("courseId", courseData.id);

    if (imageUrl instanceof File) {
      formData.append("imageUrl", imageUrl);
    }

    if (videoUrl instanceof File) {
      formData.append("videoUrl", videoUrl);
    }
    for (let [key, value] of formData.entries()) {
      console.log("👉 FormData entry:", key, value);
    }

    try {
      const response = await updateCourseOverview({ formData, courseId: courseData.id }).unwrap();
      console.log("🚀 ~ handleSave ~ response:", response)
      toast.success("Lưu thành công!");
      resetDirtyFlags();
      setChanged(false);
    } catch (err) {
      const errorCode = err?.data?.code;
      if (errorCode === 1007) {
        toast.error("Bạn không có quyền chỉnh sửa");
      } else {
        toast.error("Lỗi khi lưu");
      }
    }
  };



  const parent = categories.find((cat) => cat.name === selectedCategory);
  const subCategories = parent?.subCategories || [];
  const previewImageUrl = getPreviewUrl(courseData.imageUrl, courseId, process.env.NEXT_PUBLIC_API_URL_IMAGE);

  useEffect(() => {
    if (selectedSubCategory && !subCategories.some((sub) => sub.name === selectedSubCategory)) {
      setSelectedSubCategory("");
      updateField("category", "");
    }
  }, [selectedCategory, subCategories, selectedSubCategory]);
  const previewVideoUrl = getPreviewUrl(courseData.videoUrl, courseId, process.env.NEXT_PUBLIC_API_URL_VIDEO);
  console.log("🚀 ~ CourseOverviewContent ~ previewVideoUrl:", previewVideoUrl)


  const handleShowInstructorModal = () => {
    if (user.result.instructorId === courseData.instructorCourse.find((ins) => ins.isOwner).instructor) {
      setShowInstructorModal(true);
    }
    else {
      toast.error("Bạn không có quyền quản lý giảng viên");
    }
  };

  console.log("🚀 ~ CourseOverviewContent ~ courseData:", courseData)

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-end mb-6 gap-3">
        <h1 className="flex-1 text-2xl font-bold">Trang tổng quan khóa học</h1>
        <Button variant="outline" onClick={onPreview}>
          Xem trước
        </Button>
        {isSaving && <LoadingSpinner />}
        <Button
          variant="ghost"
          onClick={handleSave}
          disabled={!isChange || isSaving}
          className={`p-1w-full ${!isChange
            ? "text-white-400 bg-gray-400 cursor-not-allowed hover:bg-gray-400"
            : "bg-cyan-300 hover:bg-cyan-500"
            }`}
        >
          Lưu
        </Button>
      </div>

      <div className="space-y-8">
        <div>
          <Label htmlFor="course-title" className="text-base font-medium">
            Tiêu đề khóa học
          </Label>
          <Input
            id="course-title"
            placeholder="Nhập tiêu đề khóa học của bạn"
            value={courseData.name || ""}
            onChange={(e) => updateField("name", e.target.value)}
            className="mt-2"
          />
          <div className="text-right text-sm text-gray-500 mt-1">60</div>
        </div>

        <div>
          <Label htmlFor="course-subtitle" className="text-base font-medium">
            Phụ đề khóa học
          </Label>
          <Input
            id="course-subtitle"
            placeholder="Nhập phụ đề khóa học của bạn"
            value={courseData.subtitle || ""}
            onChange={(e) => updateField("subtitle", e.target.value)}
            className="mt-2"
          />
          <div className="text-right text-sm text-gray-500 mt-1">120</div>
        </div>

        <div>
          <Label htmlFor="course-description" className="text-base font-medium">
            Mô tả khóa học
          </Label>
          <div className="min-h-[200px]">
            {!isLoading ? (
              <ReactQuill
                theme="snow"
                value={courseData.description}
                onChange={(val) => updateField("description", val)}
                modules={{
                  toolbar: [
                    ["bold", "italic", "underline"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link"]
                  ]
                }}
                className="h-full "
                style={{ height: '100%', width: '75%'}}
              />
            ) : (
              <p>Đang tải nội dung mô tả...</p>
            )}

          </div>
        </div>

        <div>
          <Label className="text-base font-medium">Thông tin cơ bản</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <Label htmlFor="category">Danh mục</Label>
              <Select value={selectedCategory || ""}
                onValueChange={(val) => {
                  setSelectedCategory(val);
                }}
              >
                <SelectTrigger className="w-full border-2 focus:border-primary transition-colors">
                  <SelectValue placeholder="Chọn một thể loại" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category, index) => (
                    <SelectItem key={index} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Cấp độ</Label>
              <Select
                value={courseData.levelCourse || ""}
                onValueChange={(val) => updateField("levelCourse", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn cấp độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TD001">Sơ cấp</SelectItem>
                  <SelectItem value="TD002">Trung cấp</SelectItem>
                  <SelectItem value="TD003">Chuyên gia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedCategory && (
              <div>
                <Label>Danh mục con</Label>
                <Select
                  value={selectedSubCategory || ""}
                  onValueChange={(val) => {
                    setSelectedSubCategory(val);
                    updateField("category", val);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục con" />
                  </SelectTrigger>
                  <SelectContent>
                    {subCategories.length > 0 ? (
                      subCategories.map((sub) => (
                        <SelectItem key={sub.name} value={sub.name}>
                          {sub.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="none">
                        Không có danh mục con
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label>Chủ đề chính</Label>
              <Select
                value={courseData.topic || ""}
                onValueChange={(val) => updateField("topic", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chủ đề" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="C++">C++</SelectItem>
                  <SelectItem value="Java">Java</SelectItem>
                  <SelectItem value="Python">Python</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-base font-medium">Hình ảnh khóa học</Label>
          <div className="p-4 m-4">
            {courseData?.imageUrl ? (
              <div className="w-full h-auto mx-auto  rounded flex items-center justify-center">
                <span className="text-sm text-gray-500 border-2 border-dashed">
                  {
                    previewImageUrl ? (
                      <img src={previewImageUrl} alt="Ảnh khóa học"
                        style={{ width: '100%', height: 'auto' }}
                      />
                    ) : (
                      <img src={URL.createObjectURL(courseData.imageUrl)} alt="Preview"
                        style={{ width: '100%', height: 'auto' }}
                      />
                    )
                  }
                </span>
                <div className=" p-8 text-center">
                  <div className="space-y-4">
                    {courseData.imageUrl && courseData.imageUrl instanceof File ? (
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">Tên ảnh: {courseData.imageUrl.name}</p>
                        <p className="text-xs text-gray-500">{(courseData.imageUrl.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <p className="text-sm font-medium">Tên ảnh: {courseData.imageUrl}</p>
                    )
                    }
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload-replace"
                    />
                    <Button variant="outline" asChild>
                      <label htmlFor="image-upload-replace" className="cursor-pointer">
                        Thay đổi hình ảnh
                      </label>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Tải lên hình ảnh khóa học của bạn tại đây. Hướng dẫn quan trọng: 750x422 pixel; .jpg, .jpeg, .gif,
                  hoặc .png. không có văn bản trên hình ảnh.
                </p>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                <Button variant="outline" asChild>
                  <label htmlFor="image-upload" className="cursor-pointer">
                    Tải lên hình ảnh
                  </label>
                </Button>
              </div>
            )}
          </div>
        </div>

        <div>
          <Label className="text-base font-medium">Video quảng cáo</Label>
          <div className="mt-2 border-gray-300 rounded-lg p-6 m-4 text-center">
            {courseData?.videoUrl ? (
              <div className="space-y-4">
                <span className="text-sm text-gray-500">
                  {courseData?.videoUrl ? (
                    <video
                      controls
                      src={previewVideoUrl}
                      type="video/mp4"
                      style={{ width: '50%', height: '50%' }}
                    />
                  ) : (
                    <p className="text-sm text-gray-500">Không có video hoặc ảnh preview</p>
                  )}
                </span>
                {courseData.videoUrl && courseData.videoUrl instanceof File && (
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">Tên file: {courseData.videoUrl.name}</p>
                    <p className="text-xs text-gray-500">{(courseData.videoUrl.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                  id="video-upload-replace"
                />
                <Button variant="outline" asChild>
                  <label htmlFor="video-upload-replace" className="cursor-pointer">
                    Thay đổi video
                  </label>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Play className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Video quảng cáo của bạn là một cách nhanh chóng và hấp dẫn để học viên xem trước những gì họ sẽ học
                  trong khóa học của bạn. Học viên xem xét video quảng cáo để quyết định có đăng ký khóa học hay không.
                </p>
                <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" id="video-upload" />
                <Button variant="outline" asChild>
                  <label htmlFor="video-upload" className="cursor-pointer">
                    Tải lên video
                  </label>
                </Button>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-base font-medium">Hỏi và giảng viên</Label>
            <Button variant="outline" size="sm" onClick={handleShowInstructorModal}>
              <Settings className="w-4 h-4 mr-2" />
              Quản lý giảng viên
            </Button>
          </div>
          <div className="border border-gray-200 rounded-lg">
            {courseData?.instructorCourse?.map((instructor, index) => (
              <div key={index} className="p-4 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                    <img src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE_USER}`} alt="Ảnh khóa học"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{instructor.name}</p>
                      {instructor.isOwner === "true" ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Chủ sở hữu </span>
                      ) : (
                        instructor.status !== "ACCEPTED" ? (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Đang đợi phản hồi</span>
                        ) : (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Giảng viên đóng góp</span>
                        )
                      )}
                    </div>
                    <Button variant="link" className="p-0 h-auto text-purple-600">
                      <Link href={`/user-profile/${instructor.instructor}`}>
                        Xem hồ sơ giảng viên
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <InstructorManagementModal
        isOpen={showInstructorModal}
        onClose={() => setShowInstructorModal(false)}
        courseData={courseData}
        setCourseData={setCourseData}

      />
    </div>
  )
}
