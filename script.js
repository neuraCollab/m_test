let questions = [];
let finished = false;

fetch('questions.json')
  .then(r => r.json())
  .then(data => {
    questions = shuffle([...data]); // перемешиваем при каждом открытии
    render();
  });

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function render() {
  const form = document.getElementById('test');
  form.innerHTML = '';

  questions.forEach((q, i) => {
    const div = document.createElement('div');
    div.className = 'question';

    div.innerHTML = `
      <p><b>${i + 1}. ${q.question}</b></p>
      <div class="options">
        ${q.options.map(opt => `
          <label>
            <input type="radio" name="q${i}" value="${opt}">
            ${opt}
          </label>
        `).join('')}
      </div>
    `;

    form.appendChild(div);
  });
}

document.getElementById('finishBtn').onclick = () => {
  if (finished) return;
  finished = true;

  let correct = 0;

  questions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    const inputs = document.querySelectorAll(`input[name="q${i}"]`);

    inputs.forEach(input => {
      const label = input.parentElement;
      if (input.value === q.correct_answer) {
        label.classList.add('correct');
      } else if (selected && input === selected) {
        label.classList.add('wrong');
      }
    });

    if (selected && selected.value === q.correct_answer) {
      correct++;
    }
  });

  document.getElementById('result').innerText =
    `Результат: ${correct} / ${questions.length}`;
};
