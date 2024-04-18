import React, { useState, useEffect, useRef } from "react";
import { TbPlayerPause } from "react-icons/tb";
import { TbPlayerPlay } from "react-icons/tb";

import over from "./over.wav";
import pretty from "./pretty1.mp3";
import diary from "./diary.mp3";

const data = [
  {
    id: 1,
    musicSrc: over,
    time: 2,
  },
  {
    id: 2,
    musicSrc: pretty,
  },
  {
    id: 3,
    musicSrc: diary,
  },
];

const App = () => {
  const [currentItem, setCurrentItem] = useState(2);
  return (
    <div className="audio-container">
      <BtnSet
        data={data}
        currentItem={currentItem}
        setCurrentItem={setCurrentItem}
      />
    </div>
  );
};

const BtnSet = ({ data, currentItem, setCurrentItem }) => {
  function handleCurrentItem(index) {
    setCurrentItem(index);
  }
  return (
    <>
      {data.map((audioItem, index) => {
        return (
          <>
            <button key={audioItem.id} onClick={() => handleCurrentItem(index)}>
              Audio {index + 1}
            </button>
          </>
        );
      })}
      <AudioFunctionality data={data} currentItem={currentItem} />
    </>
  );
};

const AudioFunctionality = ({ data, currentItem }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const audioRef = useRef(null);

  const intervalRef = useRef(null);

  const startTimer = () => {
    // Clear any timers already running
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        setIsPlaying(false);
        console.log("Song ended");
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, [1000]);
  };

  useEffect(() => {
    if (audioRef.current) {
      setIsPlaying(false);
      audioRef.current.pause();
    }
    audioRef.current = new Audio(data[currentItem].musicSrc);
    // let { duration } = audioRef.current;

    setTrackProgress(audioRef.current.currentTime);
    startTimer();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        clearInterval(intervalRef.current);
      }
    };
  }, [currentItem, data]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      startTimer();
    } else {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    }
  }, [isPlaying]);

  useEffect(() => {
    // Pause and clean up on unmount
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <AudioControls
      isPlaying={isPlaying}
      onPlayPauseClick={setIsPlaying}
      trackProgress={trackProgress}
      // duration={duration}
    />
  );
};

const AudioControls = ({
  isPlaying,
  onPlayPauseClick,
  trackProgress,
  duration,
}) => {
  return (
    <>
      <div>
        {isPlaying ? (
          <button
            type="button"
            className="play-pause-btn"
            onClick={() => onPlayPauseClick(false)}
            aria-label="Pause"
          >
            <TbPlayerPause className="play-btn" />
          </button>
        ) : (
          <p
            type="button"
            className="play-pause-btn"
            onClick={() => onPlayPauseClick(true)}
            aria-label="Play"
          >
            <TbPlayerPlay />
          </p>
        )}
      </div>
      <ProgressBar trackProgress={trackProgress} duration={duration} />
    </>
  );
};

const ProgressBar = (trackProgress, duration) => {
  return (
    <div className="input">
      <input
        type="range"
        value={trackProgress}
        step="1"
        min="0"
        max={duration ? duration : `${duration}`}
      />
    </div>
  );
};

export default App;
