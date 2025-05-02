function toggleReview() {
    const reviewSection = document.getElementById('review-section');
    reviewSection.style.display = reviewSection.style.display === 'none' ? 'block' : 'none';
  }
  
  function submitReview() {
    const input = document.getElementById('review-input');
    const output = document.getElementById('review-output');
    const text = input.value.trim();
  
    if (text !== '') {
      const p = document.createElement('p');
      p.textContent = `"${text}"`;
      p.className = 'submitted-review';
      output.appendChild(p);
      input.value = '';
    }
  }
  