function createStore(reducer) {
  let state = null;
  const listeners = [];
  const subscribe = (listener) => listeners.push(listener);
  const getState = () => state;
  //订阅者模式 更改数据自动渲染
  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((listener) => listener());
  };
  dispatch({}); // 初始化 state
  return { getState, dispatch, subscribe };
}

function renderApp(newAppState, oldAppState = {}) {
  if (newAppState === oldAppState) return;
  console.log("render app");
  renderTitle(newAppState.title, oldAppState.title);
  renderContent(newAppState.content, oldAppState.content);
}

function renderTitle(newTitle, oldTitle = {}) {
  if (newTitle === oldTitle) return;
  console.log("render title");
  const titleDOM = document.getElementById("title");

  titleDOM.innerHTML = newTitle.text;
  titleDOM.style.color = newTitle.color;
}

function renderContent(newContent, oldContent = {}) {
  if (newContent === oldContent) return;
  console.log("render content");
  const contentDOM = document.getElementById("content");
  contentDOM.innerHTML = newContent.text;
  contentDOM.style.color = newContent.color;
}

let appState = {};

function reducer(state, action) {
  if (!state) {
    return {
      title: {
        text: "React小书",
        color: "red",
      },
      content: {
        text: "React小书内容",
        color: "blue",
      },
    };
  }
  //采用共同结构对象，防止渲染整个页面
  switch (action.type) {
    case "UPDATE_TITLE_TEXT":
      return {
        ...state,
        title: {
          ...state.title,
          text: action.text,
        },
      };
      break;
    case "UPDATE_TITLE_COLOR":
      return {
        ...state,
        title: {
          ...state.title,
          color: action.color,
        },
      };
      break;
    default:
      return state;
  }
}

const store = createStore(reducer);
let oldState = store.getState();
store.subscribe(() => {
  const newState = store.getState();
  renderApp(newState, oldState);
  oldState = newState;
});
renderApp(store.getState()); //首次渲染页面
store.dispatch({ type: "UPDATE_TITLE_TEXT", text: "《React.js小书》" });
store.dispatch({ type: "UPDATE_TITLE_COLOR", color: "pink" });
