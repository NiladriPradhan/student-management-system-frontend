/**
 * TEACHER API INTEGRATION - USAGE EXAMPLES
 * 
 * This file demonstrates how to use the Teacher Service API
 * in your React components. Copy patterns from here into your components.
 */

import {
  createTeacher,
  deleteTeacher,
  getTeachers,
  searchTeachers,
  updateTeacher,
} from "../services/teacher.service";
import { getApiErrorMessage } from "../services/api";
import type { TeacherFormValues } from "../types/teacher";

// ============================================================================
// EXAMPLE 1: FETCH ALL TEACHERS (Used in Teachers.tsx)
// ============================================================================

export async function exampleFetchAllTeachers() {
  try {
    const response = await getTeachers();
    console.log("All teachers:", response.teachers);
    console.log("Total count:", response.total);
    return response.teachers;
  } catch (error) {
    const message = getApiErrorMessage(error);
    console.error("Failed to fetch teachers:", message);
    // Display message in snackbar or alert
    return [];
  }
}

// ============================================================================
// EXAMPLE 2: SEARCH TEACHERS (Used in Teachers.tsx with debounce)
// ============================================================================

export async function exampleSearchTeachers(keyword: string) {
  if (!keyword.trim()) {
    return exampleFetchAllTeachers();
  }

  try {
    const response = await searchTeachers(keyword);
    console.log("Search results:", response.teachers);
    console.log(`Found ${response.total} teachers`);
    return response.teachers;
  } catch (error) {
    const message = getApiErrorMessage(error);
    console.error("Search failed:", message);
    return [];
  }
}

// ============================================================================
// EXAMPLE 3: CREATE NEW TEACHER (Used in Teachers.tsx)
// ============================================================================

export async function exampleCreateTeacher() {
  const formValues: TeacherFormValues = {
    name: "Prof. Robert Smith",
    email: "robert@school.com",
    phone: "+1234567890",
    subject: "Mathematics",
    employment_type: "full_time",
    gender: "Male",
    date_of_birth: "1985-03-15",
    address: "123 Main Street, Springfield, IL",
    profile_image: "https://example.com/profiles/robert.jpg",
  };

  try {
    const response = await createTeacher(formValues);
    const newTeacher = typeof response === 'number' ? { id: response } : response;
    console.log("Teacher created successfully:", newTeacher);
    console.log("New teacher ID:", newTeacher.id);

    // Use newTeacher data:
    // - Add to table state: setTeachers([newTeacher, ...teachers])
    // - Show success notification
    // - Close form modal
    return newTeacher;
  } catch (error) {
    const message = getApiErrorMessage(error);
    console.error("Failed to create teacher:", message);

    // Example error cases:
    // - "Email already exists" (409)
    // - "Invalid email format" (400)
    // - "Server error" (500)
    // - "Network error" (connection issue)

    // Show error in form or snackbar
    return null;
  }
}

// ============================================================================
// EXAMPLE 4: UPDATE EXISTING TEACHER (Used in Teachers.tsx)
// ============================================================================

export async function exampleUpdateTeacher(teacherId: number) {
  const updatedValues: TeacherFormValues = {
    name: "Prof. Robert Smith Jr.",
    email: "robert.smith@newschool.com",
    phone: "+9876543210",
    subject: "Advanced Mathematics",
    employment_type: "full_time",
    gender: "Male",
    date_of_birth: "1985-03-15",
    address: "456 Oak Avenue, Springfield, IL",
    profile_image: "https://example.com/profiles/robert-updated.jpg",
  };

  try {
    const updatedTeacher = await updateTeacher(teacherId, updatedValues);
    console.log("Teacher updated successfully:", updatedTeacher);

    // Action after update:
    // - Replace teacher in table state
    // - Show success snackbar
    // - Close edit form
    return updatedTeacher;
  } catch (error) {
    const message = getApiErrorMessage(error);
    console.error("Failed to update teacher:", message);
    return null;
  }
}

// ============================================================================
// EXAMPLE 5: DELETE TEACHER (Used in Teachers.tsx)
// ============================================================================

export async function exampleDeleteTeacher(teacherId: number) {
  try {
    const result = await deleteTeacher(teacherId);
    console.log("Teacher deleted successfully:", result);

    // Action after delete:
    // - Remove teacher from state: teachers.filter(t => t.id !== teacherId)
    // - Show success snackbar
    // - Close delete confirmation dialog
    return true;
  } catch (error) {
    const message = getApiErrorMessage(error);
    console.error("Failed to delete teacher:", message);

    // Possible errors:
    // - "Teacher not found" (404)
    // - "Permission denied" (403)
    // - Server errors

    return false;
  }
}

// ============================================================================
// EXAMPLE 6: COMPLETE CRUD FLOW IN A COMPONENT (Pattern from Teachers.tsx)
// ============================================================================

export async function exampleCompleteFlow() {
  try {
    // 1. FETCH ALL TEACHERS
    console.log("Step 1: Fetching all teachers...");
    const response = await getTeachers();
    const teachers = response.teachers;
    console.log(`Found ${teachers.length} teachers`);

    // 2. SEARCH TEACHERS
    console.log("Step 2: Searching for teachers...");
    const searchResult = await searchTeachers("Mathematics");
    console.log(`Search found ${searchResult.total} results`);

    // 3. CREATE NEW TEACHER
    console.log("Step 3: Creating new teacher...");
    const formValues: TeacherFormValues = {
      name: "Dr. Emily Johnson",
      email: "emily@school.com",
      phone: "+1987654321",
      subject: "Physics",
      employment_type: "full_time",
      gender: "Female",
      date_of_birth: "1990-06-20",
      address: "789 Pine Road, Springfield, IL",
      profile_image: "https://example.com/profiles/emily.jpg",
    };
    const newTeacher = await createTeacher(formValues);
    const newTeacherId =
      typeof newTeacher === "number" ? newTeacher : (newTeacher as any).id;
    console.log("Created teacher ID:", newTeacherId);

    // 4. UPDATE THE TEACHER
    console.log("Step 4: Updating teacher...");
    await updateTeacher(newTeacherId, {
      ...formValues,
      subject: "Advanced Physics",
    });
    console.log("Updated subject: Advanced Physics");

    // 5. DELETE THE TEACHER
    console.log("Step 5: Deleting teacher...");
    await deleteTeacher(newTeacherId);
    console.log("Teacher deleted");

    console.log("All operations completed successfully!");
  } catch (error) {
    const message = getApiErrorMessage(error);
    console.error("Operation failed:", message);
  }
}

// ============================================================================
// EXAMPLE 7: ERROR HANDLING PATTERNS
// ============================================================================

export async function exampleErrorHandling() {
  // Pattern 1: Try-catch with user feedback
  try {
    const teachers = (await getTeachers()).teachers;
    console.log("Success:", teachers);
  } catch (error) {
    // const message = getApiErrorMessage(error);
    // Show in snackbar: message
    // Show in UI: "Failed to load teachers"
  }

  // Pattern 2: Specific error handling
  try {
    // const newTeacher = await createTeacher({
    //   name: "Test",
    //   email: "test@school.com",
    //   phone: "1234567890",
    //   subject: "Test",
    //   employment_type: "full_time",
    //   gender: "Male",
    //   date_of_birth: "2000-01-01",
    //   address: "Test",
    //   profile_image: "",
    // });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("409")) {
        console.log("Email already exists");
      } else if (error.message.includes("401")) {
        console.log("Session expired - redirect to login");
      } else {
        console.log("Unknown error");
      }
    }
  }
}

// ============================================================================
// EXAMPLE 8: FORM VALIDATION BEFORE API CALL
// ============================================================================

export async function exampleFormValidation(formValues: TeacherFormValues) {
  // Validation before sending to API
  const errors: Record<string, string> = {};

  if (!formValues.name.trim()) {
    errors.name = "Name is required";
  }

  if (!formValues.email.trim()) {
    errors.email = "Email is required";
  } else if (!formValues.email.includes("@")) {
    errors.email = "Invalid email format";
  }

  if (!formValues.phone.trim()) {
    errors.phone = "Phone is required";
  }

  if (!formValues.subject.trim()) {
    errors.subject = "Subject is required";
  }

  if (!formValues.gender.trim()) {
    errors.gender = "Gender is required";
  }

  if (!formValues.date_of_birth.trim()) {
    errors.date_of_birth = "Date of birth is required";
  }

  // Check if there are validation errors
  if (Object.keys(errors).length > 0) {
    console.log("Validation errors:", errors);
    return { success: false, errors };
  }

  // All valid - proceed with API call
  try {
    const teacher = await createTeacher(formValues);
    console.log("Teacher created:", teacher);
    return { success: true, teacher };
  } catch (error) {
    const message = getApiErrorMessage(error);
    return { success: false, error: message };
  }
}

// ============================================================================
// EXAMPLE 9: INTEGRATION WITH REACT STATE (Teachers.tsx Pattern)
// ============================================================================

export async function exampleReactIntegration() {
  // This shows the pattern used in Teachers.tsx

  // State setup (in your component):
  // const [teachers, setTeachers] = useState<Teacher[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [submitLoading, setSubmitLoading] = useState(false);

  // Load teachers on mount
  async function loadTeachers() {
    // setLoading(true);
    try {
      // const response = await getTeachers();
      // setTeachers(response.teachers);
    } catch (error) {
      // const msg = getApiErrorMessage(error);
      // showSnackbar(msg, "error");
    } finally {
      // setLoading(false);
    }
  }

  // Search with debounce
  async function handleSearch(keyword: string) {
    // setLoading(true);
    try {
      if (keyword.trim()) {
        // const result = await searchTeachers(keyword);
        // setTeachers(result.teachers);
      } else {
        await loadTeachers();
      }
    } catch (error) {
      // const msg = getApiErrorMessage(error);
      // showSnackbar(msg, "error");
    } finally {
      // setLoading(false);
    }
  }

  // Create teacher
  async function handleCreate(_formValues: TeacherFormValues) {
    // setSubmitLoading(true);
    try {
      // const newTeacher = await createTeacher(formValues);
      // setTeachers([newTeacher, ...teachers]);
      // showSnackbar("Teacher created successfully");
      // setFormOpen(false);
    } catch (error) {
      // const msg = getApiErrorMessage(error);
      // showSnackbar(msg, "error");
    } finally {
      // setSubmitLoading(false);
    }
  }

  // Update teacher
  async function handleUpdate(_id: number, _formValues: TeacherFormValues) {
    // setSubmitLoading(true);
    try {
      // const updated = await updateTeacher(id, formValues);
      // setTeachers(teachers.map(t => t.id === id ? updated : t));
      // showSnackbar("Teacher updated successfully");
      // setFormOpen(false);
    } catch (error) {
      // const msg = getApiErrorMessage(error);
      // showSnackbar(msg, "error");
    } finally {
      // setSubmitLoading(false);
    }
  }

  // Delete teacher
  async function handleDelete(id: number) {
    // setSubmitLoading(true);
    try {
      await deleteTeacher(id);
      // setTeachers(teachers.filter(t => t.id !== id));
      // showSnackbar("Teacher deleted successfully");
      // setDeleteOpen(false);
    } catch (error) {
      // const msg = getApiErrorMessage(error);
      // showSnackbar(msg, "error");
    } finally {
      // setSubmitLoading(false);
    }
  }

  return {
    loadTeachers,
    handleSearch,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}

// ============================================================================
// TESTING - Run these in browser console to test the API
// ============================================================================

/*
// In browser console, after Teachers.tsx page loads:

// 1. Fetch all teachers
await exampleFetchAllTeachers();

// 2. Search teachers
await exampleSearchTeachers("mathematics");

// 3. Create teacher
await exampleCreateTeacher();

// 4. Complete flow
await exampleCompleteFlow();

// Check all operations in Network tab
*/
