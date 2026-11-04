import React from 'react';
import styled from 'styled-components';

const Thought = () => {
  return (
    <StyledWrapper>
      <div className="flip-card">
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <p className="title">FLIP CARD</p>
            <p>Hover To Flip</p>
          </div>
          <div className="flip-card-back">
            <p className="title">CAUTION!!</p>
            <p>THIS CAN BE ADDICTIVE</p>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .flip-card {
    background-color: transparent;
    width: 190px;
    height: 254px;
    perspective: 1000px;
    font-family: sans-serif;
  }

  .title {
    font-size: 1.5em;
    font-weight: 900;
    text-align: center;
    margin: 0;
  }

  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;
  }

  .flip-card:hover .flip-card-inner {
    transform: rotateY(180deg);
  }

  .flip-card-front, .flip-card-back {
    box-shadow: 0 8px 14px 0 rgba(0,0,0,0.2);
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    border: 1px solid gray;
    border-radius: 1rem;
  }

  .flip-card-front {
    background: linear-gradient(
  120deg,
  #ffffff 60%,     /* pure white */
  #f2f2f2 88%,     /* very light gray */
  #f1f1f1 40%,     /* slightly darker white */
  rgba(255, 255, 255, 0.7) 48% /* transparent white */
    );    
    color: gray;
  }

  .flip-card-back {
    background: linear-gradient(
  120deg, 
  #506ffc 60%, 
  #7c95ff 88%, 
  #3448a1 40%, 
  rgba(80, 111, 252, 0.6) 48%
);      
    color: white;
    transform: rotateY(180deg);
  }
    `;

export default Thought;
