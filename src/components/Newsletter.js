import React, { Component } from "react"
import styled from "styled-components"
import { rhythm } from "@utils/typography"
import * as EmailValidator from "email-validator"

const Wrapper = styled.div`
  margin: 0 -${rhythm(0.75)};
  padding: 0 0 ${rhythm(0.5)};
`

const Form = styled.form`
  border: none;
  margin: 0 auto;
`

const H4 = styled.h4`
  color: rgb(82, 96, 109);
  font-size: ${rhythm(1)};
  font-weight: 700;
  text-transform: none;
  letter-spacing: normal;
`

const Subheader = styled.div`
  color: rgb(97, 110, 124);
`

const EmailInput = styled.input`
  color: rgb(81, 81, 81);
`

const Submit = styled.button`
  color: rgb(255, 255, 255);
  background-color: #2680c2;
  border-radius: 25px;
  font-weight: 700;
`

const Guarantee = styled.div`
  color: rgb(123, 135, 148);
  font-size: ${rhythm(0.5)};
`

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
      <Wrapper>
        <Form
          action="https://app.convertkit.com/forms/844000/subscriptions"
          className="seva-form formkit-form"
          method="post"
          data-sv-form="844000"
          data-uid="46337bc252"
          data-format="inline"
          data-version="5"
          data-options='{"settings":{"after_subscribe":{"action":"redirect","redirect_url":"https://markshust.com/confirm/","success_message":"Success! Now check your email to confirm your subscription."},"return_visitor":{"action":"show","custom_content":""},"recaptcha":{"enabled":false}}}'
          minWidth="400 500 600 700 800"
          onSubmit={this.handleSubmit}
        >
          <div data-style="minimal">
            <H4 className="formkit-header" data-element="header">
              Like this article?
            </H4>
            <Subheader data-element="subheader" className="formkit-subheader">
              <p>Get notified when I post new ones.</p>
            </Subheader>
            <ul
              className="formkit-alert formkit-alert-error"
              data-element="errors"
              data-group="alert"
            />
            <div
              data-element="fields"
              data-stacked="false"
              className="seva-fields formkit-fields"
            >
              <div className="formkit-field">
                <EmailInput
                  className="formkit-input"
                  name="email_address"
                  placeholder="Your email address"
                  required=""
                  type="text"
                  value={this.state.email}
                  onChange={this.handleEmailChange}
                />
                <div style={{ color: "red" }}>{this.state.emailError}</div>
              </div>
              <Submit
                data-element="submit"
                className="formkit-submit formkit-submit"
              >
                <div className="formkit-spinner">
                  <div />
                  <div />
                  <div />
                </div>
                <span>Get Notified</span>
              </Submit>
            </div>
            <Guarantee data-element="guarantee" className="formkit-guarantee">
              <p>I won't send you spam. Unsubscribe at any time.</p>
            </Guarantee>
          </div>
        </Form>
      </Wrapper>
    )
  }
}

export default Newsletter
