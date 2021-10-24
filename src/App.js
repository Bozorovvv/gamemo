import React, { useState, useEffect } from 'react'
import { shuffle } from 'lodash'
import Images from './Images'

function App() {
  const [cards, setCards] = useState(shuffle([...Images, ...Images]))
  const [clicks, setClicks] = useState(0)
  const [won, setWon] = useState(false)
  const [activeCards, setActiveCards] = useState([])
  const [foundPairs, setFoundPairs] = useState([])
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)

  function toggle() {
    setIsActive(!isActive)
  }
  function reset() {
    setSeconds(0)
    setIsActive(false)
    setActiveCards([])
    setFoundPairs([])
    setWon(false)
    setClicks(0)
  }
  useEffect(() => {
    let interval = null
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1)
      }, 1000)
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isActive, seconds])

  function flipCard(index) {
    if (won) {
      setCards(shuffle([...Images, ...Images]))
      setFoundPairs([])
      setWon(false)
      setClicks(0)
      setSeconds(0)
      setIsActive(false)
    }
    if (activeCards.length === 0) {
      setActiveCards([index])
    }
    if (activeCards.length === 1) {
      const firstIndex = activeCards[0]
      const secondIndex = index
      if (cards[firstIndex] === cards[secondIndex]) {
        if (foundPairs.length + 2 === cards.length) {
          setWon(true)
        }
        setFoundPairs([...foundPairs, firstIndex, secondIndex])
      }
      setActiveCards([...activeCards, index])
    }
    if (activeCards.length === 2) {
      setActiveCards([index])
    }
    setClicks(clicks + 1)
  }

  return (
    <div className="container">
      <div className="board">
        {cards.map((card, index) => {
          const flippedToFront =
            activeCards.indexOf(index) !== -1 ||
            foundPairs.indexOf(index) !== -1
          return (
            <div
              className={'card-outer ' + (flippedToFront ? 'flipped' : '')}
              onClick={() => flipCard(index)}
            >
              <div className="card">
                <div className="front">
                  <img src={card} alt="" />
                </div>
                <div className="back" />
              </div>
            </div>
          )
        })}
      </div>

      <div>
        <div className="timer">
          <h1>GAMEMO</h1>
          <div>
            <button className="start" onClick={toggle}>
              start
            </button>
            <button className="stop" onClick={reset}>
              stop
            </button>
            <div className="time">Your time: {seconds}</div>
          </div>
        </div>
        <div className="stats">
          {won && (
            <>
              You won the game! Congratulations!
              <br />
            </>
          )}
          Clicks: {clicks} &nbsp;&nbsp;&nbsp; Found pairs:{' '}
          {foundPairs.length / 2}
        </div>
      </div>
    </div>
  )
}

export default App
