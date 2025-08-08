"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CreditCard, Tag, Clock, Users, Star, Shield, ArrowLeft, Check, Gift } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useCart } from "@/app/Context/CartContext";
import { useCourse } from "@/app/Context/CourseContext"
import { getImageURL } from "@/lib/media"
import { useLazyGetTransactionQuery } from "@/app/features/transaction/transactionApi"
import { useAuth } from "@/app/Context/AuthContext"
import { toast } from "sonner"

export default function CheckoutPage({ courseName }) {
    const { isLoggedIn } = useAuth()
    const { cartItems, setCartItems, cartCount, removeItem , clearCart} = useCart();
    const { selectedCourse, setSelectedCourse } = useCourse();
    const courses = cartItems.length ? cartItems : selectedCourse ? [selectedCourse] : [];
    const [trigger, { data }] = useLazyGetTransactionQuery()
    const features = ["Truy cập trọn đời", "Chứng chỉ hoàn thành", "Hỗ trợ Q&A", "Tài liệu PDF", "Source code"]
    console.log(courses, "danh sách khoá mua")
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams?.get('redirect');
    const [paymentMethod, setPaymentMethod] = useState("vnpay")
    const [couponCode, setCouponCode] = useState("")
    const [appliedCoupon, setAppliedCoupon] = useState(null)
    const [formData, setFormData] = useState({
        agreeTerms: false,
    })
    const [isProcessing, setIsProcessing] = useState(false)

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    }

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
        hover: {
            y: -2,
            transition: {
                duration: 0.2,
                ease: "easeInOut",
            },
        },
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price)
    }

    const calculateSubtotal = () => {
        return courses.reduce((total, course) => total + course.price, 0)
    }

    const calculateDiscount = () => {
        if (appliedCoupon) {
            const subtotal = calculateSubtotal()
            return appliedCoupon.type === "percentage" ? (subtotal * appliedCoupon.value) / 100 : appliedCoupon.value
        }
        return 0
    }

    const calculateTotal = () => {
        return calculateSubtotal() - calculateDiscount()
    }

    const applyCoupon = () => {
        // Mock coupon validation
        const mockCoupons = {
            SAVE20: { type: "percentage", value: 20, description: "Giảm 20%" },
            NEWUSER: { type: "fixed", value: 500000, description: "Giảm 500.000đ cho người dùng mới" },
        }

        if (mockCoupons[couponCode.toUpperCase()]) {
            setAppliedCoupon({
                code: couponCode.toUpperCase(),
                ...mockCoupons[couponCode.toUpperCase()],
            })
        }
    }

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleCheckout = async () => {
        setIsProcessing(true)
        if (!isLoggedIn) {
            router.push("/login?redirect=/checkout");
            return;
        }
        setTimeout(async () => {
            let response;
            if (selectedCourse) {
                try {
                    response = await trigger({ courseId: selectedCourse.id }).unwrap();
                    window.location.href = response.url;
                } catch (err) {
                    const errorCode = err?.data?.code;
                    if (errorCode === 1037) {
                        toast.error("Lỗi khi thanh toán!", {
                            description: (
                                <span style={{ color: "red" }}>
                                    Bạn đã từng làm giảng viên của khoá học này. Nên không thể thanh toán :(((
                                </span>
                            ),
                            action: {
                                label: "Undo",
                            },
                            duration: 5000,
                            position: "top-right",
                        })
                    } else {
                        toast.error("Lỗi khi thanh toán!", {
                            description: "Sunday, December 03, 2023 at 9:00 AM",
                            action: {
                                label: "Undo",
                            },
                            duration: 5000,
                            position: "top-right",
                        })
                    }
                    setIsProcessing(false);
                    router.back();
                    return;
                }
            }
            else {
                try {
                    response = await trigger().unwrap();
                    window.location.href = response.url;
                    clearCart();
                } catch (err) {
                    const errorCode = err?.data?.code;
                    if (errorCode === 1037) {
                        toast.error("Lỗi khi thanh toán!", {
                            description: (
                                <span style={{ color: "red" }}>
                                    Bạn đã từng làm giảng viên của khoá học này. Nên không thể thanh toán :(((
                                </span>
                            ),
                            action: {
                                label: "Undo",
                            },
                            duration: 5000,
                            position: "top-right",
                        })
                    } else {
                        toast.error("Lỗi khi thanh toán!", {
                            description: "Sunday, December 03, 2023 at 9:00 AM",
                            action: {
                                label: "Undo",
                            },
                            duration: 5000,
                            position: "top-right",
                        })
                    }
                    setIsProcessing(false);
                    router.back();
                    return;
                }
            }
        }, 2000)

    }

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-8 px-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4"
                    variants={itemVariants}
                >
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Thanh toán khóa học</h1>
                        <p className="text-sm sm:text-base text-gray-600">Hoàn tất thanh toán để bắt đầu học ngay</p>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" className="w-full sm:w-auto bg-transparent" onClick={() => router.back()}>
                            <ArrowLeft className="h-4 w-4" />
                            Quay lại
                        </Button>
                    </motion.div>
                </motion.div>
                <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        {/* Payment Method */}
                        <motion.div variants={cardVariants} whileHover="hover">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <motion.div whileHover={{ rotateY: 180 }} transition={{ duration: 0.6 }}>
                                            <CreditCard className="h-5 w-5" />
                                        </motion.div>
                                        Phương thức thanh toán
                                    </CardTitle>
                                    <CardDescription>Chọn phương thức thanh toán phù hợp</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <motion.div
                                        className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                                        whileHover={{ backgroundColor: "#f9fafb" }}
                                    >
                                        <Label htmlFor="vnpay" className="flex items-center gap-3 cursor-pointer flex-1">
                                            <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                                                VNP
                                            </div>
                                            <div>
                                                <p className="font-medium">VNPay</p>
                                                <p className="text-sm text-gray-600">Thanh toán qua ngân hàng, ví điện tử</p>
                                            </div>
                                        </Label>
                                        <Badge variant="secondary">Phổ biến</Badge>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>
                        {/* Course Items */}
                        <motion.div variants={cardVariants} whileHover="hover">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                                            <Tag className="h-5 w-5" />
                                        </motion.div>
                                        Khóa học đã chọn
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {courses.map((course, index) => (
                                        <motion.div
                                            key={course.id}
                                            className="flex flex-col sm:flex-row gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ backgroundColor: "#f3f4f6" }}
                                        >
                                            <motion.div whileHover={{ scale: 1.05 }}>
                                                <img
                                                    src={getImageURL(course.imageUrl, course.id) || "/placeholder.svg"}
                                                    alt={course.name}
                                                    width={100}
                                                    height={60}
                                                    className="w-full sm:w-40 md:w-52 lg:w-64 h-32 sm:h-15 rounded-lg object-cover"
                                                />
                                            </motion.div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-sm mb-1">{course.name}</h4>
                                                <p className="text-xs text-gray-600 mb-2">Giảng viên: {course.instructorCourse.map((instructor) => instructor.name).join(", ")}</p>
                                                <div className="flex flex-col  gap-2 text-xs text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" /> 60 giờ
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Users className="h-3 w-3" /> 15420 người
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                        5
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-green-600">{formatPrice(course.price)}</span>
                                                    <span className="text-xs text-gray-500 line-through">
                                                        {formatPrice(course.price)}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        {/* Coupon */}
                        <motion.div variants={cardVariants} whileHover="hover">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                                            <Gift className="h-5 w-5" />
                                        </motion.div>
                                        Mã giảm giá
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {!appliedCoupon ? (
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Nhập mã giảm giá"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                            />
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button onClick={applyCoupon} variant="outline">
                                                    Áp dụng
                                                </Button>
                                            </motion.div>
                                        </div>
                                    ) : (
                                        <motion.div
                                            className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-green-600" />
                                                <span className="text-sm font-medium text-green-800">
                                                    {appliedCoupon.code} - {appliedCoupon.description}
                                                </span>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setAppliedCoupon(null)}
                                                className="text-green-600 hover:text-green-800"
                                            >
                                                Xóa
                                            </Button>
                                        </motion.div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Order Total */}
                        <motion.div variants={cardVariants} whileHover="hover">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tổng thanh toán</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span>Tạm tính ({courses.length} khóa học):</span>
                                        <span>{formatPrice(calculateSubtotal())}</span>
                                    </div>

                                    {appliedCoupon && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Giảm giá ({appliedCoupon.code}):</span>
                                            <span>-{formatPrice(calculateDiscount())}</span>
                                        </div>
                                    )}

                                    <Separator />

                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Tổng cộng:</span>
                                        <span className="text-green-600">{formatPrice(calculateTotal())}</span>
                                    </div>

                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button
                                            className="w-full mt-4"
                                            size="lg"
                                            onClick={handleCheckout}
                                            disabled={isProcessing || courses.length === 0}
                                        >
                                            {isProcessing ? (
                                                <motion.div
                                                    className="flex items-center gap-2"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                >
                                                    <motion.div
                                                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                                    />
                                                    Đang xử lý...
                                                </motion.div>
                                            ) : (
                                                <>
                                                    <Shield className="h-4 w-4 mr-2" />
                                                    Thanh toán an toàn
                                                </>
                                            )}
                                        </Button>
                                    </motion.div>

                                    <div className="text-xs text-gray-500 text-center mt-3">
                                        <Shield className="h-3 w-3 inline mr-1" />
                                        Thanh toán được bảo mật bởi SSL 256-bit
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Course Features */}
                        <motion.div variants={cardVariants} whileHover="hover">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Bạn sẽ nhận được:</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {features.map((feature, index) => (
                                            <motion.div
                                                key={index}
                                                className="flex items-center gap-2 text-sm"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <Check className="h-3 w-3 text-green-600" />
                                                <span>{feature}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
