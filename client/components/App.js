import React, { useState } from 'react';
import './App.css';
import getDate from './getDate';

const App = () => {
  const [randomized, setRandomized] = useState([]);
  const [members, setMembers] = useState([]);
  const [lateAdditions, setLateAdditions] = useState([]);
  const [input, setInput] = useState('');
  const [display, setDisplay] = useState(false);
  const [added, setAdded] = useState(false);
  const [lateAdded, setLateAdded] = useState(false);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  const handleAddButton = (e) => {
    e.preventDefault();

    if (display) {
      const lateAddition = [...lateAdditions];
      lateAddition.push(input);
      setLateAdded(true);
      setLateAdditions(lateAddition);
    }
    const membersCopy = [...members];
    membersCopy.push(input);
    setAdded(true);
    setMembers(membersCopy);
    setInput('');
  };

  const disp = () => {
    randomizer(members);
  };

  const randomizer = (members) => {
    const membersCopy = [...members];
    let len = membersCopy.length,
      temp,
      randomIndex;
    while (len) {
      randomIndex = Math.floor(Math.random() * len--);
      temp = membersCopy[len];
      membersCopy[len] = membersCopy[randomIndex];
      membersCopy[randomIndex] = temp;
    }
    setRandomized(membersCopy);
    setDisplay(true);
  };

  const todayIs = getDate();
  return (
    <div className='wrapper'>
      <section className='date-section'>
        <h1>Morning Stand UP</h1>
        <h2>
          {todayIs.month} {todayIs.day} {todayIs.date}, {todayIs.year}
        </h2>
      </section>
      <section className='dayof-qotd'>
        <div className='day'>National ----- Day</div>
        <div className='qotd'>QotD: Margins and Padding - px or rems?</div>
      </section>
      <main className='container'>
        <section className='inputBox'>
          <form onSubmit={(e) => handleAddButton(e1)}>
            <div className='buttonContainer'>
              <input
                className='input'
                onChange={(e) => handleInputChange(e)}
                value={input}
              />
              <button
                type='submit'
                className='addButton'
                onClick={(e) => handleAddButton(e)}
              >
                Add
              </button>
            </div>
          </form>
          {added && (
            <ul>
              {members.map((member, index) => (
                <li key={index}>{member}</li>
              ))}
            </ul>
          )}
        </section>

        <section className='outputBox'>
          <div className='buttonContainer'>
            <button className='randomButton' onClick={disp}>
              Randomize
            </button>
          </div>
          <div className='randomList'>
            {display && (
              <ol className='orderedList'>
                {randomized.map((member, index) => (
                  <div key={index}>
                    <li className='name'>{member}</li>
                  </div>
                ))}
                {lateAdditions.map((member, index) => (
                  <li key={index} onClick={(e) => handleMemberClick(e)}>
                    {member}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
