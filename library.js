
  
    const allBooks = [
      { id: 1, title: "Mathematics-I (BCA-101)", code: "BCA-101", course: "bca" },
      { id: 2, title: "Programming Principle & Algorithm (BCA-102)", code: "BCA-102", course: "bca" },
      { id: 3, title: "Computer Fundamentals (BCA-103)", code: "BCA-103", course: "bca" },
      { id: 4, title: "Principle of Management (BCA-104)", code: "BCA-104", course: "bca" },
      { id: 5, title: "Business Communication (BCA-106)", code: "BCA-106", course: "bca" },
      { id: 6, title: "Mathematics-II (BCA-201)", code: "BCA-201", course: "bca" },
      { id: 7, title: "C-Programming (BCA-202)", code: "BCA-202", course: "bca" },
      { id: 8, title: "Data Structures (BCA-302)", code: "BCA-302", course: "bca" },
      { id: 9, title: "DBMS (BCA-501)", code: "BCA-501", course: "bca" },
      { id: 10, title: "Java Programming (BCA-502)", code: "BCA-502", course: "bca" },

      { id: 101, title: "Advanced Java (MCA-101)", code: "MCA-101", course: "mca" },
      { id: 102, title: "Data Structures (MCA-102)", code: "MCA-102", course: "mca" },
      { id: 103, title: "Database Systems (MCA-103)", code: "MCA-103", course: "mca" },

      { id: 201, title: "C/C++ Programming (CS-101)", code: "CS-101", course: "btech-cs" },
      { id: 202, title: "Data Structures (CS-102)", code: "CS-102", course: "btech-cs" },
      { id: 203, title: "Operating Systems (CS-103)", code: "CS-103", course: "btech-cs" },

      { id: 301, title: "Engineering Mechanics (ME-101)", code: "ME-101", course: "btech-mech" },
      { id: 302, title: "Thermodynamics (ME-102)", code: "ME-102", course: "btech-mech" },

      { id: 401, title: "Basic Electronics (ECE-101)", code: "ECE-101", course: "btech-ece" },
      { id: 402, title: "Digital Electronics (ECE-102)", code: "ECE-102", course: "btech-ece" },

      { id: 501, title: "Engineering Drawing (DME-101)", code: "DME-101", course: "diploma-mech" },
      { id: 502, title: "Machine Shop (DME-102)", code: "DME-102", course: "diploma-mech" }
    ];

    let issuedBooks = JSON.parse(localStorage.getItem('issuedBooks')) || [];

    const roleSelect = document.getElementById('role');
    const courseSelect = document.getElementById('course');
    const bookSelect = document.getElementById('book');
    const issueBtn = document.getElementById('issueBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const issueForm = document.getElementById('issueForm');
    const tableBody = document.getElementById('tableBody');
    const roleMessage = document.getElementById('roleMessage');
    const teacherIdGroup = document.getElementById('teacherIdGroup');
    const teacherIdInput = document.getElementById('teacher-id');

    function filterBooks() {
      const selectedCourse = courseSelect.value;
      bookSelect.innerHTML = '<option value="">Select Book</option>';

      if (selectedCourse) {
        const filteredBooks = allBooks.filter(book => book.course === selectedCourse);
        filteredBooks.forEach(book => {
          const option = document.createElement('option');
          option.value = book.id;
          option.textContent = book.title;
          bookSelect.appendChild(option);
        });
        bookSelect.disabled = false;
      } else {
        bookSelect.disabled = true;
      }
    }

    function updateAccess() {
      const role = roleSelect.value;
      const isStudent = role === 'student';
      const isTeacherOrAdmin = role === 'teacher' || role === 'admin';

      roleMessage.classList.toggle('hidden', !isStudent);
      teacherIdGroup.classList.toggle('hidden', !isTeacherOrAdmin);

      document.getElementById('member-id').disabled = isStudent;
      document.getElementById('member-name').disabled = isStudent;
      courseSelect.disabled = isStudent;
      bookSelect.disabled = isStudent || !courseSelect.value;
      document.getElementById('issue-date').disabled = isStudent;
      document.getElementById('due-date').disabled = isStudent;
      teacherIdInput.disabled = isStudent;

      issueBtn.classList.toggle('hidden', !isTeacherOrAdmin);
      deleteBtn.classList.toggle('hidden', !isTeacherOrAdmin);

      if (isStudent) {
        teacherIdInput.value = '1001';
      } else if (isTeacherOrAdmin) {
        teacherIdInput.value = '1001';
      }
    }

    issueForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const role = roleSelect.value;
      if (role !== 'teacher' && role !== 'admin') {
        alert('❌ Only teachers/admins can issue books!');
        return;
      }

      const teacherId = teacherIdInput.value.trim();
      if (teacherId !== '1001') {
        alert('❌ Only Teacher ID 1001 is allowed to issue books!');
        return;
      }

      const issueData = {
        id: Date.now(),
        studentId: document.getElementById('member-id').value.trim(),
        studentName: document.getElementById('member-name').value.trim(),
        course: courseSelect.options[courseSelect.selectedIndex].text,
        bookId: parseInt(bookSelect.value),
        bookTitle: bookSelect.options[bookSelect.selectedIndex].text,
        issueDate: document.getElementById('issue-date').value,
        dueDate: document.getElementById('due-date').value,
        status: 'issued',
        teacherId: '1001'
      };

      issuedBooks.unshift(issueData);
      localStorage.setItem('issuedBooks', JSON.stringify(issuedBooks));
      renderTable();
      clearForm();
      alert('✅ Book issued successfully!');
    });

    deleteBtn.addEventListener('click', () => {
      const role = roleSelect.value;
      if (role !== 'teacher' && role !== 'admin') {
        alert('❌ Admin/Teacher access required!');
        return;
      }

      if (confirm('🗑️ Delete ALL issued book records?')) {
        issuedBooks = [];
        localStorage.setItem('issuedBooks', JSON.stringify(issuedBooks));
        renderTable();
        alert('🗑️ All records deleted!');
      }
    });

    function renderTable() {
      tableBody.innerHTML = '';

      issuedBooks.forEach(book => {
        const row = document.createElement('tr');
        const isStudent = roleSelect.value === 'student';
        const actions = isStudent ? '' : `<button class="delete-btn" onclick="deleteBook(${book.id})">Delete</button>`;

        row.innerHTML = `
          <td>${book.id}</td>
          <td>${book.studentName} (${book.studentId})</td>
          <td>${book.bookTitle}</td>
          <td>${book.course}</td>
          <td>${book.issueDate}</td>
          <td>${book.dueDate}</td>
          <td><span class="status-badge status-issued">${book.status.toUpperCase()}</span></td>
          <td>${actions}</td>
        `;
        tableBody.appendChild(row);
      });
    }

    window.deleteBook = function(bookId) {
      const role = roleSelect.value;
      if (role !== 'teacher' && role !== 'admin') {
        alert('❌ Admin/Teacher access only!');
        return;
      }

      if (confirm('Delete this issued book record?')) {
        issuedBooks = issuedBooks.filter(b => b.id != bookId);
        localStorage.setItem('issuedBooks', JSON.stringify(issuedBooks));
        renderTable();
        alert('🗑️ Record deleted!');
      }
    };

    function clearForm() {
      issueForm.reset();
      bookSelect.innerHTML = '<option value="">Select Book</option>';
      bookSelect.disabled = true;
      teacherIdInput.value = '1001';
      updateAccess();
    }

    document.getElementById('issue-date').valueAsDate = new Date();
    document.getElementById('due-date').valueAsDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    updateAccess();
    renderTable();