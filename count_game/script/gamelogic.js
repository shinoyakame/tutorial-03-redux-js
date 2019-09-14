var image_folder = './src/';
var img_source = [
    'chelonia-01@3x.png',
    'crune-01@3x.png',
    'illus-01@3x.png',
    'ore-01@3x.png',
    'pure-01@3x.png',
    'remedy-01@3x.png',
    'saito-01@3x.png',
    'shelter-01@3x.png',
    'undead-01@3x.png',
    'zero-01@3x.png'
];
img_source.map(function (value, index, array) {
    array[index] = image_folder.concat(value);
})

var container = document.getElementById("character-container");
var countField = document.getElementById("count");

function initialize_character(min, max) {
    counts = Math.floor(Math.random() * (max - min + 1) + min);
    store.dispatch({ type: 'RANDOMCOUNT', payload: counts })
}

//REDUCER
function gameReducer(state, action) {
    var INITIALIZE_STATE = {
        img: [],
        score: 0,
        counts: 0
    };

    if (typeof state === 'undefined') {
        return INITIALIZE_STATE;
    }

    var nextState = Object.assign({}, state);
    switch (action.type) {
        case "RESET":
            return INITIALIZE_STATE;
        case "PLUS":
            nextState = Object.assign(nextState, {
                score: ++state.score
            });
            return nextState;
        case "MINUS":
            if (state.score < 1) {
                return state;
            } else {
                nextState = Object.assign(nextState, {
                    score: --state.score
                });
                return nextState;
            }
        case "RANDOMCOUNT":
            var img_array = new Array(action.payload);
            var index;
            for(index=0; index<img_array.length; index++){
                img_array[index] = img_source[Math.floor(Math.random() * img_source.length)];
            }
            nextState = Object.assign(nextState, {
                counts: action.payload,
                img: img_array
            })
            return nextState;
        default:
            return state;
    }
}

//STORE
var store = Redux.createStore(gameReducer);

store.subscribe(render);

//UI
function render() {
    countField.innerHTML = store.getState().score;
    renderCharacter();
}

function renderCharacter(){
    removeAllChild(container);
    var i;
    for (i = 0; i < store.getState().img.length; i++) {
        var node = document.createElement("img");
        node.setAttribute("src", store.getState().img[i]);
        node.setAttribute("height", "200px");
        node.setAttribute("style", "box-shadow: 2px 2px #555; padding: 1em; background-color: #eee; margin: 1em;");
        container.appendChild(node);
    }
}

function reset() {
    store.dispatch({
        type: 'RESET'
    })
    var min = Math.floor(Math.random() * 3 + 1) //1-4
    var max = Math.floor(Math.random() * 3 + 7) //7-10
    initialize_character(min, max);
}

function removeAllChild(rootElement) {
    while (rootElement.firstChild) {
        rootElement.removeChild(rootElement.firstChild);
    }
}



//ACTIONS
document.getElementById("reset")
    .addEventListener('click', function () {
        reset();
    })
document.getElementById("plus")
    .addEventListener("click", function () {
        store.dispatch({
            type: 'PLUS'
        })
    })
document.getElementById("minus")
    .addEventListener("click", function () {
        store.dispatch({
            type: 'MINUS'
        })
    })
document.getElementById("confirm")
    .addEventListener("click", function () {
        confirm();
    })

function confirm() {
    //if user's answer = count => win
    if (store.getState().score == store.getState().counts) {
        alert('You Win !!!');
        reset();
    } else {
        alert('Wrong, please try again...');
    }
}

reset();