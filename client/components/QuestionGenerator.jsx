import React, { useState, useEffect } from 'react';

import questions from '../../questions';

const QuestionGenerator = ({ setRandomQotd, handleButton }) => {
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
      </div>
      <div className='btn-container'>
        <button className='btn-qotd' onClick={getRandomQotd}>Next Question</button>
        <button className='btn-qotd' onClick={e => {
            handleButton(e);
            setRandomQotd(false);
          }}>
          Add custom QotD
        </button>
      </div>
    </>
  );
};

export default QuestionGenerator;
