const STORAGE_KEY = 'flashcards';
    let flashcards = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    let currentIndex = -1;

    function addFlashcard() {
      const question = document.getElementById('question').value.trim();
      const answer = document.getElementById('answer').value.trim();
      if (question && answer) {
        flashcards.push({
          question,
          answer,
          ease: 2.5, // default ease factor
          interval: 1,
          dueDate: Date.now(),
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(flashcards));
        alert('Flashcard added!');
        document.getElementById('question').value = '';
        document.getElementById('answer').value = '';
        loadNextCard();
      }
    }

    function loadNextCard() {
      const now = Date.now();
      const dueCards = flashcards.filter(card => card.dueDate <= now);
      if (dueCards.length === 0) {
        document.getElementById('flashcard').innerHTML = '<p>No cards due now. Come back later!</p>';
        return;
      }
      currentIndex = flashcards.indexOf(dueCards[0]);
      document.getElementById('flashcard').innerHTML = `
        <p><strong>Q:</strong> ${flashcards[currentIndex].question}</p>
        <p><strong>A:</strong> ${flashcards[currentIndex].answer}</p>
      `;
    }

    function gradeAnswer(quality) {
      if (currentIndex === -1) return;
      const card = flashcards[currentIndex];

      // SM-2 Algorithm (simplified)
      const now = Date.now();
      card.ease = Math.max(1.3, card.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
      card.interval = quality >= 3 ? (card.interval * card.ease) : 1;
      card.dueDate = now + card.interval * 24 * 60 * 60 * 1000; // next due in X days

      flashcards[currentIndex] = card;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(flashcards));
      loadNextCard();
    }

    loadNextCard();