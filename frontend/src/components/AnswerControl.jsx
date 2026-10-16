const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isAnswerComplete(question, value) {
  if (!question.required) return true;
  if (question.type === 'checkboxes') {
    return Array.isArray(value) && value.length > 0;
  }
  if (question.type === 'linear_scale') {
    return value === 1 || value === 2 || value === 3 || value === 4 || value === 5;
  }
  if (typeof value !== 'string' || value.trim() === '') return false;
  if (question.type === 'email') return EMAIL_PATTERN.test(value.trim());
  if (question.type === 'phone') return value.replace(/\D/g, '').length >= 7;
  return true;
}

export function validationMessage(question, value) {
  if (!question.required) return '';
  if (question.type === 'checkboxes' && (!Array.isArray(value) || value.length === 0)) {
    return 'Please select an answer before continuing.';
  }
  if (question.type === 'linear_scale' && !(value >= 1 && value <= 5)) {
    return 'Please select an answer before continuing.';
  }
  if (question.type === 'email') {
    if (!value || String(value).trim() === '') {
      return 'Please select an answer before continuing.';
    }
    if (!EMAIL_PATTERN.test(String(value).trim())) {
      return 'Please enter a valid email address.';
    }
    return '';
  }
  if (question.type === 'phone') {
    if (!value || String(value).trim() === '') {
      return 'Please select an answer before continuing.';
    }
    if (String(value).replace(/\D/g, '').length < 7) {
      return 'Please enter a valid phone number.';
    }
    return '';
  }
  if (!value || String(value).trim() === '') {
    return 'Please select an answer before continuing.';
  }
  return '';
}

export function AnswerControl({ question, value, onChange }) {
  const name = question.id;

  if (question.type === 'multiple_choice') {
    return (
      <fieldset className="choices">
        <legend className="sr-only">{question.question}</legend>
        {question.options.map((option) => {
          const id = `${name}-${option}`;
          return (
            <label key={option} className={`choice ${value === option ? 'is-selected' : ''}`} htmlFor={id}>
              <input
                id={id}
                type="radio"
                name={name}
                value={option}
                checked={value === option}
                onChange={() => onChange(option)}
              />
              <span>{option}</span>
            </label>
          );
        })}
      </fieldset>
    );
  }

  if (question.type === 'checkboxes') {
    const selected = Array.isArray(value) ? value : [];
    const toggle = (option) => {
      const current = Array.isArray(value) ? value : [];
      const next = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];
      onChange(question.options.filter((item) => next.includes(item)));
    };

    return (
      <fieldset className="choices">
        <legend className="sr-only">{question.question}</legend>
        {question.options.map((option) => {
          const id = `${name}-${option}`;
          const checked = selected.includes(option);
          return (
            <label key={option} className={`choice ${checked ? 'is-selected' : ''}`} htmlFor={id}>
              <input
                id={id}
                type="checkbox"
                name={name}
                value={option}
                checked={checked}
                onChange={() => toggle(option)}
              />
              <span>{option}</span>
            </label>
          );
        })}
      </fieldset>
    );
  }

  if (question.type === 'linear_scale') {
    const { min, max, minLabel, maxLabel } = question.scale;
    const points = [];
    for (let n = min; n <= max; n += 1) points.push(n);

    return (
      <fieldset className="scale">
        <legend className="sr-only">{question.question}</legend>
        <div className="scale__row">
          {points.map((n) => {
            const id = `${name}-${n}`;
            const selected = value === n;
            return (
              <label key={n} className={`scale__point ${selected ? 'is-selected' : ''}`} htmlFor={id}>
                <input
                  id={id}
                  type="radio"
                  name={name}
                  value={n}
                  checked={selected}
                  onChange={() => onChange(n)}
                />
                <span>{n}</span>
              </label>
            );
          })}
        </div>
        <div className="scale__labels">
          <span>
            {min} — {minLabel}
          </span>
          <span>
            {max} — {maxLabel}
          </span>
        </div>
      </fieldset>
    );
  }

  if (question.type === 'long_text') {
    return (
      <label className="field">
        <span className="sr-only">{question.question}</span>
        <textarea
          value={value || ''}
          onChange={(event) => onChange(event.target.value)}
          rows={5}
          autoComplete="off"
        />
      </label>
    );
  }

  const inputType = question.type === 'email' ? 'email' : question.type === 'phone' ? 'tel' : 'text';
  const autoComplete =
    question.id === 'full_name'
      ? 'name'
      : question.type === 'email'
        ? 'email'
        : question.type === 'phone'
          ? 'tel'
          : 'off';

  return (
    <label className="field">
      <span className="sr-only">{question.question}</span>
      <input
        type={inputType}
        value={value || ''}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        inputMode={question.type === 'phone' ? 'tel' : undefined}
      />
    </label>
  );
}

export function formatDisplayAnswer(question, value) {
  if (question.type === 'checkboxes') {
    if (!Array.isArray(value) || value.length === 0) return 'No answer';
    return value.join(', ');
  }
  if (question.type === 'linear_scale') {
    if (!value) return 'No answer';
    if (value === question.scale.min) return `${value} — ${question.scale.minLabel}`;
    if (value === question.scale.max) return `${value} — ${question.scale.maxLabel}`;
    return String(value);
  }
  if (value == null || String(value).trim() === '') return 'No answer';
  return String(value);
}
