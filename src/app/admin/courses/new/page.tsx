import PageHeader from "@/components/PageHeader";
import { CourseForm } from "@/features/courses/components/CourseForm";

export default function Page() {
  return (
    <div className="container my-6 mx-auto">
      <PageHeader title="New Course" />
      <CourseForm />
    </div>
  );
}
