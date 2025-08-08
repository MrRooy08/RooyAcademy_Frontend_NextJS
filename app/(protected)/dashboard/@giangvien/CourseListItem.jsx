
import { Progress } from "@/components/ui/progress";
import Link from "next/link"
import { Button } from "@/components/ui/button";
import { getImageURL } from "@/lib/media";

const CourseListItem = ({ course }) => {

    return (
        <div className="border border-gray-200 shadow-lg rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                    <div className="w-20 h-10 bg-gray-300 rounded">
                        <img
                            src={course.imageUrl ? getImageURL(course.imageUrl, course.id) : "/minhrom.png"}
                            alt={course.name}
                            width={120}
                            height={30}
                            className="rounded-md object-cover"
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate mb-1">
                            {course.name}
                        </h3>

                        <div className="flex items-center space-x-4 mb-2">
                            <span className="text-sm text-gray-600"> {course.isActive === "DRAFT" ? "Bản nháp" : ""} </span>
                            <span className="text-sm text-gray-600">{course.type} Hello</span>
                        </div>

                        <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-600 whitespace-nowrap">
                                Kết thúc khóa học của bạn
                            </span>
                            <div className="flex-1 max-w-md">
                                <Progress value={course.progress} className="h-2" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                        <Link href={`/dashboard/manage/${course.id}/edit?role=INSTRUCTOR`}>
                            <Button variant="outline" size="sm">
                                Chỉnh sửa
                            </Button>
                        </Link>

                        <div className="relative ">
                            <Button
                                size="sm"
                                className="p-2"
                            >....
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseListItem;