import React, { Component } from "react"
import * as EmailValidator from "email-validator"

class Newsletter extends Component {
  state = {
    email: "",
    emailError: "",
  }

  handleEmailChange = event => {
    this.setState({ email: event.target.value, emailError: "" })
  }

  handleSubmit = event => {
    event.preventDefault()

    this.setState({ emailError: "" })

    if (!this.state.email) {
      this.setState({ emailError: "Email is required" })
      return
    }

    if (EmailValidator.validate(this.state.email)) {
      console.log("valid email")
      event.currentTarget.submit()
    } else {
      this.setState({ emailError: "Email is invalid" })
      console.log("invalid email")
    }
  }

  render() {
    return (
      <form
        action="https://app.convertkit.com/forms/1080992/subscriptions"
        className="seva-form formkit-form"
        method="post"
        data-sv-form="1080992"
        data-uid="5d9cc72515"
        data-format="inline"
        data-version="5"
        data-options='{"settings":{"after_subscribe":{"action":"redirect","redirect_url":"https://markshust.com/confirm/","success_message":"Success! Now check your email to confirm your subscription."},"return_visitor":{"action":"show","custom_content":""},"recaptcha":{"enabled":false}}}'
        minwidth="400 500 600 700 800"
        onSubmit={this.handleSubmit}
      >
        <div className="bg-white">
          <div className="max-w-screen-xl mx-auto px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
            <div className="px-6 py-6 bg-blue-600 rounded-lg md:py-12 md:px-12 lg:py-16 lg:px-16 xl:items-center">
              <h2 className="text-2xl leading-8 font-extrabold tracking-tight text-white sm:text-3xl sm:leading-9 font-sans">
                Are you a Magento geek?
              </h2>
              <p
                className="mt-3 mb-6 max-w-3xl text-lg leading-6 text-indigo-200"
                id="newsletter-headline"
              >
                Signup for my newsletter and I'll let you know about{" "}
                <span className="inline-block">Magento-related</span> blogs,
                courses & more.
              </p>
              <div className="mt-8 sm:w-full sm:max-w-lg xl:mt-0">
                <ul
                  className="formkit-alert formkit-alert-error"
                  data-element="errors"
                  data-group="alert"
                />
                <div
                  data-element="fields"
                  data-stacked="false"
                  className="seva-fields formkit-fields grid grid-cols-1 lg:grid-cols-5"
                >
                  <div className="formkit-field col-span-3">
                    <input
                      className="formkit-input w-full appearance-none px-5 py-3 border border-transparent text-base leading-6 rounded-md text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 transition duration-150 ease-in-out"
                      name="email_address"
                      placeholder="Your email address"
                      required=""
                      type="text"
                      value={this.state.email}
                      onChange={this.handleEmailChange}
                    />
                    <div style={{ color: "red" }}>{this.state.emailError}</div>
                  </div>
                  <button
                    type="submit"
                    data-element="submit"
                    className="formkit-submit formkit-submit mt-4 lg:mt-0 lg:ml-3 px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-orange-500 hover:bg-orange-400 focus:outline-none focus:bg-orange-400 transition duration-150 ease-in-out col-span-2"
                  >
                    <div className="formkit-spinner">
                      <div />
                      <div />
                      <div />
                    </div>
                    <span>Get Magento Info</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }
}

export default Newsletter
