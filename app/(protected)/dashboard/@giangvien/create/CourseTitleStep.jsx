
import { motion } from "framer-motion";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from 'react-redux';
import { updateForm } from "@/app/features/courses/courseFormSlice";

const CourseTitleStep = ({ onNext, onBack }) => {

  const [name, setName] = useState("");

  const dispatch = useDispatch();

  const maxLength = 60;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      dispatch(updateForm({ name: name}));
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto px-4 py-12"
    >
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-foreground mb-4"
        >
          Vậy còn tiêu đề nội dung thì sao?
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground text-lg"
        >
          Đừng lo nếu bạn không nghĩ ra được một tiêu đề hay ngay bây giờ. Bạn có thể thay đổi sau.
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
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, maxLength))}
            placeholder="Ví dụ: Học Photoshop CS6 từ căn bản"
            className="w-full text-lg py-6 px-4 border-2 focus:border-primary transition-colors"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
            {name.length}/{maxLength}
          </div>
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
            disabled={!name.trim()}
            className="px-8 py-3"
          >
            Tiếp
          </Button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default CourseTitleStep;