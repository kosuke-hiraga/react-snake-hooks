import React from 'react';

// export const Button = ({ onStart }) => {
const Button = ({ status, onStop, onStart, onRestart }) => {
    return (
        <div className="button">
            {/* <button onClick={onStart}>start</button> */}
            {/* {
                status === "gameover" ?
                    <button onClick={onRestart}>gameover</button>
                    :
                    <button onClick={onStart}> start</button >
            } */}
            {/* {status === "gameover" && <button onClick={onRestart}>gameover</button>}
            {status === "init" && <button onClick={onStart}>start</button>}
            {status === "suspended" && <button onClick={onStart}>start</button>}
            {status === "playing" && <button onClick={onStop}>stop</button>} */}
            {status === "gameover" && <button className="btn btn-gameover" onClick={onRestart}>gameover</button>}
            {status === "init" && <button className="btn btn-init" onClick={onStart}>start</button>}
            {status === "suspended" && <button className="btn btn-suspended" onClick={onStart}>start</button>}
            {status === "playing" && <button className="btn btn-playing" onClick={onStop}>stop</button>}
        </div >
    );
};
// }


export default Button;