"use client"
import { motion } from "framer-motion";
import { useState } from "react";
import { Book, Video, FileText, Users } from "lucide-react";
import CourseCard from "./CourseCard";
import { Button } from "@/components/ui/button";


const CourseTypeSelector = ({ onNext }) => {
  const [selectedType, setSelectedType] = useState(null);

  const courseTypes = [
    {
      id: "video",
      icon: <Video size={32} />,
      title: "Khóa học video",
      description: "Tạo khóa học với các video bài giảng phong phú, tương tác cao và dễ tiếp cận cho học viên."
    },
    {
      id: "practice",
      icon: <FileText size={32} />,
      title: "Khóa học thực hành",
      description: "Tập trung vào bài tập thực tế, dự án thực tiễn để học viên có thể áp dụng ngay kiến thức."
    }
  ];

  const handleSubmit = () => {
    if (selectedType) {
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-xl mx-auto px-4 py-12"
    >
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-foreground mb-4"
        >
          Trước tiên, hãy chia sẻ về loại khóa học bạn đang tạo?
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground text-lg"
        >
          Lựa chọn phù hợp sẽ giúp chúng tôi tùy chỉnh trải nghiệm tốt nhất cho bạn.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12"
      >
        {courseTypes.map((type, index) => (
          <motion.div
            key={type.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
          >
            <CourseCard
              icon={type.icon}
              title={type.title}
              description={type.description}
              isSelected={selectedType === type.id}
              onClick={() => setSelectedType(type.id)}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center"
      >
        <Button
          onClick={handleSubmit}
          disabled={!selectedType}
          size="lg"
          className="px-12 py-3 text-lg"
        >
          Tiếp tục
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default CourseTypeSelector;