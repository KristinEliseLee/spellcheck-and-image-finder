const React = require('react');
const ReactDOM = require('react-dom');
import wordFile from './wordFile.js';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'bootstrap';

/*wordSet is used just to see if word already exists before trying to fix any vowels.*/
const wordSet = new Set(wordFile.split(/\n/)) 

/*used to open an new tab with the target link*/
function openInNewTab(url) {
        const win = window.open(url, '_blank');
        win.focus();
}

/*Takes out anything that is not a-z, case-insensitive*/
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

/*Creates the regexp for the word, adding newline characters at begining and end, replacing vowels with '.'*/
function makeRegExp(word) {
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

/*Checks to see if word is in wordSet, if not word is turned into regexp and first match is returned. if no match found, original word returned*/
function getWordMatch(word) {
    
    word = removeNonLetters(word);
    if (wordSet.has(word)) {
        return word;
    }

    const wordRegExp = makeRegExp(word);

    const answers = wordFile.match(wordRegExp);
    if (answers !== null) {
        return answers[0]
    }

    return word;
}

/*Renders a searchbox and submit button*/
function SearchBox(props) {
    return (
        <form onSubmit={props.handleSearch}>
            <input type='text' id='Searchbox' value={props.query} onChange={props.handleChange}/>
            <input type='submit' id="Searchbutton" value='Search'/>
        </form>
    )
}

/*Renders a Modal when image selected*/
function MyModal(props) {
    let hostURL = props.image.hostPageDisplayUrl;
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

/*Renders all search result images*/
function SearchResults(props) {
    const allresults = [];
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

/*Main react component. Renders whole page.*/
 class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '', results: [], showModal: false, mainImage: {} };
        this.handleChange = this.handleChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.toggleModal = this.toggleModal.bind(this)
     }

    /* Manages typing in the input field*/
     handleChange(event) {
         this.setState({ query: event.target.value })

     }

    /*Manages submitting search form*/
     handleSearch(event) {
         event.preventDefault();
         const answer = [];
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

    /*Handles clicking on an image or closing the modal window*/
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
