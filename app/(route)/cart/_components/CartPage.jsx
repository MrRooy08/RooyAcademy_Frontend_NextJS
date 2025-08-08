"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingCart,
  Trash2,
  Heart,
  ArrowRight,
  ArrowLeft,
  Star,
  Clock,
  Users,
  BookOpen,
  Gift,
  Tag,
  Plus,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getImageURL, getLevelText } from "@/lib/media"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/app/Context/AuthContext"
import { useCart } from "@/app/Context/CartContext"
import { useDeleteCartItemsMutation } from "@/app/features/courses/courseApi";

const mockSuggestedCourses = [
  {
    id: 4,
    title: "JavaScript Advanced Concepts",
    instructor: "Phạm Văn JS",
    image: "",
    originalPrice: 1500000,
    salePrice: 900000,
    duration: "20 giờ",
    lessons: 60,
    students: 9800,
    rating: 4.6,
    level: "Nâng cao",
    category: "Lập trình",
  },
  {
    id: 5,
    title: "Digital Marketing Complete",
    instructor: "Hoàng Thị Marketing",
    image: "",
    originalPrice: 1600000,
    salePrice: 1100000,
    duration: "30 giờ",
    lessons: 75,
    students: 7500,
    rating: 4.5,
    level: "Cơ bản",
    category: "Marketing",
  },
]

export default function CartPage() {
  const { isLoggedIn, user, logout } = useAuth();
  const { cartItems, cartCount, addItem, removeItem } = useCart();
  console.log(cartItems, "giỏ hàng")
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [savedItems, setSavedItems] = useState([])
  const [deleteCartItems] = useDeleteCartItemsMutation();

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
    exit: {
      opacity: 0,
      x: -100,
      transition: {
        duration: 0.3,
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
    return cartItems.reduce((total, item) => total + item.price, 0)
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

  const removeFromCart = (courseId) => {
    if(isLoggedIn){
      deleteCartItems({cartId: user?.result?.cart.cartId,courseId: courseId});
    }
    removeItem(courseId);
  }

  const saveForLater = (item) => {
    setSavedItems([...savedItems, item])
    removeItem(item.id)
  }

  const moveToCart = (item) => {
    addItem(item.id)
    setSavedItems(savedItems.filter((saved) => saved.id !== item.id))
  }

  const applyCoupon = () => {
    const mockCoupons = {
      SAVE20: { type: "percentage", value: 20, description: "Giảm 20%" },
      NEWUSER: { type: "fixed", value: 500000, description: "Giảm 500.000đ cho người dùng mới" },
      STUDENT: { type: "percentage", value: 15, description: "Giảm 15% cho sinh viên" },
    }

    if (mockCoupons[couponCode.toUpperCase()]) {
      setAppliedCoupon({
        code: couponCode.toUpperCase(),
        ...mockCoupons[couponCode.toUpperCase()],
      })
    }
  }

  const addToCart = (course) => {
    const existingItem = cartItems.find((item) => item.id === course.id)
    if (!existingItem) {
      setCartItems([...cartItems, course])
    }
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-8 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4"
          variants={itemVariants}
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8" />
              </motion.div>
              Giỏ hàng của bạn
            </h1>
            <p className="text-sm sm:text-base text-gray-600">{cartItems.length} khóa học trong giỏ hàng</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild variant="outline" className="w-full sm:w-auto bg-transparent">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Tiếp tục mua sắm
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {cartItems.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
            >
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h2>
            <p className="text-gray-600 mb-8">Hãy thêm một số khóa học tuyệt vời vào giỏ hàng của bạn!</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild size="lg">
                <Link href="/">Khám phá khóa học</Link>
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <motion.div variants={cardVariants} whileHover="hover">
                <Card>
                  <CardHeader>
                    <CardTitle>Khóa học trong giỏ hàng</CardTitle>
                    <CardDescription>Xem lại và chỉnh sửa các khóa học bạn muốn mua</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <AnimatePresence>
                      {cartItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          className="flex flex-col sm:flex-row gap-4 p-3 sm:p-4 border rounded-lg bg-white"
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          layout
                          whileHover={{ backgroundColor: "#fafafa" }}
                        >
                          <motion.div whileHover={{ scale: 1.05 }}>
                            <img
                              src={getImageURL(item.imageUrl, item.id) || "/placeholder.svg"}
                              alt={item.subtitle}
                              width={120}
                              height={80}
                              className="w-full sm:w-30 h-48 sm:h-20 rounded-lg object-cover"
                            />
                          </motion.div>

                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-4">
                              <div className="flex-1">
                                <h3 className="font-semibold text-base sm:text-lg mb-1">{item.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">Giảng viên: {item.instructorCourse.map((instructor) => instructor.name).join(", ")}</p>

                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-600 mb-3">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> 
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <BookOpen className="h-3 w-3" /> {item.sections.length} 
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge variant="secondary">{item.category}</Badge>
                                  <Badge variant="secondary">{getLevelText(item.levelCourse)}</Badge>
                                  <Badge variant="secondary">{item.topic}</Badge>
                                  <Badge className="bg-orange-500">Bestseller</Badge>
                                </div>
                              </div>

                              <div className="text-left sm:text-right">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                  <span className="text-lg font-bold text-green-600">
                                    {formatPrice(item.price || 0)} 
                                  </span>
                                  <span className="text-sm text-gray-500 line-through">
                                    {formatPrice(item.price || 0)}
                                  </span>
                                </div>

                                <div className="flex flex-row sm:flex-col gap-4 sm:gap-2">
                                  <motion.button
                                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                    whileHover={{ scale: 1.05 }}
                                    // onClick={() => saveForLater(item)}
                                  >
                                    <Heart className="h-3 w-3" />
                                    Lưu sau
                                  </motion.button>
                                  <motion.button
                                    className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => removeFromCart(item.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                    Xóa
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
              {savedItems.length > 0 && (
                <motion.div variants={cardVariants} whileHover="hover">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5" />
                        Đã lưu để mua sau ({savedItems.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {savedItems.map((item) => (
                        <motion.div
                          key={`saved-${item.id}`}
                          className="flex gap-4 p-4 border rounded-lg bg-gray-50"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ backgroundColor: "#f3f4f6" }}
                        >
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            width={80}
                            height={60}
                            className="rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">{item.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">giá tiền</p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-green-600">{formatPrice(item.price)}</span>
                              <div className="flex gap-2">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button size="sm" onClick={() => moveToCart(item)}>
                                    Thêm vào giỏ
                                  </Button>
                                </motion.div>
                                <motion.button
                                  className="text-sm text-red-600 hover:text-red-800"
                                  whileHover={{ scale: 1.05 }}
                                  onClick={() => setSavedItems(savedItems.filter((saved) => saved.id !== item.id))}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <motion.div variants={cardVariants} whileHover="hover">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      Khóa học gợi ý cho bạn
                    </CardTitle>
                    <CardDescription>Các khóa học phù hợp với sở thích của bạn</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {mockSuggestedCourses.map((course, index) => (
                        <motion.div
                          key={course.id}
                          className="flex flex-col sm:flex-row gap-3 p-3 border rounded-lg bg-white"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ backgroundColor: "#fafafa" }}
                        >
                          <Image
                            src={course.image || "/placeholder.svg"}
                            alt={course.title}
                            width={60}
                            height={45}
                            className="w-full sm:w-15 h-32 sm:h-11 rounded object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm mb-1">giá tiền</h4>
                            <p className="text-xs text-gray-600 mb-2">giá tiền</p>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <span className="text-sm font-bold text-green-600">{formatPrice(course.salePrice)}</span>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  // onClick={() => addToCart(course)}
                                  className="w-full sm:w-auto"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Thêm
                                </Button>
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div variants={cardVariants} whileHover="hover">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="h-5 w-5" />
                      Mã giảm giá
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!appliedCoupon ? (
                      <div className="space-y-3">
                        <Input
                          placeholder="Nhập mã giảm giá"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button onClick={applyCoupon} className="w-full bg-transparent" variant="outline">
                            Áp dụng mã
                          </Button>
                        </motion.div>
                        <div className="text-xs text-gray-500">
                          <p>Mã khuyến mãi có sẵn:</p>
                          <p>• SAVE20 - Giảm 20%</p>
                          <p>• NEWUSER - Giảm 500k</p>
                          <p>• STUDENT - Giảm 15%</p>
                        </div>
                      </div>
                    ) : (
                      <motion.div
                        className="p-3 bg-green-50 border border-green-200 rounded-lg"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
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
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={cardVariants} whileHover="hover">
                <Card>
                  <CardHeader>
                    <CardTitle>Tổng thanh toán</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Tạm tính ({cartItems.length} khóa học):</span>
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
                      <Button asChild className="w-full mt-4" size="lg">
                        {cartItems.length > 0 ? (
                          <Link href="/checkout?redirect=/cart" className="flex items-center justify-center gap-2">
                            Tiến hành thanh toán
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-red-600">Vui lòng chọn khóa học</span>
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        )}
                      </Button>
                    </motion.div>

                    <div className="text-xs text-gray-500 text-center mt-3">Bảo mật thanh toán với SSL 256-bit</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={cardVariants} whileHover="hover">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Quyền lợi khi mua khóa học:</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[
                        "Truy cập trọn đời",
                        "Học trên mọi thiết bị",
                        "Chứng chỉ hoàn thành",
                        "Hỗ trợ Q&A từ giảng viên",
                        "Cập nhật nội dung mới",
                        "Hoàn tiền trong 30 ngày",
                      ].map((benefit, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center gap-2 text-sm"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
