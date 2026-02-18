
// Using absolute URL since the frontend and backend run on different processes/ports
const API_BASE = 'http://localhost:5000/api';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown server error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchData = async () => {
  try {
    const res = await fetch(`${API_BASE}/data`);
    return await handleResponse(res);
  } catch (err: any) {
    console.error("API Connectivity Error:", err);
    throw new Error("SERVER_UNREACHABLE");
  }
};

// Students
export const postStudent = async (data: any) => {
  const res = await fetch(`${API_BASE}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const updateStudent = async (id: string, data: any) => {
  const res = await fetch(`${API_BASE}/students/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const deleteStudent = async (id: string) => {
  const res = await fetch(`${API_BASE}/students/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
};

// Teachers
export const postTeacher = async (data: any) => {
  const res = await fetch(`${API_BASE}/teachers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const updateTeacher = async (id: string, data: any) => {
  const res = await fetch(`${API_BASE}/teachers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const deleteTeacher = async (id: string) => {
  const res = await fetch(`${API_BASE}/teachers/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
};

// Courses
export const postCourse = async (data: any) => {
  const res = await fetch(`${API_BASE}/courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

// AI
export const aiGenerateDescription = async (title: string) => {
  try {
    const res = await fetch(`${API_BASE}/ai/generate-course-description`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    const data = await handleResponse(res);
    return data.text;
  } catch (err) {
    return "Course focused on practical industry standards and academic excellence.";
  }
};

export const aiGenerateBio = async (name: string, subject: string) => {
  try {
    const res = await fetch(`${API_BASE}/ai/generate-teacher-bio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, subject }),
    });
    const data = await handleResponse(res);
    return data.text;
  } catch (err) {
    return `Specialist educator in ${subject} with extensive professional experience.`;
  }
};
