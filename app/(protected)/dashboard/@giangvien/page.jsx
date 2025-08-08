"use client";

import React, { useState, useEffect } from 'react';
import {
  Card,
  Grid,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Separator,
  Typography,
  Box,
} from '@mui/material';
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import PaymentIcon from '@mui/icons-material/Payment';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AddIcon from '@mui/icons-material/Add';
import CourseListItem from "./CourseListItem";
import { Badge } from "@/components/ui/badge"
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import {
  ChevronDown, ChevronUp, EyeOff, Clock, Bell,
  Check,
  X,
} from "lucide-react"
import { useGetCoursesByStatusQuery, useGetInvitationQuery, useGetCourseByCourseIdQuery, useAcceptInvitationMutation, useRejectInvitationMutation } from "@/app/features/courses/courseApi";

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("DRAFT");
  const [showHiddenSection, setShowHiddenSection] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedHiddenInvitation, setSelectedHiddenInvitation] = useState(null);
  const { data: invitationData, isLoading: invitationLoading, isFetching: invitationIsFetching } = useGetInvitationQuery(
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  )
  const { data, isLoading, isFetching, isError, refetch } = useGetCoursesByStatusQuery(
    { status: activeTab, page: currentPage - 1, size: 5 },
    {
      // Always refetch when the tab (status) or pagination changes
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );
  const courses = data ? data.result.content : [];
  console.log(courses)
  const totalPages = data?.result?.totalPages ?? 1
  const totalElements = data?.result?.totalElements ?? 0;
  const hiddenPendingInvitations = invitationData?.result?.length > 0 ? invitationData.result : [];
  const { data: selectedCourseData, isLoading: selectedCourseLoading } = useGetCourseByCourseIdQuery(selectedHiddenInvitation, { skip: !selectedHiddenInvitation });
  const selectedCourse = selectedCourseData?.result || [];
  const [acceptInvitation] = useAcceptInvitationMutation();
  const [rejectInvitation] = useRejectInvitationMutation();
  const stats = [
    {
      title: 'Tổng số học viên',
      value: '1,234',
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#3b82f6' }} />,
      color: 'bg-blue-50'
    },
    {
      title: 'Tổng số khóa học',
      value: '56',
      icon: <SchoolIcon sx={{ fontSize: 40, color: '#10b981' }} />,
      color: 'bg-green-50'
    },
    {
      title: 'Doanh thu tháng',
      value: '45.5M',
      icon: <PaymentIcon sx={{ fontSize: 40, color: '#f59e0b' }} />,
      color: 'bg-yellow-50'
    },
    {
      title: 'Khóa học chờ duyệt',
      value: '0',
      icon: <PendingActionsIcon sx={{ fontSize: 40, color: '#ef4444' }} />,
      color: 'bg-red-50'
    }
  ];

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const LEVEL_MAP = {
    TD01: "Sơ cấp",
    TD02: "Trung cấp",
    TD03: "Cấp chuyên gia",
    TD04: "Tất cả trình độ",
  };

  const handleAcceptInvitation = async () => {
    try {
      const response = await acceptInvitation({ courseId: selectedHiddenInvitation, status: true }).unwrap();
      console.log(response);
      setOpenDialog(false);
      setSelectedHiddenInvitation(null);
    } catch (error) {
      console.error("Error accepting invitation:", error);
    }
  }

  const handleRejectInvitation = async () => {
    try {
      const response = await rejectInvitation({ courseId: selectedHiddenInvitation, status: false }).unwrap();
      console.log(response);
      setOpenDialog(false);
      setSelectedHiddenInvitation(null);
    } catch (error) {
      console.error("Error rejecting invitation:", error);
    }
  }

  // Reset page to the first one whenever the active tab changes
  const handleTabChange = (value) => {
    setActiveTab(value);
    setCurrentPage(1);
  }

  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-6">
        Dashboard giảng viên
      </Typography>

      <div className="space-y-4">
        <div className="flex items-center gap-2 pt-4 border-t">
          <Button
            variant="ghost"
            onClick={() => setShowHiddenSection(!showHiddenSection)}
            className="flex items-center gap-2 hover:text-foreground transition-all duration-200"
          >
            {showHiddenSection ? (
              <ChevronUp className="h-4 w-4 transition-transform duration-200" />
            ) : (
              <ChevronDown className="h-4 w-4 transition-transform duration-200" />
            )}
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-500" />
              <h2 className="text-xl font-semibold">Lời mời giảng dạy mới</h2>
              <Badge variant="destructive" className="animate-pulse">
                {hiddenPendingInvitations.length}
              </Badge>
            </div>
          </Button>
        </div>
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${showHiddenSection ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="grid gap-3 pt-2">
            {hiddenPendingInvitations?.map((invitation, index) => (
              <Card
                key={index}
                className="border-dashed border-muted-foreground/30 bg-muted/20 transition-all duration-300 hover:shadow-md hover:bg-muted/30 animate-in slide-in-from-right-5"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-sm text-muted-foreground">
                          {invitation.status}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {invitation.courseId}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="transition-all duration-200 hover:scale-105 bg-transparent"
                        onClick={() => {
                          setOpenDialog(true)
                          setSelectedHiddenInvitation(invitation.courseId)
                        }}
                      >
                        <EyeOff className="h-4 w-4 mr-2" />
                        Hiện
                      </Button>
                    </div>
                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogDescription>
                        </DialogDescription>
                        <DialogHeader>
                          <DialogTitle className="flex items-center justify-between">
                            {selectedCourse.name}
                            <Badge variant="outline" className="text-orange-600 border-orange-600">
                              <Clock className="w-3 h-3 mr-1" />
                              {invitation.time}
                            </Badge>
                          </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 mt-4">
                          <Card className="border-l-4 border-l-orange-500/50">
                            <CardContent className="space-y-4">
                              <div className="flex items-center gap-3">
                                <div>
                                  {selectedCourse?.instructorCourse
                                    ?.filter((instructor) => instructor.isActive === "Active")
                                    .map((instructor, index) => {
                                      return (
                                        <span key={instructor.instructor} className="flex items-center mb-1">
                                          <p>{instructor.name}</p>
                                          <Badge
                                            variant="outline"
                                            className="text-sm ml-2 text-muted-foreground"
                                          >
                                            {instructor.isOwner ? "Giảng viên chính" : "Giảng viên phụ"}
                                          </Badge>
                                        </span>
                                      );
                                    })}
                                </div>
                              </div>

                              <div
                                className="ql-editor leading-relaxed break-words "
                                dangerouslySetInnerHTML={{ __html: selectedCourse.description }}
                              />
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">Thể loại:</span>
                                  <p className="text-muted-foreground">{selectedCourse.parentcategory}</p>
                                </div>
                                <div>
                                  <span className="font-medium">Thể loại con: </span>
                                  <p className="text-muted-foreground">{selectedCourse.category || "Chưa có thông tin"}</p>
                                </div>
                                <div>
                                  <span className="font-medium">Cấp độ:</span>
                                  <p className="text-muted-foreground">{LEVEL_MAP[selectedCourse.levelCourse] || "Chưa có thông tin"}</p>
                                </div>
                                <div>
                                  <span className="font-medium">Chủ đề:</span>
                                  <p className="text-muted-foreground">{selectedCourse.topic || "Chưa có thông tin"}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium mb-2">Quyền của bạn trong khoá học:</h4>
                            <div className="flex flex-wrap gap-2">
                              {invitation.permissions.map((permission, index) => {
                                return (
                                  <Badge key={index} variant="secondary">{permission}</Badge>
                                )
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t mt-6">
                          <div className="flex gap-2">
                            <Button
                              className="transition-all duration-200 hover:scale-105"
                              onClick={() => {
                                handleAcceptInvitation(invitation.courseId)
                              }}
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Chấp nhận
                            </Button>
                            <Button
                              variant="outline"
                              className="transition-all duration-200 hover:scale-105"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Từ chối
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card className={`${stat.color} h-full`}>
              <CardContent>
                <Box className="flex items-center justify-between">
                  <div>
                    <Typography variant="h6" className="text-gray-600">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" className="font-bold mt-2">
                      {stat.value}
                    </Typography>
                  </div>
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <main className="p-4 mt-10 md:p-6 overflow-hidden bg-white">
        <Tabs defaultValue="DRAFT" value={activeTab} onValueChange={handleTabChange}>
          <div className="mb-8 items-center justify-between gap-4 ">
            <TabsList className="grid  grid-cols-12 rounded-2xl p-1">
              <TabsTrigger value="DRAFT" className="rounded-xl data-[state=active]:rounded-xl col-span-3">
                Khoá học đang soạn thảo
              </TabsTrigger>
              <TabsTrigger value="PROCESSING" className="rounded-xl data-[state=active]:rounded-xl col-span-3">
                Khoá học chờ duyệt
              </TabsTrigger>
              <TabsTrigger value="APPROVED" className="rounded-xl data-[state=active]:rounded-xl col-span-3">
                Khoá học đã duyệt
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="DRAFT" className="space-y-8 mt-0">
            <div className="flex justify-end">
              <Link href="/dashboard/create?role=INSTRUCTOR">
                <Button
                  className="gap-1 ">
                  <AddIcon />
                  Tạo khóa học
                </Button>
              </Link>
            </div>
            <Card className="p-6 mt-6 shadow-lg border-2 border-gray-300">
              <div className="space-y-4">
                {courses.filter((course) => course.isActive === "DRAFT").length > 0 ? (
                  courses.filter((course) => course.isActive === "DRAFT" && course.approveStatus !== "PROCESSING").map((course) => (
                    <CourseListItem key={course.id} course={course} />
                  ))
                ) : (
                  <p className="text-center text-gray-500">Không có khóa học nào</p>
                )}
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="PROCESSING" className="space-y-8 mt-0">
            <div className="space-y-4">
              {courses.filter((course) => course.approveStatus === "PROCESSING").length > 0 ? (
                courses.filter((course) => course.approveStatus === "PROCESSING").map((course) => (
                  <CourseListItem key={course.id} course={course} />
                ))
              ) : (
                <p className="text-center text-gray-500">Không có khóa học nào</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="APPROVED" className="space-y-8 mt-0">
            <Card className="p-6 mt-6">
              <div className="space-y-4">
                {courses.filter((course) => course.approveStatus === "APPROVED").length > 0 ? (
                  courses.filter((course) => course.approveStatus === "APPROVED").map((course) => (
                    <CourseListItem key={course.id} course={course} />
                  ))
                ) : (
                  <p className="text-center text-gray-500">Không có khóa học nào</p>
                )}
              </div>
            </Card>
          </TabsContent>
          {courses.length > 0 && (
            <div className='m-3'>
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

                  {/* Dynamic Pages */}
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

                  {/* Last + Ellipsis */}
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
              {/* Footer info */}
              <div className="text-center mt-4 text-sm text-gray-600">
                Trang {currentPage} / {totalPages} – Hiển thị {courses.length} khóa học (tổng {totalElements})
              </div>
            </div>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;