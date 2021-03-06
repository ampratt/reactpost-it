import React from 'react';
import { render } from 'react-dom' //ReactDOM
import  Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time 
import './stylesheets/ui.scss'
// import './stylesheets/app.scss'
// import { Board } from './components/Board'
// import { App } from './components/App'
// import Draggable from 'react-draggable'

// window.React = React


// render(
// 	<Board count={10}/>, 
//      document.getElementById('react-container'))

var Note = React.createClass({
    getInitialState() {
        return {editing: false}
    },
    componentWillMount() {
        this.style = {
            right: this.randomBetween(0, window.innerWidth - 150, 'px'),
            top: this.randomBetween(0, window.innerHeight -150, 'px')
        }
    },
    componentDidUpdate() {
        if (this.state.editing) {
            this.refs.newText.focus()
            this.refs.newText.select()
        }
    },
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.children !== nextProps.children || this.state !== nextState
    },
    randomBetween(x, y, s) {
        return (x + Math.ceil(Math.random() * (y-x))) + s
    },
    edit() {
        this.setState({editing: true})
    },
    save() {
        this.props.onChange(this.refs.newText.value, this.props.id)
        this.setState({editing: false})
    },
    remove() {
        this.props.onRemove(this.props.id)
    },
    renderForm() {
        return (
            <div className="note" 
                 style={this.style}>
              <textarea ref="newText"
                        defaultValue={this.props.children}>
              </textarea>
              <button onClick={this.save}>SAVE</button>
            </div>
        )
    },
    renderDisplay() {
        return ( 
            <div className="note"
                 style={this.style}>
                <p>{this.props.children}</p>
                <span>
                  <button onClick={this.edit}>EDIT</button>
                  <button onClick={this.remove}>X</button>
                </span>
            </div>
            )
    },
    render() {
      // return ( (this.state.editing) ? this.renderForm()
      //                             : this.renderDisplay()
      //   )
      return ( <Draggable>
               {(this.state.editing) ? this.renderForm()
                                  : this.renderDisplay()}
               </Draggable>
        )

    }
})

var Board = React.createClass({
    propTypes: {
        count: function(props, propName) {
            if(typeof props[propName] !== "number") {
                return new Error("the count must be a number")
            } 

            if(props[propName] > 100) {
                return new Error('Creating ' + props[propName] + ' notes is ridiculous')
            }
        }
    },
    getInitialState() {
        return {
            notes: []
        }
    },
    componentWillMount() {
        if (this.props.count) {
            var url = `http://baconipsum.com/api/?type=all-meat&sentences=${this.props.count}`
            fetch(url)
                  .then(results => results.json())
                  .then(array => array[0])
                  .then(text => text.split('. '))
                  .then(array => array.forEach(
                        sentence => this.add(sentence)))
                  .catch(function(err) {
                    console.log("Didn't connect to the API", err)
                  })
        }
    },
    nextId() {
        this.uniqueId = this.uniqueId || 0
        return this.uniqueId++
    },
    add(text) {
        var notes = [
            ...this.state.notes,
            {
                id: this.nextId(),
                note: text
            }
        ]
        this.setState({notes})
    },
    update(newText, id) {
        var notes = this.state.notes.map(
            note => (note.id !== id) ?
               note : 
                {
                    ...note, 
                    note: newText
                }
            )
        this.setState({notes})
    },
    remove(id) {
        var notes = this.state.notes.filter(note => note.id !== id)
        this.setState({notes})
    },
    eachNote(note) {
        return (<Note key={note.id}
                      id={note.id}
                      onChange={this.update}
                      onRemove={this.remove}>
                  {note.note}
                </Note>)
    },
    render() {
        return (<div className='board'>
                   {this.state.notes.map(this.eachNote)}
                   <button onClick={() => this.add('New Note')}>+</button>
                </div>)
    }
})

render(<Board count={7}/>, 
    document.getElementById('react-container'))