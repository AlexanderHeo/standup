import React from 'react';

import questions from '../../questions';

const QuestionGenerator = () => {
  const getRandomQotd = () => {
    const i = Math.floor(Math.random() * questions.length); // max random value is questions.length b/c max is exclusive
    const randomQotd = questions[i] + '?'; // add question mark that was removed with when split was called earlier
    return randomQotd;
  }

  return <div>{getRandomQotd()}</div>
};

export default QuestionGenerator;
