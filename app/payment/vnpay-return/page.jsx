"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { CheckCircle, XCircle, CreditCard, Calendar, Hash, Building2, Receipt, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

function PaymentResultContent() {
  const searchParams = useSearchParams()

  // Lấy các thông tin từ query parameters của VNPay (phiên bản mới)
  const status = searchParams.get("status")
  const courseId = searchParams.get("courseId")
  const transactionNo = searchParams.get("transactionNo")
  const amount = searchParams.get("amount")
  const bankCode = searchParams.get("bankCode")
  const cardType = searchParams.get("cardType")
  const bankTranNo = searchParams.get("bankTranNo")
  const payDate = searchParams.get("payDate")
  const terminalId = searchParams.get("terminalId")
  const responseCode = searchParams.get("responseCode")

  // Xử lý trạng thái thanh toán (success nếu status="success" hoặc responseCode="00")
  const isSuccess = status === "success" || responseCode === "00"

  // Format số tiền
  const formatAmount = (amount) => {
    if (!amount) return "0 VNĐ"
    const numAmount = Number.parseInt(amount) / 100 // VNPay trả về số tiền * 100
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numAmount)
  }

  // Format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    // VNPay format: yyyyMMddHHmmss
    const year = dateString.substring(0, 4)
    const month = dateString.substring(4, 6)
    const day = dateString.substring(6, 8)
    const hour = dateString.substring(8, 10)
    const minute = dateString.substring(10, 12)
    const second = dateString.substring(12, 14)

    return `${day}/${month}/${year} ${hour}:${minute}:${second}`
  }

  // Lấy tên ngân hàng từ mã
  const getBankName = (bankCode) => {
    const banks = {
      NCB: "Ngân hàng NCB",
      AGRIBANK: "Ngân hàng Agribank",
      SCB: "Ngân hàng SCB",
      SACOMBANK: "Ngân hàng Sacombank",
      EXIMBANK: "Ngân hàng Eximbank",
      MSBANK: "Ngân hàng Maritime Bank",
      NAMABANK: "Ngân hàng Nam A Bank",
      VNMART: "Ví điện tử VnMart",
      VIETINBANK: "Ngân hàng Vietinbank",
      VIETCOMBANK: "Ngân hàng Vietcombank",
      HDBANK: "Ngân hàng HDBank",
      DONGABANK: "Ngân hàng Dong A Bank",
      TPBANK: "Ngân hàng TPBank",
      OJB: "Ngân hàng OceanBank",
      BIDV: "Ngân hàng BIDV",
      TECHCOMBANK: "Ngân hàng Techcombank",
      VPBANK: "Ngân hàng VPBank",
      MBBANK: "Ngân hàng MBBank",
      ACB: "Ngân hàng ACB",
      OCB: "Ngân hàng OCB",
      IVB: "Ngân hàng IVB",
      VISA: "Thẻ quốc tế Visa",
      MASTERCARD: "Thẻ quốc tế MasterCard",
      JCB: "Thẻ quốc tế JCB",
    }
    return banks[bankCode] || bankCode || "N/A"
  }

  // Animation variants
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

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  }

  const infoItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <motion.div className="flex justify-center mb-4" variants={iconVariants}>
            {isSuccess ? (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <CheckCircle className="h-16 w-16 text-green-500" />
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <XCircle className="h-16 w-16 text-red-500" />
              </motion.div>
            )}
          </motion.div>
          <motion.h1 className="text-3xl font-bold text-gray-900 mb-2" variants={itemVariants}>
            {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại!"}
          </motion.h1>
          <motion.p className="text-gray-600" variants={itemVariants}>
            {isSuccess ? "Giao dịch của bạn đã được xử lý thành công." : "Có lỗi xảy ra trong quá trình thanh toán."}
          </motion.p>
        </motion.div>

        <motion.div className="grid gap-6 md:grid-cols-2" variants={containerVariants}>
          {/* Thông tin giao dịch */}
          <motion.div variants={cardVariants} whileHover="hover">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                    <Receipt className="h-5 w-5" />
                  </motion.div>
                  Thông tin giao dịch
                </CardTitle>
                <CardDescription>Chi tiết về giao dịch thanh toán</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div className="flex justify-between items-center" variants={infoItemVariants}>
                  <span className="text-sm font-medium text-gray-500">Trạng thái</span>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Badge variant={isSuccess ? "default" : "destructive"}>
                      {isSuccess ? "Thành công" : "Thất bại"}
                    </Badge>
                  </motion.div>
                </motion.div>

                <Separator />

                <motion.div className="flex justify-between items-center" variants={infoItemVariants}>
                  <span className="text-sm font-medium text-gray-500">Số tiền</span>
                  <motion.span className="text-lg font-bold text-green-600" whileHover={{ scale: 1.05 }}>
                    {formatAmount(amount)}
                  </motion.span>
                </motion.div>

                <motion.div className="flex justify-between items-center" variants={infoItemVariants}>
                  <span className="text-sm font-medium text-gray-500">Mã giao dịch</span>
                  <motion.span
                    className="text-sm font-mono bg-gray-100 px-2 py-1 rounded"
                    whileHover={{ backgroundColor: "#e5e7eb" }}
                  >
                    {transactionNo || "N/A"}
                  </motion.span>
                </motion.div>

                <motion.div className="flex justify-between items-center" variants={infoItemVariants}>
                  <span className="text-sm font-medium text-gray-500">Mã GD VNPay</span>
                  <motion.span
                    className="text-sm font-mono bg-gray-100 px-2 py-1 rounded"
                    whileHover={{ backgroundColor: "#e5e7eb" }}
                  >
                    {bankTranNo || "N/A"}
                  </motion.span>
                </motion.div>

                <motion.div className="flex justify-between items-center" variants={infoItemVariants}>
                  <span className="text-sm font-medium text-gray-500">Thời gian</span>
                  <span className="text-sm flex items-center gap-1">
                    <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                      <Calendar className="h-4 w-4" />
                    </motion.div>
                    {formatDate(payDate)}
                  </span>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Thông tin thanh toán */}
          <motion.div variants={cardVariants} whileHover="hover">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <motion.div whileHover={{ rotateY: 180 }} transition={{ duration: 0.6 }}>
                    <CreditCard className="h-5 w-5" />
                  </motion.div>
                  Phương thức thanh toán
                </CardTitle>
                <CardDescription>Thông tin về ngân hàng và thẻ thanh toán</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div className="flex justify-between items-center" variants={infoItemVariants}>
                  <span className="text-sm font-medium text-gray-500">Ngân hàng</span>
                  <span className="text-sm flex items-center gap-1">
                    <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.2 }}>
                      <Building2 className="h-4 w-4" />
                    </motion.div>
                    {getBankName(bankCode)}
                  </span>
                </motion.div>

                <Separator />

                <motion.div className="flex justify-between items-center" variants={infoItemVariants}>
                  <span className="text-sm font-medium text-gray-500">Loại thẻ</span>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Badge variant="outline">{cardType || "N/A"}</Badge>
                  </motion.div>
                </motion.div>
                <motion.div className="flex justify-between items-center" variants={infoItemVariants}>
                  <span className="text-sm font-medium text-gray-500">Mã GD Ngân hàng</span>
                  <motion.span
                    className="text-sm font-mono bg-gray-100 px-2 py-1 rounded"
                    whileHover={{ backgroundColor: "#e5e7eb" }}
                  >
                    {/* {vnp_BankTranNo || "N/A"} */}
                  </motion.span>
                </motion.div>

                <motion.div className="flex justify-between items-center" variants={infoItemVariants}>
                  <span className="text-sm font-medium text-gray-500">Mã phản hồi</span>
                  <motion.span
                    className="text-sm font-mono bg-gray-100 px-2 py-1 rounded"
                    whileHover={{ backgroundColor: "#e5e7eb" }}
                  >
                    {responseCode || "N/A"}
                  </motion.span>
                </motion.div>

                <motion.div className="flex justify-between items-center" variants={infoItemVariants}>
                  <span className="text-sm font-medium text-gray-500">Terminal</span>
                  <motion.span
                    className="text-sm font-mono bg-gray-100 px-2 py-1 rounded"
                    whileHover={{ backgroundColor: "#e5e7eb" }}
                  >
                    {terminalId || "N/A"}
                  </motion.span>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        

        {/* Actions */}
        <motion.div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center" variants={containerVariants}>
          <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild variant="outline">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Về trang chủ
              </Link>
            </Button>
          </motion.div>

          {isSuccess && (
            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild>
                <Link href="/orders">Xem đơn hàng</Link>
              </Button>
            </motion.div>
          )}

          {!isSuccess && (
            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild>
                <Link href="/checkout">Thử lại</Link>
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Debug info (chỉ hiển thị trong development) */}
        {process.env.NODE_ENV === "development" && (
          <motion.div variants={cardVariants} whileHover="hover" className="mt-8">
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-sm">Debug Info (Development Only)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
                  {JSON.stringify(Object.fromEntries(searchParams.entries()), null, 2)}
                </pre>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
        <motion.div
          className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <motion.div
              className="rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
            <motion.p
              className="text-gray-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Đang tải thông tin thanh toán...
            </motion.p>
          </div>
        </motion.div>
      }
    >
      <PaymentResultContent />
    </Suspense>
  )
}
