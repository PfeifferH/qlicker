// QLICKER
// Author: Enoch T <me@enocht.am>
//
// CreateCourseModal.jsx: popup dialog to prompt for course details

import React from 'react'
import _ from 'underscore'

import { ControlledForm } from '../ControlledForm'

export const DEFAULT_STATE = {
  name: '',
  description: '',
  courseId: '',
  quiz: false,
  dueDate: undefined
}

export class CreateSessionModal extends ControlledForm {

  constructor (props) {
    super(props)
    this.state = _.extend({}, DEFAULT_STATE)
  }

  /**
   * done(Event: e)
   * Overrided onChange handler to update state with exception for session details
   */
  setValue (e) {
    let stateEdits = {}
    let key = e.target.dataset.name
    if (key === 'quiz') stateEdits[e.target.dataset.name] = (e.target.value === 'true')
    else stateEdits[e.target.dataset.name] = e.target.value
    this.setState(stateEdits)
  }

  /**
   * handleSubmit(Event: e)
   * onSubmit handler for course form. Calls courses.createSession
   */
  handleSubmit (e) {
    super.handleSubmit(e)

    let session = _.extend({
      createdAt: new Date(),
      courseId: this.props.courseId
    }, this.state)

    if (Meteor.isTest) {
      this.props.done(session)
    }

    Meteor.call('courses.createSession', this.props.courseId, session, (error) => {
      if (error) alertify.error('Error: ' + error.error)
      else {
        alertify.success('Session Created')
        this.done()
      }
    })
  }

  /**
   * done(Event: e)
   * Overrided done handler
   */
  done (e) {
    this.refs.createSessionForm.reset()
    this.setState(_.extend({}, DEFAULT_STATE))
    super.done()
  }

  render () {
    return (<div className='ql-modal-container' onClick={this.done}>
      <div className='ql-modal ql-modal-createsession container' onClick={this.preventPropagation}>
        <h2>Create Session</h2>
        <form ref='createSessionForm' className='ql-form-createsession' onSubmit={this.handleSubmit}>
          <label>Name:</label>
          <input type='text' data-name='name' className='form-control' onChange={this.setValue} placeholder='Week 2 Lecture 3' /><br />

          <label>Description:</label>
          <textarea type='text' data-name='description' className='form-control' onChange={this.setValue} placeholder='Quiz on topic 3' /><br />

          <label>Format:</label>
          <select data-name='quiz' className='form-control' onChange={this.setValue} >
            <option value='false' default>Lecture Poll</option>
            <option value='true'>Online Quiz</option>
          </select><br />

          { this.state.quiz ? 'Deadline: <datepicker here><br />' : '' }

          <div className='ql-buttongroup'>
            <a className='btn btn-default' onClick={this.done}>Cancel</a>
            <input className='btn btn-default' type='submit' id='submit' />
          </div>
        </form>
      </div>
    </div>)
  } //  end render

} // end CreateSessionForm