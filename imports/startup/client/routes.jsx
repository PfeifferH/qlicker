// QLICKER
// Author: Enoch T <me@enocht.am>
//
// routes.jsx: iron-router routes

import React from 'react'
import { mount } from 'react-mounter'

// Layouts and Pages
import { AppLayout } from '../../ui/layouts/app_layout'
import { Homepage } from '../../ui/pages/home'
import { Loginpage } from '../../ui/pages/login'

// TODO sort out these importing inconsistencies
import PageContainer from '../../ui/pages/page_container'

// For routes that are waiting on data,
// this.render('blank') is needed cause ironrouter expects you to render a blaze template
// we need to remove default ironrouter Loading... message cause we aren't using templates

Router.route('/', function () {
  mount(AppLayout, { content: <Homepage /> })
}, {
  name: 'home'
})

Router.route('/login', function () {
  mount(AppLayout, { content: <Loginpage /> })
}, {
  name: 'login'
})

Router.onBeforeAction(function () {
  this.render('blank') // workaround for mounting react without blaze template
  this.next()
})

// Admin routes
import { AdminDashboard } from '../../ui/pages/admin_dashboard'
Router.route('/admin', {
  name: 'admin',
  waitOn: function () {
    return Meteor.subscribe('userData')
  },
  action: function () {
    let user = Meteor.user()
    if (Meteor.userHasRole(user, 'admin')) {
      mount(AppLayout, { content: <PageContainer> <AdminDashboard /> </PageContainer> })
    } else Router.go('login')
  }
})

// Prof routes
import ProfessorDashboard from '../../ui/pages/professor_dashboard'
import ManageCourse from '../../ui/pages/manage_course'

Router.route('/manage', {
  name: 'professor',
  waitOn: function () {
    return Meteor.subscribe('userData')
  },
  action: function () {
    let user = Meteor.user()
    if (Meteor.userHasRole(user, 'professor')) {
      mount(AppLayout, { content: <PageContainer> <ProfessorDashboard /> </PageContainer> })
    } else Router.go('login')
  }
})

Router.route('/manage/course/:_id', {
  name: 'manage.course',
  waitOn: function () {
    return Meteor.subscribe('userData')
  },
  action: function () {
    if (Meteor.userRoleGreater(Meteor.user(), 'professor')) {
      mount(AppLayout, { content: <PageContainer> <ManageCourse courseId={this.params._id} /> </PageContainer> })
    } else Router.go('login')
  }
})

// Student Routes
import { StudentDashboard } from '../../ui/pages/student_dashboard'
Router.route('/student', {
  name: 'student',
  waitOn: function () {
    return Meteor.subscribe('userData')
  },
  action: function () {
    if (Meteor.userRoleGreater(Meteor.user(), 'student')) {
      mount(AppLayout, { content: <PageContainer> <StudentDashboard /> </PageContainer> })
    } else Router.go('login')
  }
})
