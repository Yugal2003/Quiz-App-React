import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Quiz = () => {
  let [questions, setQuestions] = useState([]);
  let [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  let [total, setTotal] = useState(0);
  let [time, setTime] = useState(15);
  let [showAnswer, setShowAnswer] = useState(false);
  let [wrongQuestions, setWrongQuestions] = useState([]);
  let [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let fetchQuestions = async () => {
      try {
        let response = await axios.get("https://opentdb.com/api.php?amount=10&type=multiple");
        setQuestions(response.data.results);
      } catch (error) {
        console.log(error);
      }
    }
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (!isPaused) {
      let timer = setTimeout(() => {
        if (time > 0) {
          setTime(time - 1);
        } else {
          handleTime();
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [time, isPaused]);

  function handleTime() {
    moveToNextQuestion();
  }

  function moveToNextQuestion() {
    setShowAnswer(false);
    let nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      setTime(15);
    } else {
      if (time === 0) {
        toast.success('Quiz completed Your score is :' + total);
      } else {
        setTime(time - 1);
      }
    }
  }

  function submitAnswer(selectedOption) {
    setIsPaused(true);
    let currentQuestion = questions[currentQuestionIndex];
    setShowAnswer(true);

    if (currentQuestion.correct_answer === selectedOption) {
      toast.success('Correct Answer !!!')
      setTotal(total + 1);
    } else {
      toast.success('Wrong Answer !!!')
      setWrongQuestions([...wrongQuestions, currentQuestion]);
    }

    setTimeout(() => {
      if (currentQuestionIndex + 1 === questions.length) {
        setTime(0);
      } else {
        moveToNextQuestion();
      }
      setIsPaused(false);
    }, 4000);
  }

  function handleSkipQuestion() {
    toast.success('Skip Question')
    setIsPaused(true);
    setWrongQuestions([...wrongQuestions, questions[currentQuestionIndex]]);
    setTimeout(() => {
      setIsPaused(false);
      moveToNextQuestion();
    }, 1000);
  }

  return (
    <div>
      {
        questions.length === 0 ? (<div className='flex flex-col justify-center items-center text-2xl min-h-96'>
          <h1>Loading...</h1><br></br>
          <h5>Refresh Page !!!</h5>
        </div>) : (
          <div className='w-[100%] flex flex-col justify-center items-center min-h-72 mt-8'>

            <div className='text-center m-auto mt-4 mb-4'>
              <h1 className='font-semibold text-3xl'>USA Quiz</h1>
              <h2 className='font-semibold text-xl mt-2'>Current Score: {total}</h2>
            </div>

            <div className='border-4 border-black rounded-lg bg-gray-400 items-center justify-center mx-auto w-[100%] md:w-[85%] lg:w-[70%] h-[100%]'>
              <h2 className='text-white text-2xl font-semibold w-[100%] mx-auto text-center mt-4'>Question: {currentQuestionIndex + 1} out of {questions.length}</h2><br></br>
              <p className='text-blue-900  text-xl md:text-2xl w-[100%] mx-auto text-center'>Q.{currentQuestionIndex + 1}.{questions[currentQuestionIndex].question}</p>

              {/* <div className='w-[100%]'> */}
                {questions[currentQuestionIndex].incorrect_answers.map((option, index) => (
                  <div className='w-[100%] items-center text-center justify-center mx-auto'>
                      <button
                      className='border-2 border-white w-[80%] text-lg md:w-[50%] rounded-lg py-1 mt-2'
                      key={index}
                      onClick={() => submitAnswer(option)}
                      disabled={showAnswer}>
                        {option}
                      </button>
                  </div>
                ))}

                <div className='w-[100%] items-center text-center justify-center mx-auto'>
                    <button
                      className='border-2 border-white w-[80%] text-lg md:w-[50%] rounded-lg py-0 md:py-1 mt-2'
                      onClick={() => submitAnswer(questions[currentQuestionIndex].correct_answer)}
                      disabled={showAnswer}
                    >
                      {questions[currentQuestionIndex].correct_answer}
                    </button>
                </div>

              {/* </div> */}
            
              {showAnswer && (
                <div className='w-[100%] items-center text-center justify-center mx-auto'>
                  <p className='border-2 border-black text-center text-lg mt-2 w-[80%] md:w-[50%] mx-auto rounded-lg text-green-700 font-bold'>Correct Answer: {questions[currentQuestionIndex].correct_answer}</p>
                </div>
              )}
              <div className='mt-4 mb-2 flex justify-around w-[100%] items-center text-center mx-auto'>
                <p className='text-red-600 font-semibold border-2 text-lg border-black p-1 rounded-lg'>Time Left: {time} sec</p>
                {currentQuestionIndex < 9 && <button className='text-red-600 text-lg font-semibold p-1 rounded-lg border-2 border-black' onClick={handleSkipQuestion} disabled={showAnswer}>Skip Question</button>}
              </div>
            </div>
          </div>
        )
      }
      {currentQuestionIndex >= questions.length && (
        <div>
          {wrongQuestions.map((question, index) => (
            <div key={index}>
              <p>Question: {question.question}</p>
              <p>Correct Answer: {question.correct_answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Quiz;