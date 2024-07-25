// https://www.geeksforgeeks.org/pacman-game-using-react/
import './App.css';
import TextField from '@mui/material/TextField';
import React,{useCallback, useEffect, useState} from 'react';
import img_pan from './image/pan.png';
import img_delete from './image/delete.png';
import img_done from './image/done.png';
import img_backspace from './image/backspace.png';
import img_renew from './image/renew.png';
import img_villian from './image/villian.png';
import img_button from './image/button.png';
function PacManGame({ username, setUsername,inputdone, setInputdone }) {
  /*  0 represents pacman, 
      1 represents walls, 
      2 represents empty,
      3 represents letter,
      4 represent DELETE
      5 represent RENEW
      6 represent BACKSPACE 
      7 represent DONE
      8 represent VILLIAN */
  const [pacman, setPacman] = useState({ x: 4, y: 6 });
  const [villian, setVillian] = useState({ x: 7, y: 10 });
  const [letterLoc, setletterLoc] = useState({ x: 7, y: 9 });
  const [lastMoveTime, setLastMoveTime] = useState(Date.now());
  const moveInterval = 100; // Move interval in milliseconds
  const maxlengthx = 9;
  const maxlengthy = 13;
  const [alphabet, setAlphabet] = useState('B');
  const [map, setMap] = useState([
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 5, 2, 2, 2, 2, 1, 2, 2, 2, 2, 6, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
    [1, 2, 2, 2, 1, 1, 0, 1, 1, 2, 2, 2, 1],
    [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
    [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 8, 7, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]);
console.log(map);
const checkMapStatus = useCallback((x, y) => {
  // Ensure special symbols don't disappear
  if (x === 1 && y === 1) return 5;
  if (x === 1 && y === maxlengthy - 2) return 6;
  if (x === maxlengthx-2 && y === maxlengthy - 2) return 7;
  if (x === letterLoc.x && y === letterLoc.y) return 3;
  return 2;
}, [letterLoc]);
// move pacman
const handleKeyDown = (event) => {
  const currentTime = Date.now();
  if (inputdone || currentTime - lastMoveTime < moveInterval) {
    return;
  }
  if (event.key === 'ArrowUp' && pacman.x > 0 &&
    map[pacman.x-1][pacman.y] !== 1) {
      console.log("up");
      setMap((prevMap) => {
        const newMap = [...prevMap];
        newMap[pacman.x][pacman.y] = checkMapStatus(pacman.x, pacman.y);
        setPacman(
            (prevPacman) =>
            (
                {
                    ...prevPacman,
                    x: prevPacman.x - 1
                }));
        newMap[pacman.x-1][pacman.y] = 0;
        return newMap;
      });
  } else if (event.key === 'ArrowDown' && pacman.x < maxlengthx-2 &&
    map[pacman.x+1][pacman.y] !== 1) {
      console.log("down");
      setMap((prevMap) => {
        const newMap = [...prevMap];
        newMap[pacman.x][pacman.y] = checkMapStatus(pacman.x, pacman.y);
        setPacman(
            (prevPacman) =>
            (
                {
                    ...prevPacman,
                    x: prevPacman.x + 1
                }));
        newMap[pacman.x+1][pacman.y] = 0;
        return newMap;
      });
  } else if (event.key === 'ArrowLeft' && pacman.y > 0 &&
    map[pacman.x][pacman.y-1] !== 1) {
      console.log("left");
      setMap((prevMap) => {
        const newMap = [...prevMap];
        newMap[pacman.x][pacman.y] = checkMapStatus(pacman.x, pacman.y);
        setPacman(
            (prevPacman) =>
            (
                {
                    ...prevPacman,
                    y: prevPacman.y - 1
                }));
        newMap[pacman.x][pacman.y-1] = 0;
        return newMap;
      });
  } else if (event.key === 'ArrowRight' && pacman.y < maxlengthy-2 &&
    map[pacman.x][pacman.y+1] !== 1) {
      console.log("right");
      setMap((prevMap) => {
        const newMap = [...prevMap];
        newMap[pacman.x][pacman.y] = checkMapStatus(pacman.x, pacman.y);
        setPacman(
            (prevPacman) =>
            (
                {
                    ...prevPacman,
                    y: prevPacman.y + 1
                }));
        newMap[pacman.x][pacman.y+1] = 0;
        return newMap;
      });
  }
  setLastMoveTime(currentTime);
}
// if pacman interact with special symbols (not villian)
useEffect(() => {
  // if pacman make letter change (renew/eat)
  if ((pacman.x === 1 && pacman.y === 1) ||(pacman.x === letterLoc.x && pacman.y === letterLoc.y)) {
    let newX,newY;
    do {
      newX = Math.floor(Math.random() * maxlengthx);
      newY = Math.floor(Math.random() * maxlengthy);
    } while (map[newX][newY] !== 2);
    setMap((prevMap) => {
      const newMap = [...prevMap];
      newMap[letterLoc.x][letterLoc.y] = 2;
      newMap[pacman.x][pacman.y] = 0;
      setletterLoc((prevletterLoc) => ({
        x: Math.floor(newX),
        y: Math.floor(newY)
      }));
      setAlphabet(String.fromCharCode(65 + Math.floor(Math.random() * 26)));
      newMap[newX][newY] = 3;
      return newMap;
    });
  }
  // if pacman eat letter
  if(pacman.x === letterLoc.x && pacman.y === letterLoc.y){
    setUsername(username + alphabet);
  }
  // if pacman eat backspace
  if(pacman.x === 1 && pacman.y === maxlengthy-2){
    setUsername(username.slice(0, -1));
  }
  // if pacman eat done
  if(pacman.x === maxlengthx-2 && pacman.y === maxlengthy-2){
    setInputdone(true);
  }
}, [pacman]);
useEffect(() => {
  // if pacman eat villian
  if(pacman.x === villian.x && pacman.y === villian.y){
    setUsername('');
    setInputdone(false);
    setMap((prevMap) => {
      const newMap = [...prevMap];
      newMap[pacman.x][pacman.y] = checkMapStatus(pacman.x, pacman.y);
      setPacman(
          (prevPacman) =>
          (
              {
                  x:4,
                  y:6
              }));
      newMap[4][6] = 0;
      return newMap;
    });
  }
}, [pacman,villian]);
// move villian
const moveVillian = useCallback(() => {
  const directions = [
    { x: -1, y: 0 }, // Up
    { x: 1, y: 0 },  // Down
    { x: 0, y: -1 }, // Left
    { x: 0, y: 1 }   // Right
  ];

  const validMoves = directions.filter(direction => {
    const newX = villian.x + direction.x;
    const newY = villian.y + direction.y;
    return newX >= 0 && newX < maxlengthx && newY >= 0 && newY < maxlengthy && map[newX][newY] !== 1;
  });

  if (validMoves.length > 0) {
    const move = validMoves[Math.floor(Math.random() * validMoves.length)];
    setMap((prevMap) => {
      const newMap = [...prevMap];
      newMap[villian.x][villian.y] = checkMapStatus(villian.x, villian.y);
      setVillian((prevVillian) => ({
        x: prevVillian.x + move.x,
        y: prevVillian.y + move.y
      }));
      newMap[villian.x + move.x][villian.y + move.y] = 8;
      return newMap;
    });
  }

}, [villian, maxlengthx, maxlengthy, map]);

useEffect(() => {
  const interval = setInterval(moveVillian, 200);
  return () => clearInterval(interval);
}, [moveVillian]);

useEffect(() => {
  window.addEventListener('keydown', handleKeyDown);
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [handleKeyDown]);

  return (
    <div>
      <Mapdisplay map={map} alphabet={alphabet}/>
    </div>
  )
}

function Mapdisplay({map,alphabet}) {
  return (
    <div className="map">
      {map.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, cellIndex) => (
            <Cell key={cellIndex} value={cell} alphabet={alphabet}/>
          ))}
        </div>
      ))}
    </div>
  );
}
function Cell({ value,alphabet }) {
  let content;
  let className;

  switch (value) {
  /*  0 represents pacman, 
      1 represents walls, 
      2 represents empty,
      3 represents letter,
      4 represent DELETE
      5 represent RESET
      6 represent BACKSPACE 
      7 represent DONE*/
    case 0: 
      className = 'white-box';
      content = <img src={img_pan} alt="Cat" className="character" />;
      break;
    case 1:
      className = 'black-box';
      break;
    case 2:
      className = 'white-box';
      break;
    case 3:
      className = 'white-box letter';
      content = alphabet; // Example letter
      break;
    case 4: 
      className = 'white-box';
      content = <img src={img_delete} alt="Cat" className="character" />;
      break;
    case 5: 
      className = 'white-box';
      content = <img src={img_renew} alt="Cat" className="character" />;
      break;
    case 6: 
      className = 'white-box';
      content = <img src={img_backspace} alt="Cat" className="character" />;
      break;
    case 7: 
      className = 'white-box';
      content = <img src={img_done} alt="Cat" className="character" />;
      break;
    case 8: 
      className = 'white-box';
      content = <img src={img_villian} alt="Cat" className="character" />;
      break;
    default:
      className = 'white-box';
  }

  return <div className={`cell ${className}`}>{content}</div>;
}
function App() {
  const resetState = () => {
    window.location.reload();
  }
  const [username, setUsername] = useState("");
  const [inputdone, setInputdone] = useState(false);
  console.log(username);
  return (
    <div className="App">
      <header className="App-overall">
        <div className="App-name">
          <TextField 
            id="standard-basic" 
            label="Type your name" 
            value={username} 
            InputProps={{
              readOnly: true,
            }}
          /> 
          <button onClick={resetState} style={{ background: 'none', border: 'none', padding: 0 }}>
            <img src={img_button} alt="Reset" style={{ width: '50px', height: '50px' }} />
          </button>
        </div>
        <PacManGame username={username} setUsername={setUsername} inputdone={inputdone} setInputdone={setInputdone}/>
        <h3 style={{ visibility: inputdone ? "visible" : "hidden" }}>HELLO {username}</h3>
      </header>
    </div>
  );
}

export default App;
