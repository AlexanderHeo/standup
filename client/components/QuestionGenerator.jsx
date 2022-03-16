import React, { useState, useEffect } from 'react';

import questions from '../../questions';

const QuestionGenerator = ({ setShowGenerator }) => {
  const [qotd, setQotd] = useState('');

  const getRandomQotd = () => {
    const i = Math.floor(Math.random() * questions.length); // max random value is questions.length b/c max is exclusive
    const randomQotd = questions[i] + '?'; // add question mark that was removed with when split was called earlier
    setQotd(randomQotd);
  };

  useEffect(getRandomQotd, []);

  return (
    <>
      <div className='generator-container'>
        <div className='question-text'>{qotd}</div>
        <button className='btn-next' onClick={getRandomQotd}>Next</button>
      </div>
      <button onClick={() => setShowGenerator(false)}>Add custom QotD</button>
    </>
  );
};

export default QuestionGenerator;
