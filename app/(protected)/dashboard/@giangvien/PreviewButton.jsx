// Ví dụ trong dashboard của giảng viên
import Link from 'next/link';

export default function PreviewButton({ courseId }) {
  return (
    <Link
      href={`/api/draft/enable?redirect=/courses/${courseId}`}
      className="text-blue-600 underline"
    >
      🔍 Xem trước bản nháp
    </Link>
  );
}
