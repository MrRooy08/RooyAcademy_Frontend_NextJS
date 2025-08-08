"use client"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Eye, CheckCircle, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { useGetCoursesByStatusQuery } from "@/app/features/courses/courseApi"

const getStatusBadge = (status) => {
  switch (status) {
    case "PROCESSING":
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Đang xử lý
        </Badge>
      )
    case "PENDING":
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          <Clock className="w-3 h-3 mr-1" />
          Chờ duyệt
        </Badge>
      )
    case "APPROVED":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Đã duyệt
        </Badge>
      )
    case "REJECTED":
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Từ chối
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const formatPrice = (price) => {
  if (price === null) return "Miễn phí"
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function AdminCoursesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("all")
  const { data, isLoading, isFetching, isError, refetch } = useGetCoursesByStatusQuery(
    { status: statusFilter, page: currentPage - 1, size: 5 },
    {
      refetchOnMountOrArgChange: true,
      // pollingInterval: 3000,
    }
  );
  const courses = data ? data.result.content : [];
  const totalPages = data?.result?.totalPages ?? 1
  const totalElements = data?.result?.totalElements ?? 0
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course?.instructorCourse[0]?.name?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || course?.approveStatus === statusFilter
    const matchesCategory = categoryFilter === "all" || course?.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

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

  const stats = {
    total: courses.length,
    pending: courses.filter((c) => c.approveStatus === "PENDING" || c.approveStatus === "PROCESSING").length,
    approved: courses.filter((c) => c.approveStatus === "APPROVED").length,
    rejected: courses.filter((c) => c.approveStatus === "REJECTED").length,
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý khóa học</h1>
            <p className="text-gray-600 mt-1">Duyệt và quản lý các khóa học đang chờ phê duyệt</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng khóa học</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đã duyệt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Từ chối</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm khóa học, giảng viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="PENDING">Chờ duyệt</SelectItem>
              <SelectItem value="PROCESSING">Đang xử lý</SelectItem>
              <SelectItem value="APPROVED">Đã duyệt</SelectItem>
              <SelectItem value="REJECTED">Từ chối</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              <SelectItem value="Khoa học dữ liệu">Khoa học dữ liệu</SelectItem>
              <SelectItem value="Lập trình web">Lập trình web</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle>Danh sách khóa học ({filteredCourses.length})</CardTitle>
              <CardDescription>Quản lý và duyệt các khóa học đang chờ phê duyệt</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Khóa học</TableHead>
                      <TableHead>Giảng viên</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead>Giá</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCourses.map((course, index) => (
                      <motion.tr
                        key={course.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={getPreviewUrl(course.imageUrl, course.id, process.env.NEXT_PUBLIC_API_URL_IMAGE)}
                              alt={course.name}
                              width={60}
                              height={40}
                              className="rounded-md object-cover"
                            />
                            <div>
                              <div className="font-medium text-sm">{course.name}</div>
                              <div className="text-xs text-gray-500 line-clamp-1">{course.subtitle}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="items-center">
                            {course.instructorCourse.map((instructor, index) => (
                              <div key={index} className="flex items-center space-x-2 p-1">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="text-xs">
                                    {instructor.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{instructor.name}</span>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{course.category}</div>
                            <div className="text-xs text-gray-500">{course.topic}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">{formatPrice(course.price)}</span>
                        </TableCell>
                        <TableCell>{getStatusBadge(course.approveStatus)}</TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">{formatDate(course.createdAt)}</span>
                        </TableCell>
                        <TableCell>
                          <Link href={{
                            pathname: `/dashboard/courses/${course.id}`,
                            query: { role: 'ADMIN' }
                          }}
                          >
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              Xem chi tiết
                            </Button>
                          </Link>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {courses.length > 0 && (
                <div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(currentPage - 1)}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>

                      {/* First + Ellipsis */}
                      {currentPage > 3 && (
                        <>
                          <PaginationItem>
                            <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
                          </PaginationItem>
                          {currentPage > 4 && (
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}
                        </>
                      )}

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }
                        if (pageNum < 1 || pageNum > totalPages) return null
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => handlePageChange(pageNum)}
                              isActive={currentPage === pageNum}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}
                      {currentPage < totalPages - 2 && (
                        <>
                          {currentPage < totalPages - 3 && (
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}
                          <PaginationItem>
                            <PaginationLink onClick={() => handlePageChange(totalPages)}>{totalPages}</PaginationLink>
                          </PaginationItem>
                        </>
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(currentPage + 1)}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                  <div className="text-center mt-4 text-sm text-gray-600">
                    Trang {currentPage} / {totalPages} – Hiển thị {courses.length} khóa học (tổng {totalElements})
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div >
  )
}
