@PreAuthorize("hasRole('INSTRUCTOR')")
    public AddInstructorResponse addCoInstructor (String courseId , AddInstructorRequest request)
    {
        String username = authUtils.getCurrentUsername();
        Instructor instructor = userRepository.findInstructorByUsername(username).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED)
        );

        boolean isOwner = instructorCourseRepository.existsByCourse_IdAndInstructorAndIsOwnerTrue(courseId, instructor);
        if (!isOwner) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_EXISTED));
        Instructor invitedInstructor = userRepository.findInstructorByUsername(request.getInstructor())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        InstructorCourse instructorCourse = InstructorCourse.builder()
                .course(course)
                .instructor(invitedInstructor)
                .isOwner(false)
                .status(InviteStatus.PENDING)
                .isActive(ActiveStatus.Active)
                .pendingPermissionIds(request.getPermissions())
                .build();
        instructorCourseRepository.save(instructorCourse);

        return AddInstructorResponse.builder()
                .courseId(courseId)
                .instructorId(invitedInstructor.getId())
                .status("PENDING")
                .build();
    }