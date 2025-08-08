"use client"

import { Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { useState, useEffect } from "react"
import { useGetCourseMetaQuery, useCreateCourseMetaMutation } from '@/app/features/courses/courseApi';
import { toast } from "sonner"
import LoadingSpinner from "@/app/_components/LoadingSpinner";

export function TargetStudentsContent({ courseId }) {
  const { data, error } = useGetCourseMetaQuery(courseId);
  const [createCourseMeta, { isLoading }] = useCreateCourseMetaMutation();
  const [isChange, setChanged] = useState(false);
  const courseMeta = data?.result?.meta;

  const [courseData, setCourseData] = useState({
    goal: [],
    audience: [],
    requirement: []
  });

  const generateDefaultList = (count = 3) =>
    Array.from({ length: count }, (_, i) => ({
      id: "",
      content: "",
      index: i + 1,
      dirty: false
    }));


  useEffect(() => {
    if (!courseMeta) return;

    const transform = (arr) =>
      (arr?.length > 0
        ? arr
        : generateDefaultList()
      ).map((item, index) => ({
        ...item,
        id: item.id,
        content: item.content || "",
        index,
        dirty: false,
      }));

    setCourseData({
      goal: transform(courseMeta.GOAL),
      audience: transform(courseMeta.AUDIENCE),
      requirement: transform(courseMeta.REQUIREMENT),
    });
  }, [courseMeta]);

  const addField = (fieldName) => {
    setCourseData((prev) => {
      const currentList = prev[fieldName] || [];
      const nextIndex = currentList.length + 1;
      const newItem = { id: "", content: "", index: nextIndex };
      return {
        ...prev,
        [fieldName]: [...currentList, newItem],
      };
    });
  };

  const updateField = (fieldName, index, value) => {
    setCourseData((prev) => {
      const updatedList = [...prev[fieldName]];
      updatedList[index] = {
        ...updatedList[index],
        content: value,
        dirty: true,
      };
      return {
        ...prev,
        [fieldName]: updatedList,
      };
    });
    setChanged(true);
  };

  const removeField = (field, index) => {
    setCourseData((prev) => {
      const updatedList = [...prev[field]];
      if (updatedList.length <= 1) return prev;
      updatedList.splice(index, 1);
      return {
        ...prev,
        [field]: updatedList,
      };
    });
    setChanged(true);
  };

  const buildChangedMeta = () => {
    const changedMeta = {};

    const filterDirty = (arr) =>
      (arr || []).filter((item) => item.dirty).map((item) => ({
        id: item.id,
        content: item.content.trim(),
        index: item.index
      }));

    const addIfChanged = (field, list) => {
      const changedItems = filterDirty(list);
      if (changedItems.length > 0) {
        changedMeta[field] = changedItems;
      }
    };

    addIfChanged("goal", courseData.goal);
    addIfChanged("audience", courseData.audience);
    addIfChanged("requirement", courseData.requirement);

    return changedMeta;
  };

  const resetDirtyFlags = () => {
    const resetList = (list) =>
      list.map((item) => ({ ...item, dirty: false }));

    setCourseData((prev) => ({
      goal: resetList(prev.goal),
      audience: resetList(prev.audience),
      requirement: resetList(prev.requirement),
    }));
  };

  const handleSave = async () => {
    const changed = buildChangedMeta()
    if (Object.keys(changed).length === 0) {
      toast.info("Không có gì để lưu", {
        description: "Sunday, December 03, 2023 at 9:00 AM",
        action: {
          label: "Undo",
        },
        duration: 2000,
        position: "top-right",
      })
      setIsSaving(false);
      return;
    }

    console.log("📦 Dữ liệu chuẩn bị gửi:", {
      courseId,
      meta: changed,
    });

    try {
      const response = await createCourseMeta({ courseId, meta: changed }).unwrap();
      console.log("Response from backend:", response);
      resetDirtyFlags();
      setChanged(false);
      toast.success("Lưu thành công!", {
        description: "Sunday, December 03, 2023 at 9:00 AM",
        action: {
          label: "Undo",
        },
        duration: 2000,
        position: "top-right",
      })
    } catch (err) {
      const errorCode = err?.data?.code;
      if (errorCode === 1007) {
        toast.error("Lỗi khi lưu!", {
          description: "Bạn không có quyền chỉnh sửa",
          action: {
            label: "Undo",
          },
          duration: 2000,
          position: "top-right",
        })
      } else {
        toast.error("Lỗi khi lưu!", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
          action: {
            label: "Undo",
          },
          duration: 2000,
          position: "top-right",
        })
      }

    }
  };


  return (
    <div className="max-w-4xl mx-auto p-6 m-4  border rounded-md shadow-lg">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-6">Học viên mục tiêu</h1>
        {isLoading && <LoadingSpinner />}
        <Button
          variant="ghost"
          onClick={handleSave}
          disabled={isLoading}
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
          <h2 className="text-lg font-semibold mb-4">
            Các mục đích học tập mà học viên có thể đạt được sau khi hoàn thành khóa học của bạn là gì?
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Bạn phải nhập ít nhất 4 mục tiêu học tập hoặc kết quả mà học viên có thể mong đợi đạt được sau khi hoàn
            thành khóa học của bạn.
          </p>

          <div className="space-y-3">
            {courseData.goal.map((goal, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder="Ví dụ: Xác định các vấn đề cơ bản của bạn"
                  className="flex-1"
                  key={index}
                  value={goal.content}
                  onChange={(e) => updateField("goal", index, e.target.value)}
                />
                <span
                  className={`text-sm min-w-[3rem] ${goal.content.length >= 160 ? "text-red-500 font-semibold cursor-help" : "text-gray-500"
                    }`}
                  title={goal.content.length >= 160 ? "Bạn đã nhập quá số ký tự cho phép" : ""}
                >
                  {goal.content.length}/160
                </span>
                <Button
                  variant="ghost"
                  onClick={() => removeField("goal", index)}
                  className={`p-1 ${courseData.goal.length <= 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-red-500 hover:text-red-600"
                    }`}
                  title={
                    courseData.goal.length <= 1
                      ? "Cần ít nhất 1 mục tiêu — không thể xoá hết"
                      : "Xoá mục này"
                  }
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            ))}

            <Button
              variant="ghost"
              onClick={() => addField("goal")}
              className="text-purple-600 hover:text-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm nội dung vào phần Mục tiêu của bạn
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">
            Yêu cầu hoặc điều kiện tiên quyết để tham gia khóa học của bạn là gì?
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Liệt kê các kỹ năng, kinh nghiệm, công cụ hoặc thiết bị mà học viên cần có trước khi tham gia khóa học. Nếu
            không có yêu cầu gì đặc biệt, hãy tận dụng không gian này để hạ thấy rào cản cho người mới bắt đầu.
          </p>

          <div className="space-y-3">
            {courseData.requirement.map((requirement, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder="Ví dụ: Không cần kinh nghiệm lập trình. Bạn sẽ học mọi thứ bạn cần biết"
                  className="flex-1"
                  key={index}
                  value={requirement.content}
                  onChange={(e) => updateField("requirement", index, e.target.value)}
                />
                <span
                  className={`text-sm min-w-[3rem] ${requirement.content?.length >= 160 ? "text-red-500 font-semibold cursor-help" : "text-gray-500"
                    }`}
                  title={requirement.content.length >= 160 ? "Bạn đã nhập quá số ký tự cho phép" : ""}
                >
                  {requirement.content.length || 0}/160
                </span>
                <Button
                  variant="ghost"
                  onClick={() => removeField("requirement", index)}
                  className={`p-1 ${courseData.requirement?.length <= 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-red-500 hover:text-red-600"
                    }`}
                  title={
                    courseData.requirement?.length <= 1
                      ? "Cần ít nhất 1 mục tiêu — không thể xoá hết"
                      : "Xoá mục này"
                  }
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="ghost"
              onClick={() => addField("requirement")}
              className="text-purple-600 hover:text-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm nội dung vào phần Yêu cầu của bạn
            </Button>

          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Khóa học này dành cho ai?</h2>
          <p className="text-sm text-gray-600 mb-4">
            Viết mô tả rõ ràng về học viên mục tiêu cho khóa học của bạn, những người sẽ thấy nội dung của bạn có giá
            trị. Điều này sẽ giúp bạn thu hút học viên phù hợp với khóa học của bạn.
          </p>

          <div className="space-y-3">
            {courseData.audience.map((audience, index) => (
              <div key={index}>
                <Textarea
                  placeholder="Ví dụ: Các nhà phát triển Python có kinh nghiệm muốn học Django"
                  className="min-h-[100px] mb-2"
                  key={index}
                  value={audience.content}
                  onChange={(e) => updateField("audience", index, e.target.value)}
                />
                <span
                  className={`text-sm min-w-[3rem] ${audience.content?.length >= 160 ? "text-red-500 font-semibold cursor-help" : "text-gray-500"
                    }`}
                  title={audience.content?.length >= 160 ? "Bạn đã nhập quá số ký tự cho phép" : ""}
                >
                  {audience.content?.length || 0}/160
                </span>
                <Button
                  variant="ghost"
                  onClick={() => removeField("audience", index)}
                  className={`p-1 ${courseData.audience?.length <= 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-red-500 hover:text-red-600"
                    }`}
                  title={
                    courseData.audience?.length <= 1
                      ? "Cần ít nhất 1 mục tiêu — không thể xoá hết"
                      : "Xoá mục này"
                  }
                >
                  <Trash className="w-4 h-3 m-2" />
                </Button>
              </div>
            ))}
            <Button
              variant="ghost"
              onClick={() => addField("audience")}
              className="text-purple-600 hover:text-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm nội dung vào phần Đối tượng của bạn
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
