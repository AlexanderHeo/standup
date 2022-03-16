import axios from 'axios';
import html2canvas from 'html2canvas';
import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import getDate from './getDate';
import QuestionGenerator from './QuestionGenerator';

const App = () => {
  const [randomized, setRandomized] = useState([]);
  const [members, setMembers] = useState([]);
  const [lateAdditions, setLateAdditions] = useState([]);
  const [input, setInput] = useState('');
  const [dayOf, setDayOf] = useState({});
  const [loading, setLoading] = useState(true);
  const [qotd, setQotd] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [qotdEntered, setQotdEntered] = useState(false);
  const [display, setDisplay] = useState(false);
  const [added, setAdded] = useState(false);
  const [lateAdded, setLateAdded] = useState(false);
  const [aboutClass, setAboutClass] = useState('about-section hide');
  const [showGenerator, setShowGenerator] = useState(true);

  const qotdRef = useRef(null);
  useEffect(() => {
    axios('https://national-api-day.herokuapp.com/api/today')
      .then((response) => {
        setDayOf(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => changeIndex(), 7500);
    return () => clearInterval(interval);
  }, [dayOf]);

  const changeIndex = () => {
    const lastIndex = dayOf.holidays.length - 1;
    setCurrentIndex((currentIndex) => {
      return currentIndex === lastIndex ? 0 : currentIndex + 1;
    });
  };


  const handleInputChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    if (name === 'input') {
      setInput(value);
    } else if (name === 'dayOf') {
      setDayOf(value);
    } else if (name === 'qotd') {
      setQotd(value);
    }
  };

  const handleButton = (e) => {
    e.preventDefault();
    const name = e.target.name;

    if (name === 'add' && input) {
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
    } else if (name === 'dayOf') {
      setDayOfEntered(true);
    } else if (name === 'qotd' && qotd) {
      setQotdEntered(true);
    } else {
      setQotd('');
    }
  };

  const handleAbout = (e) => {
    const name = e.target.name;
    if (name === 'open') {
      setAboutClass('about-section');
    } else if (name === 'close') {
      setAboutClass('about-section hide');
    }
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

  const clear = () => {
    setMembers([]);
    setLateAdditions([]);
    setLateAdded(false);
    setRandomized([]);
    setAdded(false);
    setDisplay(false);
  };

  const handleNameClick = (e) => {
    console.log(e.currentTarget.className);
    e.currentTarget.classList.toggle('clicked');
  };

  const capture = () => {
    html2canvas(document.querySelector('#attendees-list')).then((canvas) => {
      const attendees = canvas.toDataURL('image/png', 1.0);
      const date = getDate();
      const fileName = `${date.month} ${date.date} standup.png`;
      saveas(attendees, fileName);
    });
  };

  const saveas = (blob, fileName) => {
    var elem = window.document.createElement('a');
    elem.href = blob;
    elem.download = fileName;
    elem.style = 'display:none;';
    (document.body || document.documentElement).appendChild(elem);
    if (typeof elem.click === 'function') {
      elem.click();
    } else {
      elem.target = '_blank';
      elem.dispatchEvent(
        new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
        })
      );
    }
    URL.revokeObjectURL(elem.href);
    elem.remove();
  };

  const todayIs = getDate();
  return (
    <div className='wrapper'>
      <section className='date-section'>
        <h1>Morning Stand UP</h1>
        <h2>
          {todayIs.day} {todayIs.month} {todayIs.date}, {todayIs.year}
        </h2>
      </section>
      <section className='dayof-qotd'>
        <div className='day-qotd-container'>
          {!loading ? (
            <div className='dayof-display'>{dayOf.holidays[currentIndex]}</div>
          ) : (
            <div className='dayof-display'>Loading...</div>
          )}
        </div>
        { showGenerator ? <QuestionGenerator setShowGenerator={setShowGenerator} /> : ( <div className='day-qotd-container'>
          {qotdEntered
            ?  <div
                  className='dayof-display qotd-display'
                  onDoubleClick={(e) => {
                    setQotdEntered(false);
                  }}>{qotd}</div>

            : (
                <>
                  <button onClick={() => setShowGenerator(true)}>Back</button>
                  <input
                    className='qotd'
                    name='qotd'
                    type='text'
                    value={qotd}
                    placeholder='Question of the Day'
                    onChange={(e) => handleInputChange(e)}
                    onKeyPress={(e) => e.key === 'Enter' && handleButton(e)}
                  />
                  <button
                    type='submit'
                    onClick={(e) => handleButton(e)}
                    name='qotd'>
                    Enter
                  </button>
                  <button name='clear'
                    onClick={(e) => handleButton(e)}>
                    Clear
                  </button>
                </>
              )}
        </div>)}

      </section>
      <main className='container'>
        <section className='inputBox'>
          <form onSubmit={(e) => handleButton(e)}>
            <div className='buttonContainer'>
              <input
                name='input'
                onChange={(e) => handleInputChange(e)}
                placeholder="Developer's Name"
                value={input}
              />
              <button type='submit' onClick={(e) => handleButton(e)} name='add'>
                Add
              </button>
            </div>
          </form>
          {added && (
            <ul id='attendees-list'>
              {members.map((member, index) => (
                <li key={index}>{member}</li>
              ))}
            </ul>
          )}
        </section>

        <section className='outputBox'>
          <div className='buttonContainer'>
            <button onClick={disp}>Randomize</button>
            <button onClick={clear}>Clear</button>
            <button onClick={capture}>Save</button>
          </div>
          <div className='randomList'>
            {display && (
              <ol>
                {randomized.map((member, index) => (
                  <div
                    key={index}
                    className='namediv'
                    onClick={(e) => handleNameClick(e)}
                  >
                    <li className='name'>{member}</li>
                  </div>
                ))}
                {lateAdditions.map((member, index) => (
                  <div
                    key={index}
                    className='namediv'
                    onClick={(e) => handleNameClick(e)}
                  >
                    <li className='name'>{member}</li>
                  </div>
                ))}
              </ol>
            )}
          </div>
        </section>
      </main>
      <div className={aboutClass}>
        <div className='about-container'>
          <button
            className='close-about'
            name='close'
            onClick={(e) => handleAbout(e)}
          >
            X
          </button>
          This app was created by{' '}
          <span>
            <a href='https://alexheo.com' target='_blank'>
              Alex Heo
            </a>
          </span>
          , an alumni of the coding bootcamp{' '}
          <span>
            <a href='https://learningfuze.com' target='_blank'>
              LearningFuze
            </a>
          </span>
          , located in Irvine, CA, for the daily morning standup. If you would
          like to add to this app, please take{' '}
          <span>
            <a href='https://github.com/alexanderheo/standup' target='_blank'>
              a fork
            </a>
          </span>{' '}
          and make a pull request!
        </div>
      </div>
      <footer>
        <div className='copyright'>
          &copy; 2022{' '}
          <span>
            <a href='https://alexheo.com' target='_blank'>
              alexheo.com
            </a>
          </span>
        </div>
        <button className='about' name='open' onClick={(e) => handleAbout(e)}>
          About
        </button>
      </footer>
    </div>
  );
};

export default App;
