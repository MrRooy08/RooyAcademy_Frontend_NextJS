import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LoadingSpinner from "@/app/_components/LoadingSpinner";
import { useSelector, useDispatch } from 'react-redux';
import { updateForm, resetForm } from "@/app/features/courses/courseFormSlice";
import { useRouter } from 'next/navigation';
import { useGetCategoriesQuery} from "@/app/features/category/categoryApi";
import { useCreateCourseMutation } from "@/app/features/courses/courseApi";

const CourseCategoryStep = ({ onNext, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const { data, isLoading, isFetching, error, refetch } = useGetCategoriesQuery();
  const categories = data ? data.result : [];

  const dispatch = useDispatch();
  const router = useRouter();
  const formData = useSelector(state => state.courseForm);  
  const [createCourse, { isLoading: isLoadingCreateCourse, isSuccess, isError }] = useCreateCourseMutation();

  useEffect(() => {
    if (isSuccess) {
      dispatch(resetForm()); 
      router.push('/dashboard?role=INSTRUCTOR'); 
    }
  }, [isSuccess, dispatch, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCategory) {
      dispatch(updateForm({ category: selectedCategory }));
      const updatedFormData = {
        ...formData,
        category: selectedCategory
      };
    
      console.log("formData gửi lên:", updatedFormData);
      createCourse(updatedFormData); 
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto px-4 py-12"
      style={{ cursor: isLoadingCreateCourse ? 'wait' : 'auto' }} 
    >
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-foreground mb-4"
        >
          Thể loại nào phù hợp nhất với kiến thức mà bạn sẽ chia sẻ?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground text-lg"
        >
          Nếu không chắc chắn về loại phù hợp, bạn có thể thay đổi sau.
        </motion.p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        <div className="relative">
          {isLoading || isFetching ? (
            <LoadingSpinner variant='educational' size='lg' text='Vui lòng chờ xíu nhennn ' />
          ) : error ? (
            <div className="w-full border-2 rounded-lg p-4 text-center text-red-500 text-sm space-y-2">
              <p>Không thể tải danh mục. Vui lòng thử lại.</p>
              <div className={isFetching ? "cursor-wait" : ""}>
                <Button onClick={() => refetch()} variant="outline" disabled={isFetching}>
                  {isFetching ? "Đang thử lại..." : "Thử lại"}
                </Button>
              </div>
            </div>
          ) : (
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full text-lg py-6 px-4 border-2 focus:border-primary transition-colors">
                <SelectValue placeholder="Chọn một thể loại" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="flex justify-between pt-8">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="px-8 py-3"
          >
            Trước
          </Button>
          <Button
            type="submit"
            disabled={!selectedCategory || isLoadingCreateCourse}
            className="px-8 py-3"
          >
            {isLoadingCreateCourse ? 'Đang tạo...' : 'Tiếp'}
          </Button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default CourseCategoryStep;
