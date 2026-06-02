
  const commentForm = document.getElementById('commentForm');
  const commentSuccess = document.getElementById('commentSuccess');

  commentForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Collect form values
    const name = document.getElementById('commentName').value;
    const email = document.getElementById('commentEmail').value;
    const website = document.getElementById('commentWebsite').value;
    const comment = document.getElementById('commentText').value;

    // Here you can send data to backend or save to localStorage
    console.log({ name, email, website, comment });

    commentSuccess.textContent = "✅ Your comment has been posted!";
    commentForm.reset();
  });

