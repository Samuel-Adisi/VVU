/* ============================================
   VVU DIGITAL PORTAL — REGISTRATION JS
   Handles: Multi-step form, validation,
   course selection, localStorage
============================================ */

const COURSES = [
  { code: 'BUS101', name: 'Introduction to Business', dept: 'business', credits: 3, level: 100 },
  { code: 'BUS201', name: 'Business Communication', dept: 'business', credits: 3, level: 200 },
  { code: 'BUS301', name: 'Strategic Management', dept: 'business', credits: 3, level: 300 },
  { code: 'BUS401', name: 'Entrepreneurship & Innovation', dept: 'business', credits: 3, level: 400 },
  { code: 'ACC101', name: 'Principles of Accounting', dept: 'accounting', credits: 3, level: 100 },
  { code: 'ACC201', name: 'Financial Accounting II', dept: 'accounting', credits: 3, level: 200 },
  { code: 'ACC301', name: 'Management Accounting', dept: 'accounting', credits: 3, level: 300 },
  { code: 'CS101', name: 'Introduction to Computing', dept: 'cs', credits: 3, level: 100 },
  { code: 'CS201', name: 'Data Structures & Algorithms', dept: 'cs', credits: 3, level: 200 },
  { code: 'CS301', name: 'Database Management', dept: 'cs', credits: 3, level: 300 },
  { code: 'CS401', name: 'Software Engineering', dept: 'cs', credits: 3, level: 400 },
  { code: 'ENG101', name: 'Engineering Mathematics I', dept: 'engineering', credits: 4, level: 100 },
  { code: 'ENG201', name: 'Thermodynamics', dept: 'engineering', credits: 4, level: 200 },
  { code: 'HLT101', name: 'Human Anatomy & Physiology', dept: 'health', credits: 3, level: 100 },
  { code: 'HLT201', name: 'Public Health', dept: 'health', credits: 3, level: 200 },
  { code: 'ART101', name: 'Introduction to Sociology', dept: 'arts', credits: 3, level: 100 },
  { code: 'ART201', name: 'African Literature', dept: 'arts', credits: 3, level: 200 },
  { code: 'EDU101', name: 'Principles of Education', dept: 'education', credits: 3, level: 100 },
  { code: 'EDU201', name: 'Educational Psychology', dept: 'education', credits: 3, level: 200 },
  { code: 'THE101', name: 'Old Testament Survey', dept: 'theology', credits: 3, level: 100 },
  { code: 'THE201', name: 'Christian Ethics', dept: 'theology', credits: 3, level: 200 },
  // Shared / general courses
  { code: 'GEN101', name: 'Communication Skills', dept: null, credits: 2, level: 100 },
  { code: 'GEN102', name: 'Critical Thinking', dept: null, credits: 2, level: 100 },
  { code: 'GEN201', name: 'Research Methods', dept: null, credits: 3, level: 200 },
  { code: 'GEN301', name: 'Internship & Professional Practice', dept: null, credits: 3, level: 300 },
  { code: 'MAT101', name: 'Mathematics for Business', dept: null, credits: 3, level: 100 },
  { code: 'MAT201', name: 'Statistics & Probability', dept: null, credits: 3, level: 200 },
];

let currentStep = 1;
const TOTAL_STEPS = 4;
let selectedCourses = new Set();

document.addEventListener('DOMContentLoaded', () => {
  renderCourses(COURSES);

  // Listen for department/level changes to filter courses
  document.getElementById('department')?.addEventListener('change', updateCourseFilter);
  document.getElementById('level')?.addEventListener('change', updateCourseFilter);

  // Form submit
  document.getElementById('regForm')?.addEventListener('submit', handleSubmit);
});

/* ---- COURSE RENDERING ---- */
function renderCourses(courses) {
  const list = document.getElementById('courseList');
  if (!list) return;

  if (!courses.length) {
    list.innerHTML = '<p style="text-align:center;color:var(--gray-400);padding:2rem;">No courses found.</p>';
    return;
  }

  list.innerHTML = courses.map(c => `
    <div class="course-item ${selectedCourses.has(c.code) ? 'selected' : ''}" 
         id="course-${c.code}"
         onclick="toggleCourse('${c.code}', '${c.name}', ${c.credits})"
         role="checkbox" 
         aria-checked="${selectedCourses.has(c.code)}"
         tabindex="0"
         onkeydown="if(event.key==='Enter'||event.key===' ') toggleCourse('${c.code}', '${c.name}', ${c.credits})">
      <div class="course-checkbox">${selectedCourses.has(c.code) ? '✓' : ''}</div>
      <div class="course-info">
        <div class="course-code">${c.code}</div>
        <div class="course-name">${c.name}</div>
        <div class="course-meta">Level ${c.level} ${c.dept ? '· ' + c.dept.charAt(0).toUpperCase() + c.dept.slice(1) : '· General'}</div>
      </div>
      <span class="course-credits">${c.credits} cr</span>
    </div>
  `).join('');
}

function filterCourses(query) {
  const dept = document.getElementById('department')?.value || '';
  const level = parseInt(document.getElementById('level')?.value) || 0;

  let filtered = COURSES;
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(c =>
      c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  }
  if (level) {
    filtered = filtered.filter(c => c.level === level);
  }
  if (dept) {
    filtered = filtered.filter(c => !c.dept || c.dept === dept);
  }
  renderCourses(filtered);
}

function updateCourseFilter() {
  const query = document.getElementById('courseSearch')?.value || '';
  filterCourses(query);
}

function toggleCourse(code, name, credits) {
  const MAX = 6;
  if (selectedCourses.has(code)) {
    selectedCourses.delete(code);
  } else {
    if (selectedCourses.size >= MAX) {
      showToast(`Maximum ${MAX} courses allowed.`, 'error');
      return;
    }
    selectedCourses.add(code);
  }
  // Re-render list
  const query = document.getElementById('courseSearch')?.value || '';
  filterCourses(query);
  updateSelectedSummary();
}

function updateSelectedSummary() {
  const summary = document.getElementById('selectedSummary');
  const countEl = document.getElementById('courseCount');
  const listEl = document.getElementById('selectedCoursesList');
  const creditsEl = document.getElementById('totalCredits');

  if (!summary) return;

  if (selectedCourses.size === 0) {
    summary.style.display = 'none';
    return;
  }

  summary.style.display = 'block';
  countEl.textContent = selectedCourses.size;

  const selected = COURSES.filter(c => selectedCourses.has(c.code));
  listEl.innerHTML = selected.map(c =>
    `<li>${c.code} – ${c.name} (${c.credits} cr)</li>`
  ).join('');

  creditsEl.textContent = selected.reduce((s, c) => s + c.credits, 0);
}

/* ---- STEP NAVIGATION ---- */
function nextStep(step) {
  if (!validateStep(step)) return;

  // Mark current step done
  document.querySelector(`.step[data-step="${step}"]`)?.classList.add('done');

  // Advance
  currentStep = step + 1;
  showStep(currentStep);

  if (currentStep === 4) buildReview();
}

function prevStep(step) {
  currentStep = step - 1;
  showStep(currentStep);
}

function showStep(step) {
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  document.getElementById(`step${step}`)?.classList.add('active');

  document.querySelectorAll('.step').forEach(s => {
    s.classList.remove('active');
    if (parseInt(s.dataset.step) === step) s.classList.add('active');
  });

  window.scrollTo({ top: 200, behavior: 'smooth' });
}

/* ---- VALIDATION ---- */
function validateStep(step) {
  let valid = true;

  if (step === 1) {
    valid = validateField('firstName', v => v.trim().length >= 2, 'First name must be at least 2 characters') && valid;
    valid = validateField('lastName', v => v.trim().length >= 2, 'Last name must be at least 2 characters') && valid;
    valid = validateField('studentId', v => /^[A-Za-z0-9\-]{5,20}$/.test(v.trim()), 'Enter a valid Student ID (e.g. VVU-2025-001234)') && valid;
    valid = validateField('email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), 'Enter a valid email address') && valid;
    valid = validateField('phone', v => v.trim().length >= 7, 'Enter a valid phone number') && valid;
    valid = validateField('dob', v => v !== '', 'Please select your date of birth') && valid;
    valid = validateField('gender', v => v !== '', 'Please select a gender') && valid;
  }

  if (step === 2) {
    valid = validateField('studentName', v => v.trim().length >= 3, 'Enter your full name') && valid;
    valid = validateField('level', v => v !== '', 'Please select your level') && valid;
    valid = validateField('department', v => v !== '', 'Please select a department') && valid;
    valid = validateField('faculty', v => v !== '', 'Please select a faculty') && valid;
    valid = validateField('semester', v => v !== '', 'Please select a semester') && valid;
    valid = validateField('academicYear', v => v !== '', 'Please select an academic year') && valid;
  }

  if (step === 3) {
    if (selectedCourses.size < 1) {
      document.getElementById('coursesErr').textContent = 'Please select at least 1 course.';
      valid = false;
    } else {
      document.getElementById('coursesErr').textContent = '';
    }
  }

  return valid;
}

function validateField(id, rule, msg) {
  const el = document.getElementById(id);
  const errEl = document.getElementById(id + 'Err');
  if (!el) return true;

  const isValid = rule(el.value);
  el.classList.toggle('invalid', !isValid);
  if (errEl) errEl.textContent = isValid ? '' : msg;
  return isValid;
}

/* ---- BUILD REVIEW ---- */
function buildReview() {
  const get = (id) => {
    const el = document.getElementById(id);
    return el ? (el.options ? (el.options[el.selectedIndex]?.text || '—') : el.value || '—') : '—';
  };

  const selectedList = COURSES.filter(c => selectedCourses.has(c.code));
  const totalCredits = selectedList.reduce((s, c) => s + c.credits, 0);

  document.getElementById('reviewCard').innerHTML = `
    <div class="review-section">
      <h4>👤 Personal Details</h4>
      <div class="review-row"><span>Full Name</span><span>${get('firstName')} ${get('lastName')}</span></div>
      <div class="review-row"><span>Student ID</span><span>${get('studentId')}</span></div>
      <div class="review-row"><span>Email</span><span>${get('email')}</span></div>
      <div class="review-row"><span>Phone</span><span>${get('phone')}</span></div>
      <div class="review-row"><span>Date of Birth</span><span>${get('dob')}</span></div>
      <div class="review-row"><span>Gender</span><span>${get('gender')}</span></div>
    </div>
    <div class="review-section">
      <h4>🎓 Academic Details</h4>
      <div class="review-row"><span>Name on Record</span><span>${get('studentName')}</span></div>
      <div class="review-row"><span>Level</span><span>Level ${get('level')}</span></div>
      <div class="review-row"><span>Department</span><span>${get('department')}</span></div>
      <div class="review-row"><span>Faculty</span><span>${get('faculty')}</span></div>
      <div class="review-row"><span>Semester</span><span>${get('semester')}</span></div>
      <div class="review-row"><span>Academic Year</span><span>${get('academicYear')}</span></div>
    </div>
    <div class="review-section full">
      <h4>📚 Selected Courses (${selectedList.length} courses · ${totalCredits} credits)</h4>
      ${selectedList.map(c => `
        <div class="review-row">
          <span>${c.code}</span>
          <span>${c.name} (${c.credits} cr)</span>
        </div>
      `).join('')}
    </div>
  `;
}

/* ---- SUBMIT ---- */
function handleSubmit(e) {
  e.preventDefault();

  // Validate terms
  const terms = document.getElementById('terms');
  const termsErr = document.getElementById('termsErr');

  if (!terms.checked) {
    termsErr.textContent = 'You must agree to the terms and conditions.';
    return;
  }
  termsErr.textContent = '';

  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').style.display = 'none';
  submitBtn.querySelector('.btn-loader').style.display = 'inline';

  // Simulate submission delay
  setTimeout(() => {
    saveToLocalStorage();
    showSuccess();
  }, 1800);
}

function saveToLocalStorage() {
  const get = (id) => document.getElementById(id)?.value || '';
  const getSelect = (id) => {
    const el = document.getElementById(id);
    return el?.options?.[el.selectedIndex]?.text || '';
  };

  const selectedList = COURSES.filter(c => selectedCourses.has(c.code));

  const registration = {
    id: 'REG-' + Date.now(),
    submittedAt: new Date().toISOString(),
    personal: {
      firstName: get('firstName'),
      lastName: get('lastName'),
      studentId: get('studentId'),
      email: get('email'),
      phone: get('phone'),
      dob: get('dob'),
      gender: getSelect('gender'),
    },
    academic: {
      fullName: get('studentName'),
      level: `Level ${get('level')}`,
      department: getSelect('department'),
      faculty: getSelect('faculty'),
      semester: getSelect('semester'),
      academicYear: getSelect('academicYear'),
    },
    courses: selectedList.map(c => ({
      code: c.code,
      name: c.name,
      credits: c.credits,
    })),
    totalCredits: selectedList.reduce((s, c) => s + c.credits, 0),
    status: 'Pending Review',
  };

  // Retrieve existing registrations
  let all = [];
  try {
    all = JSON.parse(localStorage.getItem('vvu_registrations') || '[]');
  } catch (_) { all = []; }
  all.push(registration);
  localStorage.setItem('vvu_registrations', JSON.stringify(all));
  localStorage.setItem('vvu_last_registration', JSON.stringify(registration));

  return registration;
}

function showSuccess() {
  document.getElementById('regForm').style.display = 'none';
  document.querySelector('.steps').style.display = 'none';

  const successMsg = document.getElementById('successMsg');
  successMsg.style.display = 'block';

  // Fill ref
  let reg = {};
  try { reg = JSON.parse(localStorage.getItem('vvu_last_registration') || '{}'); } catch (_) {}

  document.getElementById('successRef').innerHTML = `
    <strong>Registration Reference: ${reg.id || 'REG-' + Date.now()}</strong><br>
    <span>Student: ${reg.personal?.firstName} ${reg.personal?.lastName}</span><br>
    <span>Student ID: ${reg.personal?.studentId}</span><br>
    <span>Level: ${reg.academic?.level} | ${reg.academic?.department}</span><br>
    <span>Courses Registered: ${reg.courses?.length} (${reg.totalCredits} credits)</span><br>
    <span>Submitted: ${new Date(reg.submittedAt).toLocaleString()}</span><br>
    <span>Status: <strong style="color:var(--warning)">${reg.status}</strong></span>
  `;

  window.scrollTo({ top: 300, behavior: 'smooth' });
}

/* ---- TOAST ---- */
function showToast(msg, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: ${type === 'error' ? 'var(--error)' : 'var(--navy)'};
    color: white;
    padding: .9rem 1.5rem;
    border-radius: 10px;
    font-size: .9rem;
    font-weight: 600;
    box-shadow: 0 8px 32px rgba(0,0,0,.25);
    z-index: 9999;
    animation: slideInToast .3s ease;
    font-family: var(--font-body, sans-serif);
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Add toast animation
const toastStyle = document.createElement('style');
toastStyle.textContent = `@keyframes slideInToast { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`;
document.head.appendChild(toastStyle);