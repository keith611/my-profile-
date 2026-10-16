import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { getVisibleQuestions, questionsById } from '../data/survey.js';

const STORAGE_KEY = 'vexa-survey-state-v1';

const initialState = {
  answers: {},
  currentIndex: 0,
  submitted: false,
  responseId: null,
  clientRequestId: crypto.randomUUID(),
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw);
    return {
      ...initialState,
      ...parsed,
      answers: parsed.answers && typeof parsed.answers === 'object' ? parsed.answers : {},
    };
  } catch {
    return initialState;
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'set_answer':
      return { ...state, answers: { ...state.answers, [action.id]: action.value } };
    case 'set_index':
      return { ...state, currentIndex: action.index };
    case 'submitted':
      return {
        ...state,
        submitted: true,
        responseId: action.responseId,
      };
    case 'reset':
      return {
        answers: {},
        currentIndex: 0,
        submitted: false,
        responseId: null,
        clientRequestId: crypto.randomUUID(),
      };
    default:
      return state;
  }
}

const SurveyContext = createContext(null);

export function SurveyProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const visibleQuestions = useMemo(
    () => getVisibleQuestions(state.answers),
    [state.answers],
  );

  const value = useMemo(
    () => ({
      answers: state.answers,
      currentIndex: state.currentIndex,
      submitted: state.submitted,
      responseId: state.responseId,
      clientRequestId: state.clientRequestId,
      visibleQuestions,
      setAnswer: (id, value) => dispatch({ type: 'set_answer', id, value }),
      setIndex: (index) => dispatch({ type: 'set_index', index }),
      goToQuestion: (id) => {
        const index = visibleQuestions.findIndex((question) => question.id === id);
        if (index >= 0) dispatch({ type: 'set_index', index });
      },
      markSubmitted: (responseId) => dispatch({ type: 'submitted', responseId }),
      resetSurvey: () => dispatch({ type: 'reset' }),
      getQuestion: (id) => questionsById[id],
    }),
    [state, visibleQuestions],
  );

  return <SurveyContext.Provider value={value}>{children}</SurveyContext.Provider>;
}

export function useSurvey() {
  const ctx = useContext(SurveyContext);
  if (!ctx) {
    throw new Error('useSurvey must be used within SurveyProvider');
  }
  return ctx;
}
