'use client'
import React from 'react';
import styled from 'styled-components';

const MovieButton = () => {
  return (
    <div className=" flex justify-center w-90 p-5 ml-70 ">
    <StyledWrapper className='shadow-2xl'>
      <button>
        <div className="svg-wrapper-1">
          <div className="svg-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 490 490"
              width={30}
              height={30}
              className="icon"
            >
              <g>
                <path d="M245,0C109.69,0,0,109.69,0,245s109.69,245,245,245s245-109.69,245-245S380.31,0,245,0z M245,459.375
                  c-118.206,0-214.375-96.168-214.375-214.375c0-118.206,96.169-214.375,214.375-214.375S459.375,126.794,459.375,245
                  C459.375,363.207,363.206,459.375,245,459.375z"/>
                <polygon points="95.583,258.914 203.967,306.033 203.967,275.528 128.362,245.546 203.967,216.641 203.967,185.911 95.583,232.82"/>
                <polygon points="213.986,326.744 236.312,326.744 275.894,163.256 253.135,163.256"/>
                <polygon points="285.928,216.431 361.638,245.86 285.928,275.633 285.928,306.153 394.416,258.914 394.416,233.03 285.928,186.12"/>
              </g>
            </svg>
          </div>
        </div>
        <span>MOVIES</span>
      </button>
        </StyledWrapper>
        </div>
        
  );
}

const StyledWrapper = styled.div`
button {
  position: relative;
  font-family: inherit;
  font-size: 20px;
  color: white;
  padding: 1em 7em;
  padding-left: 0.9em;
  display: flex;
  align-items: center;
  cursor: pointer;
  border: none;
  border-radius: 15px;
  font-weight: 1000;
  overflow: hidden;
}

button::before {
  content: "";
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: url("data:image/jpeg;base64,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") center/cover no-repeat;
  filter: blur(3px); /* blur only background */
  z-index: -1; /* keep behind text */
}


  button span {
    display: block;
    margin-left: 0.3em;
    transition: all 0.3s ease-in-out;
  }

  button svg {
    display: block;
    transform-origin: center center;
    transition: transform 0.3s ease-in-out;
  }

  button:hover {
    background: #506ffc;
  }

  button:hover .svg-wrapper {
    transform: scale(1.25);
    transition: 0.5s linear;
  }

  button:hover svg {
    transform: translateX(4em) scale(1.1);
    fill: #fff;
  }

  button:hover span {
    opacity: 0;
    transition: 0.5s linear;
  }

  button:active {
    transform: scale(0.95);
  }

   @media (prefers-color-scheme: system) {
    button {
      background: #fff;
      color: #000;
      fill: rgb(200, 200, 200);
    }

    button:hover {
      background: #e0e0e0;
    }

    button:hover svg {
      fill: #000;
    }
  }
`;

export default MovieButton;
