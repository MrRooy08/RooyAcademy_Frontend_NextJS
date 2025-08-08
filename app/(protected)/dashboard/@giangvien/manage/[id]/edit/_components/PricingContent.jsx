"use client"

import { useState, useEffect } from "react"
import { BadgePercent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetPriceQuery, useUpdateCoursePriceByCourseIdMutation, useGetPriceCourseQuery } from "@/app/features/courses/courseApi"
import LoadingOverLay from "@/app/_components/LoadingOverlay"
import { toast } from "sonner"
import { useParams } from "next/navigation"

export function PricingContent() {
    const params = useParams()
    const [priceLevel, setPriceLevel] = useState("")
    const {data: priceCourse} = useGetPriceCourseQuery(params.id)
    const { data } = useGetPriceQuery()
    const price = data?.result || [];
    console.log(priceCourse?.result, "priceCourse")

    // Nếu khoá học đã có mức giá, tự động chọn mức giá đó
    useEffect(() => {
        if (priceCourse?.result) {
            const selectedId = priceCourse.result.id ?? priceCourse.result;
            setPriceLevel(selectedId);
        }
    }, [priceCourse]);

    const [updateCoursePriceByCourseId, { isLoading }] = useUpdateCoursePriceByCourseIdMutation()

    const handleSave = async () => {
        try {
            const response = await updateCoursePriceByCourseId({courseId: params.id, priceLevel:priceLevel}).unwrap();
            console.log(response)
            toast.success("Lưu thành công!");
        } catch (error) {
            console.log(error)
            toast.error("Lưu thất bại!");
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {isLoading && <LoadingOverLay   />}
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BadgePercent className="w-10 h-10 text-orange-500 mt-0.5" />
                Định giá
            </h1>
            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold mb-4">Đặt giá cho khóa học của bạn</h2>
                    <p className="text-gray-600 mb-4">
                        Vui lòng chọn đơn vị tiền tệ và mức giá cho khóa học của bạn. Nếu bạn muốn cung cấp miễn phí khóa học của
                        mình thì khóa học đó phải có tổng thời lượng video dưới 2 giờ. Ngoài ra, các khóa học có bài kiểm tra thực
                        hành không thể miễn phí.
                    </p>

                    <div className="grid grid-cols-2 gap-4 max-w-md">
                        <div>
                            <label className="block text-sm font-medium mb-2">Tiền tệ</label>
                            <div className="currency-input border border-gray-300 rounded-lg p-1 bg-gray-100 ">
                                VND
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Mức giá</label>
                            <Select value={priceLevel} onValueChange={setPriceLevel}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn mức giá" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        price?.length > 0 ? price?.map((item, index) => (
                                            <SelectItem key={index} value={item.id}>
                                                {item.description}
                                            </SelectItem>
                                        )) : (
                                            <SelectItem disabled value="none">
                                                Không có mức giá
                                            </SelectItem>
                                        )
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="pt-6">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white" 
                    onClick={handleSave} disabled={isLoading}> 
                        {isLoading ? "Đang lưu..." : "Lưu"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
