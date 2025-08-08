import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import getCourseById from '@/lib/getCourseById'

export default async function DraftCoursePage({ params }) {
  const { id } = params
  const { isEnabled } = draftMode()

  // Nếu chưa bật chế độ nháp → không cho xem
  if (!isEnabled) return notFound()

  const course = await getCourseById(id) // lấy tất cả, không lọc theo status

  // Nếu khóa học đã publish thì không cho xem nữa
  if (course.status === 'PUBLISHED') return notFound()

  return (
    <div>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <span>(Chế độ xem trước)</span>
    </div>
  )
}
