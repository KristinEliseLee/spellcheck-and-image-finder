const React = require('react');
const ReactDOM = require('react-dom');
import wordFile from './wordFile.js';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'bootstrap';
import './node_modules/bootstrap/dist/css/bootstrap.min.css';

const wordSet = new Set(wordFile.split(/\n/))

function openInNewTab(url) {
        var win = window.open(url, '_blank');
        win.focus();
}

function removeNonLetters(word) {
    let newWord = ''
    for (let letter of word) {
        if (letter.match(/[a-z]/i)) {
            newWord += letter;
        }
    }
    newWord.toLowerCase();
    return newWord;
}
function makeRegEx(word) {
    let newWord = '\n'
    for (let letter of word) {
        if (new Set(['a', 'e', 'i', 'o', 'u']).has(letter)){
            newWord += ".";
        }
        else {
            newWord += letter;
        }
    }

    newWord += '\n';

    return new RegExp(newWord, 'i');
}

function getWordMatch(word) {
    
    word = removeNonLetters(word);
    if (wordSet.has(word)) {
        return word;
    }

    const wordRegExp = makeRegEx(word);

    const answers = wordFile.match(wordRegExp);
    if (answers !== null) {
        return answers[0]
    }

    return word;
}

function SearchBox(props) {
    return (
        <>
           
                <input type='text' id='Searchbox' value={props.query} onChange={props.handleChange}/>
                <button id="Searchbutton" onClick={props.handleSearch}>Search</button>

        </>
            )
}

function MyModal(props) {
    let hostURL = props.image.hostPageDisplayUrl
    console.log(hostURL)
    return (
            <Modal isOpen={props.show} toggle={props.toggleModal}>
                <Button color="danger" onClick={props.toggleModal} id='close-modal'>Close</Button>
                <ModalHeader>{props.image.name}</ModalHeader>
                <ModalBody>
                <img src={props.image['contentUrl']} width='100%' />
                <a onClick={() => { openInNewTab(hostURL) }}>Origin</a>
                </ModalBody>
            </Modal>
    )
    
}

function SearchResults(props) {
    const allresults = []
    let i = 0
    for (let result of props.results) {
        allresults.push(
            <img src={result['contentUrl']} width='100px' height='100px' id={i} key={i} onClick={props.toggleModal} />
        )
        i++
    }
    return (
        <>
            {allresults}
        </>
    );

}
 class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '', results: [], showModal: false, mainImage: {} };
        this.handleChange = this.handleChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.toggleModal = this.toggleModal.bind(this)
     }

     handleChange(event) {
         this.setState({ query: event.target.value })

     }
     handleSearch(event) {
         const answer = []
         for (let word of this.state.query.split(/\s+/)) {
             answer.push(getWordMatch(word));
         }
         this.setState({ query: answer.join(' ') });

         let url = `search/?q=${encodeURIComponent(answer.join(" "))}`
         fetch(url)
             .then((results) => results.json())
             .then(data => {
                 this.setState({ results: data });
         });
     }
     toggleModal(event) {
         if (event.target.id && isNaN(event.target.id) === false) {
             const imgNum = event.target.id
             this.setState({ showModal: true, mainImage: this.state.results[imgNum] })
             
         }
         else {
             this.setState({ showModal: false })
         }
     }

    render() {
        return (
            <>
                <MyModal show={this.state.showModal} image={this.state.mainImage} toggleModal={this.toggleModal} />
                <SearchBox query={this.state.query} handleChange={this.handleChange}
                    handleSearch={this.handleSearch} />
                <div>
                    <SearchResults results={this.state.results} toggleModal={this.toggleModal} />
                </div>
            </>

        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));